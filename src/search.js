import "./search.css";
import searchIcon from "./images/search.svg";
import { weatherApi } from "./weatherApi.js";
import { screenController } from "./index.js";

export const searchButton = (elementId) => {
    const searchDiv = document.getElementById(elementId);
    const searchButton = searchDiv.querySelector('.search-button');
    const buttonImage = searchButton.querySelector('img');
    buttonImage.src = searchIcon;
    const searchBar = searchDiv.querySelector('input')

    const showBar = () => {
        searchBar.hidden = false;
        searchDiv.classList.add('searchbar-visible');
        setTimeout(() => {
            searchBar.setAttribute('placeholder','Where are you?')
            searchBar.classList.add('full-open')
    },800);
    }
    
    const hideBar = async () => {
        searchDiv.classList.remove('searchbar-visible');
        searchBar.classList.remove('full-open');
        searchBar.removeAttribute('placeholder');
        setTimeout(() => searchBar.hidden = true,800);
    }

    const submitSearch = async () => {
        console.log('Searching for: ', searchBar.value);
        const newData = await getSearchData(searchBar.value);
        searchBar.value = '';
        return newData;
    }

    const searchError = (err) => {
        console.log('Search term not recognised: ', err);
        searchBar.value = '';
        searchBar.placeholder = 'Try again...';
        shakeElement();
        searchBar.focus();
    }

    const shakeElement = () => {
        searchDiv.classList.add('error');
        setTimeout(() => {searchDiv.classList.remove('error')},300);
    }

    const getSearchData = async (search) => {
        const searchTerm = search.split(' ').join('-');
        await weatherApi.getForecastAtSearch(searchTerm)
        const forecast = await weatherApi.getForecast(searchTerm)
        .catch(err => console.log(err));
        return forecast;
    }

    searchButton.addEventListener('click',(e) => {
        e.preventDefault();

        if (searchBar.hidden) {
            showBar();
            searchBar.focus();
        } else {
            submitSearch()
            .then(screenController.newLoad)
            .then(hideBar)
            .catch((err) => searchError(err));
        }
    })

}