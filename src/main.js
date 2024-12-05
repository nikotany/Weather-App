import { Application } from "./application.js";
import conditions from "./condition.js";

const app = new Application();
app.run();

const currentWeather = document.querySelector('.weather-button');
const apiKey = 'bfbc80abeee74baa845175032240312';

function removeCard(){
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('card-data__delete')) {
            const card = e.target.closest('.card');
            if (card) {
                card.remove();
            }
        }
    });
}

function checkValues(latitude, longitude) {
    const errors = [];
    if (latitude === '' || longitude === '')
        errors.push('Пожалуйста, заполните оба поля: широту и долготу.');
    if (latitude.includes(',') || longitude.includes(',')) 
        errors.push('Пожалуйста, используйте "." в качестве разделителя для дробных чисел.');
    if (isNaN(latitude) || isNaN(longitude)) {
        errors.push('Пожалуйста, введите числовые значения для широты и долготы.');
        clearInput('latitude');
        clearInput('longitude');
    }
    if (latitude < -90 || latitude > 90) {
        errors.push('Широта должна быть в диапазоне от -90 до +90.');
        clearInput('latitude');
    }
    if (longitude < -180 || longitude > 180) {
        errors.push('Долгота должна быть в диапазоне от -180 до +180.');
        clearInput('longitude');
    }
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }
    return true;
}

function handleCoordinateError(error){
    let errorMessage = error.message
    if (errorMessage === 'No matching location found.')
        errorMessage = 'Не найден город с такими координатами'
    alert(errorMessage)
}

const clearInput = (obj) => document.getElementById(obj).value = '';

function showCard({name, temp, wind, humidity, imgPath, mapPath}){
    const html = `<div class="card">
                    <div class="card-data">
                        <h2 class="card-data__city">${name}</h2>
                        <div class="card-data__weather">
                            <div class="temp">${temp}°</div>
                            <img class="weather-icon" src=${imgPath} alt="Weather" width="130">
                        </div>
                        <div class="card-data__wind">Ветер: ${wind} м/с</div>
                        <div class="card-data__humidity">Влажность: ${humidity}%</div>
                        <button class="card-data__delete">Удалить</button>
                    </div>  
                    <img class="map" src=${mapPath} alt="карта" width="500">      
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
    // let info = conditions.find((obj) => obj.code === data.current.condition.code)
    // let filePath = './icons/' + (data.current.is_day ? 'day' : 'night') + '/'
    // let fileName = (data.current.is_day ? info.day : info.night) + '.png'
    // let imgPath = filePath + fileName
    let imgPath = data.current.condition.icon
    return imgPath
}

function workData(latitude, longitude, data){
    let mapPath = `https://static.maps.2gis.com/1.0?s=500x339&pt=${latitude},${longitude}~k:p~c:rd~s:s`
    let weatherData = {
        name: data.location.name,
        temp: data.current.temp_c,
        wind: convertWindSpeed(data.current.wind_kph),
        humidity: data.current.humidity,
        imgPath: getImgPath(data),
        mapPath: mapPath
    }; 

    showCard(weatherData);  

    clearInput('latitude');
    clearInput('longitude');
}

currentWeather.onclick = async function(e) {
    e.preventDefault();
    let latitude = document.getElementById('latitude').value.trim();
    let longitude = document.getElementById('longitude').value.trim();

    if (!checkValues(latitude, longitude)) return;

    let data = await getWeather(latitude, longitude);

    if (data.error) {
        handleCoordinateError(data.error);
        clearInput('latitude');
        clearInput('longitude');
    } else 
        workData(latitude, longitude, data)
};
removeCard()