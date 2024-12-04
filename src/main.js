import { Application } from "./application.js";

    const app = new Application();
    app.run();

    const currentWeather = document.querySelector('.weather-button');
    const apiKey = 'bfbc80abeee74baa845175032240312';

    currentWeather.onclick = function(e){
        e.preventDefault()
        let latitude = document.getElementById('latitude').value.trim();
        let longitude = document.getElementById('longitude').value.trim();
        if (isNaN(latitude) || isNaN(longitude))
            alert('Пожалуйста, введите числовые значения для широты и долготы.')
        if (latitude < -90 || latitude > 90)
            alert('Широта должна быть в диапазоне от -90 до +90.')
        if (longitude < -180 || longitude > 180)
            alert('Долгота должна быть в диапазоне от -180 до +180.')

        fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.error)
                    alert(`${data.error.message}: введите другие координаты`)
                else{
                    const html = `<div class="card">
                                    <h2 class="card__city">${data.location.name}</h2>
                                    <div class="card__weather">
                                        <div class="temp">${data.current.temp_c}°</div>
                                        <img class="weather-icon" src="icons/sun/4.png" alt="Weather" width="130">
                                    </div>
                                    <div class="card__wind">Ветер: ${(data.current.wind_kph / 3.6).toFixed(1)} м/с</div>
                                    <div class="card__humidity">Влажность: ${data.current.humidity}%</div>
                                    <button class="card__delete">Удалить</button>
                                </div>`

                currentWeather.insertAdjacentHTML('afterend', html)
                }

                

            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
        }

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('card__delete')) {
                const card = e.target.closest('.card');
                if (card) {
                    card.remove();
                }
            }
        });