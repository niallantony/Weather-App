export const weatherApi = (() => {

    const forecastData = {}
    console.log("Running Weather Console...")

    const  getForecastAtIP = async () =>  {
        const apiRequest = await fetch("https://api.weatherapi.com/v1/forecast.json?key=c1a9b3173a4b44c68e413037231307&q=auto:ip&days=3")
        forecastData.ip = await apiRequest.json();
        console.log('Made :',forecastData.ip);
    }


    const getForecast = (request) => {
        return new Promise(function(resolve, reject){
            if(!forecastData[request]) {
                console.log(request);
                reject(new Error('No such data exists!'))
            } else {
                resolve(forecastData[request]);
            }
        })
    };

    return {
        getForecastAtIP,
        getForecast,
    }

})();