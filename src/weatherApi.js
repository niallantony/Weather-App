export const weatherApi = (() => {

    const forecastData = {}
    console.log("Running Weather Console...")

    const  getForecastAtIP = async () =>  {
        const apiRequest = await fetch("https://api.weatherapi.com/v1/forecast.json?key=c1a9b3173a4b44c68e413037231307&q=auto:ip&days=3&aqi=yes&alerts=yes")
        forecastData.ip = await apiRequest.json();
    }

    const getForecastAtSearch = async (input) => {
        const apiRequest = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c1a9b3173a4b44c68e413037231307&q=${input}&days=3&aqi=yes&alerts=yes`)
        const searchResult = await apiRequest.json();
        if (searchResult.error) {
            throw new Error('Api Error');
        } else {
            forecastData[input] = searchResult;
        }
    }


    const getForecast = (request) => {
        return new Promise(function(resolve, reject){
            if(!forecastData[request]) {
                reject(new Error('No such data exists!'))
            } else {
                resolve(forecastData[request]);
            }
        })
    };

    return {
        getForecastAtSearch,
        getForecastAtIP,
        getForecast,
    }

})();