// DOM Variables
const $container = document.querySelector('.container'),
    $greeting = document.querySelector('.greeting'),
    $location = document.querySelector('.weather-location'),
    $tempSection = document.querySelector('.row2'),
    $temp = document.querySelector('.temp'),
    $tempType = document.querySelector('.temp-type'),
    $description = document.querySelector('.weather-description'),
    $humidity = document.querySelector('.weather-humidity'),
    $pressure = document.querySelector('.weather-pressure'),
    $wind = document.querySelector('.weather-wind'),
    $icon = document.getElementById('icon1');

// Set background image and greeting depending on time of day
function bgGreet() {
    let today = new Date(),
        hrs = today.getHours();
    console.log(hrs);

    if (hrs >= 4 && hrs < 12) {
        // morning
        $container.style.backgroundImage = "linear-gradient(to bottom, #085078, #85d8ce);";
        $greeting.textContent = "Good Morning";
    } else if (hrs >= 12 && hrs < 19) {
        // afternoon
        $container.style.backgroundImage = "linear-gradient(to bottom, #085078, #85d8ce);";
        $greeting.textContent = "Good Afternoon";
    } else if (hrs >= 19 && hrs < 23) {
        // evening
        $container.style.backgroundImage = "linear-gradient(to bottom, #283e51, #4b79a1)";
        $greeting.textContent = "Good Evening";
    } else {
        // night
        $container.style.backgroundImage = "linear-gradient(to bottom, #283e51, #4b79a1)";
        $greeting.textContent = "Good Night";
    }
}

bgGreet();

// Load event 
window.addEventListener('load', function () {

    let long,
        lat;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);

            long = position.coords.longitude;
            lat = position.coords.latitude;

            // fetch request nece proci zbog CORS-a dok radimo na localhostu (na regularnom serveru hoce); zato je neophodno ici preko proxyja
            const proxy = 'https://cors-anywhere.herokuapp.com/';

            const api = `${proxy}https://api.darksky.net/forecast/f21dd44b66ce376cddd2c08b86809f7d/${lat},${long}`;

            // fetch request ka api url
            fetch(api)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    const currentData = data.currently;
                    console.log(currentData);
                    const location = data.timezone;
                    // console.log(location); 
                    const icon = currentData.icon;
                    // console.log(icon); 
                    const temp = currentData.temperature;
                    // console.log(temp); 
                    const humidity = currentData.humidity;
                    // console.log(humidity); 

                    // Converting Farhrenheit to Celsius
                    let celsius = (temp - 32) * (5 / 9);

                    // Set DOM elements from API
                    $temp.textContent = Math.floor(celsius);
                    $description.textContent = currentData.summary;
                    $humidity.textContent = `Humidity: ${Math.floor(humidity * 100)} %`;
                    $pressure.textContent = `Pressure: ${Math.floor(currentData.pressure)} mb`;
                    $wind.textContent = `Wind: ${currentData.windSpeed} km/h`;
                    $location.textContent = location.substring(location.indexOf("/") + 1);

                    // Set icon 
                    setIcons(icon, $icon);

                    // Change temperature Celsius/Fahrenheit on click
                    $tempSection.addEventListener('click', function () {

                        if ($tempType.textContent === '°C') {
                            $tempType.textContent = 'F';
                            $temp.textContent = Math.floor(temp);
                        } else {
                            $tempType.textContent = '°C';
                            $temp.textContent = Math.floor(celsius);
                        }
                    });

                });
        });
    } else {
        $location.textContent = "Cannot show weather data for your location";
    }

    // Function for icons 
    function setIcons(icon, iconID) {
        // init
        const skycons = new Skycons({
            color: '#f5f5f5'
        });

        const currentIcon = icon.replace(/-/g, "_").toUpperCase();

        // pokretanje animacije
        skycons.play();

        return skycons.set(iconID, Skycons[currentIcon]);
    }

});