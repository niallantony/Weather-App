// import "./style.css";n
import { weatherApi } from "./weatherApi.js";
import { carouselWheel } from "./carousel.js";
import { searchButton } from "./search.js"; 

const screenController = (() => {
    const container = document.getElementById('container');
    const locationDiv = container.querySelector('.location');
    const conditionDiv = container.querySelector('.condition');
    const weatherImage = container.querySelector('img');
    const carousel = document.getElementById('carousel');
    let currentData = {}

    const populatePage = (data) => {
        locationDiv.textContent = data.location.name + ' : ' + data.location.country;
        conditionDiv.textContent = data.current.condition.text;
        weatherImage.src = data.current.condition.icon;
        currentData = Object.assign({},data);
        console.log("Saved Data : ", currentData);
    }

    const initialLoad = async () => {
        await weatherApi.getForecastAtIP()
        const forecast = await weatherApi.getForecast("ip")
        .catch(err => console.log(err));

        console.log(forecast);
        populatePage(forecast);
    }

    const getTime = (data) => {
        return Number(data.current.last_updated.slice(-5,-3));
    }

    const calculateSixHoursLater = (time) => {
        return time > 24 ? ( time + 6 ) % 24 : time + 6 ;
    }

    const weatherValuesDay = (input) => {
        const weather = {};
        weather.icon = input.day.condition.icon;
        weather.text = input.day.condition.text;
        weather.chanceOfRain = input.day.daily_chance_of_rain
        weather.avgTemp = input.day.avgtemp_c
        weather.humid = input.day.avghumidity
        return weather;
    }
    
    const weatherValuesHour = (day, input) => {
        const weather = {};
        weather.icon = day.hour[input].condition.icon;
        weather.text = day.hour[input].condition.text;
        weather.chanceOfRain = day.hour[input].chance_of_rain
        weather.avgTemp = day.hour[input].heatindex_c
        weather.humid = day.hour[input].humidity
        return weather;
    }

    const constructForecast = (curTime,laterTime) => {
        const days = currentData.forecast.forecastday;
        const laterWeather = curTime > 24 ? weatherValuesHour(days[1],laterTime) : weatherValuesHour(days[0],laterTime);
        const tomorrowWeather = weatherValuesDay(days[1]);
        const dayThreeWeather = weatherValuesDay(days[2]);
        return {
            Later:laterWeather,
            Tomorrow:tomorrowWeather,
            Day_3:dayThreeWeather
        }
    }

    const forecastFrame = () => {
        const frame = document.getElementById('front');
        const curTime = getTime(currentData);
        const laterTime = calculateSixHoursLater(curTime);
        const forecast = constructForecast(curTime,laterTime)
        const tempIcon = './src/images/temp.svg'
        const rainfallIcon = './src/images/rain-small.svg'
        const humidIcon = './src/images/humid.svg'
        console.table(forecast);
        for (let key in forecast) {
            const weather = forecast[key];
            if (key === 'Day_3') key = "Day after tomorrow";
            const weatherChip = document.createElement('div');
            weatherChip.classList.add('weather-chip');
            weatherChip.innerHTML = `<img src="${weather.icon}">
            <div class="chip-info">
                <h3 class="day">${key}</h3>
                <p class="chip-cond">${weather.text}</p>
                <p class="temp"><img src="${tempIcon}">${weather.avgTemp}</p>
                <p class="humid"><img src="${humidIcon}">${weather.humid}</p>
                <p class="rainChance"><img src="${rainfallIcon}">${weather.chanceOfRain}</p>
            </div>`
            frame.appendChild(weatherChip);
        }
    }

    initialLoad()
    .then(forecastFrame);
    searchButton('search');
    carouselWheel("carousel",["front","rainfall","pollution"],carousel.offsetWidth);
})()