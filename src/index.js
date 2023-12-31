// import "./style.css";n
import { weatherApi } from "./weatherApi.js";
import { carouselWheel } from "./carousel.js";
import { searchButton } from "./search.js"; 
import greenWarning from "./images/greenwarning.svg"
import humid from "./images/humid.svg"
import rainSmall from "./images/rain-small.svg"
import rainy from "./images/rainy.svg"
import redWarning from "./images/redwarning.svg"
import temp from "./images/temp.svg"
import yellowWarning from "./images/yellowwarning.svg"
import "./style.css";



export const screenController = (() => {
    const container = document.getElementById('container');
    const locationDiv = container.querySelector('.location');
    const conditionDiv = container.querySelector('.condition');
    const weatherImage = container.querySelector('img');
    const carousel = document.getElementById('carousel');
    const carouselIds = ['front','rainfall','pollution'];
    let currentData = {};

    const populatePage = (data) => {
        locationDiv.textContent = data.location.name + ' : ' + data.location.country;
        conditionDiv.textContent = data.current.condition.text;
        weatherImage.src = data.current.condition.icon;
    }

    const refeshData = (data) => {
        currentData = Object.assign({},data);
        console.log("Saved Data : ", currentData);
    }

    const initialLoad = async () => {
        await weatherApi.getForecastAtIP()
        const forecast = await weatherApi.getForecast("ip")
        .catch(err => console.log(err));
        populatePage(forecast);
        refeshData(forecast);
    }

    const newLoad = (data) => {
        console.log('Now handling data for: ', data.location.name);
        refreshPage();
        populatePage(data);
        refeshData(data);
        forecastFrame();
        rainFrame();
        airQualityFrame();
    }

    const refreshPage = () => {
        locationDiv.innerHTML = '';
        conditionDiv.innerHTML = '';
        weatherImage.src = '#';
        carouselIds.forEach((id) => {
            const carElement = document.getElementById(id);
            carElement.innerHTML = '';
        })
    }

    const getTime = (data) => {
        return Number(data.current.last_updated.slice(-5,-3));
    }

    const calculateSixHoursLater = (time) => {
        return time + 6 >= 24 ? ( time + 6 ) % 24 : time + 6 ;
    }

    const weatherValuesDay = (input) => {
        const weather = {};
        weather.icon = input.day.condition.icon;
        weather.text = input.day.condition.text;
        weather.chanceOfRain = input.day.daily_chance_of_rain
        weather.avgTemp = input.day.avgtemp_c
        weather.humid = input.day.avghumidity
        weather.willRain = input.day.daily_will_it_rain
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
        const laterWeather = curTime + 6 > 24 ? weatherValuesHour(days[1],laterTime) : weatherValuesHour(days[0],laterTime);
        const tomorrowWeather = weatherValuesDay(days[1]);
        const dayThreeWeather = weatherValuesDay(days[2]);
        return {
            Later:laterWeather,
            Tomorrow:tomorrowWeather,
            Day_3:dayThreeWeather
        }
    }

    const getAQIcon = (airQuality) => {
        if (airQuality['us-epa-index'] < 3) {
            return greenWarning;
        } else if (airQuality['us-epa-index']< 5) {
            return yellowWarning;
        } else {
            return redWarning;
        }
    }

    const getWarningText = (airQuality) => {
        switch (airQuality['us-epa-index']) {
            case 1 : return 'Good';
            case 2 : return 'Moderate';
            case 3 : return 'Unhealthy for sensitive groups';
            case 4 : return 'Unhealthy';
            case 5 : return 'Very Unhealthy';
            case 6 : return 'Hazardous';
            default : return ;
        }
    }

    const airQualityFrame = () => {
        const frame = document.getElementById('pollution');
        const airQuality = currentData.current.air_quality;
        const infoChip = document.createElement('div');
        infoChip.classList.add('info-chip');
        frame.appendChild(infoChip);
        const icon = document.createElement('img');
        icon.src = getAQIcon(airQuality);
        infoChip.appendChild(icon);
        const warningText = getWarningText(airQuality);
        const PM10 = Math.ceil(airQuality.pm10);
        const textFrame = document.createElement('div');
        textFrame.classList.add('warning-text');
        textFrame.innerHTML = `<h3> ${warningText} </h3><p> PM10 : ${PM10} (μg/m3) </p>`
        infoChip.appendChild(textFrame);
        if (airQuality['us-epa-index'] >= 3 ) {
            infoChip.classList.add('urgent');
        } else if (airQuality['us-epa-index'] >= 5) {
            infoChip.classList.add('super-urgent');
        }
    }

    const forecastFrame = () => {
        const frame = document.getElementById('front');
        const curTime = getTime(currentData);
        const laterTime = calculateSixHoursLater(curTime);
        const forecast = constructForecast(curTime,laterTime)
        for (let key in forecast) {
            const weather = forecast[key];
            if (key === 'Day_3') key = "Day after tomorrow";
            const weatherChip = document.createElement('div');
            weatherChip.classList.add('weather-chip');
            weatherChip.innerHTML = `<img src="${weather.icon}">
            <div class="chip-info">
                <h3 class="day">${key}</h3>
                <p class="chip-cond">${weather.text}</p>
                <p class="temp"><img src="${temp}">${weather.avgTemp}</p>
                <p class="humid"><img src="${humid}">${weather.humid}</p>
                <p class="rainChance"><img src="${rainSmall}">${weather.chanceOfRain}</p>
            </div>`
            frame.appendChild(weatherChip);
        }
    }

    const rainFrame = () => {
        const curTime = getTime(currentData);
        const frame = document.getElementById('rainfall');
        const iconFrame = document.createElement('div');
        iconFrame.classList.add('icon-frame');
        const infoFrame = document.createElement('div');
        infoFrame.classList.add('info-frame');
        frame.appendChild(iconFrame);
        frame.appendChild(infoFrame);
        const todaysWeather = weatherValuesDay(currentData.forecast.forecastday[0]);
        let rainStart = 0;
        const alerts = currentData.alerts.alert

        const appendAlerts = (alerts) => {
            if (!alerts.length) return;
            const alertText = `${alerts[0].event}`;
            const alertFrame = document.createElement('div');
            const warning = document.createElement('img');
            alertFrame.innerHTML = `<em>${alertText}</em>`
            alertFrame.classList.add('alert');
            frame.appendChild(alertFrame);
            warning.src = redWarning;
            iconFrame.appendChild(warning);
        }

        const getRainStart = () => {
            if (!todaysWeather.willRain) return
            const hourlyValues = currentData.forecast.forecastday[0].hour;
            for (let i = curTime ; i < 24 ; i++) {
                if (hourlyValues[i].will_it_rain === 1) {
                    rainStart = i;
                    break;
                }
            }
        }

        const showRainStart = () => {
            if (rainStart === curTime) {
                infoFrame.textContent = "Currently forecast rain.";
            } else {
                infoFrame.textContent = `Forecast rain at ${rainStart}:00.`;
            }
        }

        const rainStyling = () => {
            infoFrame.classList.add('raining');
            const umbrella = document.createElement("img");
            umbrella.src = rainy;
            iconFrame.appendChild(umbrella);
        }
        
        getRainStart();
        if (!rainStart) {
            infoFrame.textContent = "No forecast rain today.";
        } else {
            showRainStart();
            rainStyling();
        }
      appendAlerts(alerts);
    }

    initialLoad()
    .then(forecastFrame)
    .then(rainFrame)
    .then(airQualityFrame);
    searchButton('search');
    carouselWheel("carousel",["front","rainfall","pollution"],carousel.offsetWidth);

    return {
        newLoad
    }
})()