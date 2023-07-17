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

    const populatePage = (data) => {
        locationDiv.textContent = data.location.name + ' : ' + data.location.country;
        conditionDiv.textContent = data.current.condition.text;
        weatherImage.src = data.current.condition.icon;
    }

    const initialLoad = async () => {
        await weatherApi.getForecastAtIP()
        const forecast = await weatherApi.getForecast("ip")
        .catch(err => console.log(err));
        console.log(forecast);
        populatePage(forecast);
    }

    initialLoad();
    searchButton('search');
    carouselWheel("carousel",["front","rainfall","pollution"],carousel.offsetWidth)
})()