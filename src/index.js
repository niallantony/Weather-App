// import "./style.css";n

const weatherApi = (() => {
    const currentData = {ip:null};
    console.log("Running..")
    const  getWeatherAtIP = async () =>  {
        const apiRequest = await fetch("https://api.weatherapi.com/v1/current.json?key=c1a9b3173a4b44c68e413037231307&q=auto:ip")
        currentData.ip = await apiRequest.json();
        console.log('Made :',currentData.ip);
    }


    const getData = (request) => {
        return new Promise(function(resolve, reject){
            if(!currentData[request]) {
                console.log(request);
                reject(new Error('No such data exists!'))
            } else {
                resolve(currentData[request]);
            }
        })
    };
    return {
        getWeatherAtIP,
        getData
    }
})();

const screenController = (() => {
    const container = document.getElementById('container');
    const locationDiv = container.querySelector('.location');
    const conditionDiv = container.querySelector('.condition');
    const weatherImage = container.querySelector('img');

    const populatePage = (data) => {
        locationDiv.textContent = data.location.name + ' : ' + data.location.country;
        conditionDiv.textContent = data.current.condition.text;
        weatherImage.src = data.current.condition.icon;
    }

    const initialLoad = async () => {
        await weatherApi.getWeatherAtIP()
        const data = await weatherApi.getData("ip")
        .catch(err => console.log(err));
        console.log(data);
        populatePage(data);
    }

    initialLoad();
})()