import { Application } from "./application.js";
import conditions from "./condition.js";

console.log(conditions)

const app = new Application();
app.run();

const currentWeather = document.querySelector('.weather-button');
const apiKey = 'bfbc80abeee74baa845175032240312';

function removeCard(){
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('card__delete')) {
            const card = e.target.closest('.card');
            if (card) {
                card.remove();
            }
        }
    });
}

function checkValues(latitude, longitude){
    if (latitude === '' || longitude === ''){
        alert('Пожалуйста, заполните оба поля: широту и долготу.')
        return false
    }
    if (latitude.includes(',') || longitude.includes(',')) {
        alert('Пожалуйста, используйте "." в качестве разделителя для дробных чисел.');
        return false;
    }
    if (isNaN(latitude) || isNaN(longitude)){
        alert('Пожалуйста, введите числовые значения для широты и долготы.')
        return false
    }
    if (latitude < -90 || latitude > 90){
        alert('Широта должна быть в диапазоне от -90 до +90.')
        return false
    }
    if (longitude < -180 || longitude > 180){
        alert('Долгота должна быть в диапазоне от -180 до +180.')
        return false
    }
    return true
}

function handleCoordinateError(error){
    let errorMessage = error.message
    if (errorMessage === 'No matching location found.')
        errorMessage = 'Не найден город с такими координатами'
    const html = `<div class="card">
                    <h2 class="card__city">${errorMessage}</h2>
                    <button class="card__delete">Удалить</button>
                </div>`
    currentWeather.insertAdjacentHTML('afterend', html)
}

function showCard({name, temp, wind, humidity, imgPath}){
    const html = `<div class="card">
                    <h2 class="card__city">${name}</h2>
                    <div class="card__weather">
                        <div class="temp">${temp}°</div>
                        <img class="weather-icon" src="${imgPath}" alt="Weather" width="130">
                    </div>
                    <div class="card__wind">Ветер: ${wind} м/с</div>
                    <div class="card__humidity">Влажность: ${humidity}%</div>
                    <button class="card__delete">Удалить</button>
                </div>`

    currentWeather.insertAdjacentHTML('afterend', html)
}

const convertWindSpeed = (wind) => (wind / 3.6).toFixed(1)

async function getWeather(latitude, longitude) {
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`
    try{
        let response = await fetch(url)
        let data = await response.json()
        console.log(data)
        return data
    } catch(error){
        console.error('Error fetching weather data:', error);
    }
}

function getImgPath(data){
    let info = conditions.find((obj) => obj.code === data.current.condition.code)
    let filePath = './icons/' + (data.current.is_day ? 'day' : 'night') + '/'
    let fileName = (data.current.is_day ? info.day : info.night) + '.png'
    let imgPath = filePath + fileName
    return imgPath
}

currentWeather.onclick = async function(e){
    e.preventDefault()
    let latitude = document.getElementById('latitude').value.trim();
    let longitude = document.getElementById('longitude').value.trim();

    if (!checkValues(latitude, longitude)) 
        return
        
    let data = await getWeather(latitude, longitude)

    if (data.error)
        handleCoordinateError(data.error)
    else{
        let weatherData = {
            name: data.location.name,
            temp: data.current.temp_c,
            wind: convertWindSpeed(data.current.wind_kph),
            humidity: data.current.humidity,
            imgPath: getImgPath(data)
        }
        showCard(weatherData)
    }
}
removeCard()