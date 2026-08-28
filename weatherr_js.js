// ==========================================
// WEATHER DASHBOARD
// ==========================================


// ------------------------------
// Get HTML elements
// ------------------------------

const weatherForm = document.getElementById("weatherForm");

const cityInput = document.getElementById("cityInput");

const searchButton = document.getElementById("searchButton");

const errorMessage = document.getElementById("errorMessage");

const loading = document.getElementById("loading");

const weatherContainer =
    document.getElementById("weatherContainer");

const welcomeMessage =
    document.getElementById("welcomeMessage");


// Weather information elements

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const temperature =
    document.getElementById("temperature");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const feelsLike =
    document.getElementById("feelsLike");

const weatherDescription =
    document.getElementById("weatherDescription");

const conditionShort =
    document.getElementById("conditionShort");

const weatherSymbol =
    document.getElementById("weatherSymbol");

const coordinates =
    document.getElementById("coordinates");

const timezone =
    document.getElementById("timezone");

const currentDate =
    document.getElementById("currentDate");

const currentTime =
    document.getElementById("currentTime");


// ==========================================
// EVENT LISTENER
// ==========================================

weatherForm.addEventListener("submit", function(event) {

    // Stop page from refreshing
    event.preventDefault();

    const city = cityInput.value.trim();

    // Check empty input
    if (city === "") {

        showError("Please enter a city name.");

        return;
    }

    // Get weather
    getWeather(city);

});


// ==========================================
// MAIN WEATHER FUNCTION
// ==========================================

async function getWeather(city) {

    try {

        // ------------------------------
        // Start loading
        // ------------------------------

        showLoading();

        clearError();


        // ==================================
        // STEP 1: FIND CITY
        // ==================================

        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        const geoResponse =
            await fetch(geoUrl);


        // Check response
        if (!geoResponse.ok) {

            throw new Error(
                "Unable to find the location."
            );

        }


        // Convert response to JSON
        const geoData =
            await geoResponse.json();


        // Check whether city exists
        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please check the city name."
            );

        }


        // Get first result
        const location =
            geoData.results[0];


        // Get coordinates
        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // ==================================
        // STEP 2: GET WEATHER
        // ==================================

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;


        const weatherResponse =
            await fetch(weatherUrl);


        // Check response
        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to fetch weather information."
            );

        }


        // Convert response to JSON
        const weatherData =
            await weatherResponse.json();


        // ==================================
        // STEP 3: DISPLAY DATA
        // ==================================

        displayWeather(
            location,
            weatherData
        );


    }

    catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Something went wrong. Please try again."
        );

        weatherContainer.classList.add("hidden");

        welcomeMessage.classList.remove("hidden");

    }

    finally {

        // Stop loading
        hideLoading();

    }

}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(location, weatherData) {

    // Current weather object
    const current =
        weatherData.current;


    // ------------------------------
    // Location
    // ------------------------------

    cityName.textContent =
        location.name;


    countryName.textContent =
        `${location.admin1 || ""}, ${location.country || ""}`;


    // ------------------------------
    // Temperature
    // ------------------------------

    temperature.textContent =
        Math.round(current.temperature_2m);


    // ------------------------------
    // Humidity
    // ------------------------------

    humidity.textContent =
        current.relative_humidity_2m;


    // ------------------------------
    // Wind speed
    // ------------------------------

    windSpeed.textContent =
        Math.round(current.wind_speed_10m);


    // ------------------------------
    // Feels like
    // ------------------------------

    feelsLike.textContent =
        Math.round(current.apparent_temperature);


    // ------------------------------
    // Weather condition
    // ------------------------------

    const weatherInfo =
        getWeatherDescription(
            current.weather_code
        );


    weatherDescription.textContent =
        weatherInfo.description;


    conditionShort.textContent =
        weatherInfo.short;


    weatherSymbol.textContent =
        weatherInfo.icon;


    // ------------------------------
    // Coordinates
    // ------------------------------

    coordinates.textContent =
        `${latitudeText(location.latitude)}, ${longitudeText(location.longitude)}`;


    // ------------------------------
    // Timezone
    // ------------------------------

    timezone.textContent =
        location.timezone ||
        weatherData.timezone;


    // ------------------------------
    // Current date & time
    // ------------------------------

    updateDateTime();


    // ------------------------------
    // Show dashboard
    // ------------------------------

    weatherContainer.classList.remove("hidden");

    welcomeMessage.classList.add("hidden");

}


// ==========================================
// WEATHER CODE FUNCTION
// ==========================================

function getWeatherDescription(code) {

    if (code === 0) {

        return {
            description: "Clear sky",
            short: "Clear",
            icon: "☀️"
        };

    }


    if (code === 1 || code === 2) {

        return {
            description: "Mainly clear",
            short: "Partly Cloudy",
            icon: "🌤️"
        };

    }


    if (code === 3) {

        return {
            description: "Overcast",
            short: "Cloudy",
            icon: "☁️"
        };

    }


    if (
        code === 45 ||
        code === 48
    ) {

        return {
            description: "Fog",
            short: "Foggy",
            icon: "🌫️"
        };

    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return {
            description: "Drizzle / Rain",
            short: "Rainy",
            icon: "🌧️"
        };

    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            description: "Snow",
            short: "Snowy",
            icon: "❄️"
        };

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            description: "Rain showers",
            short: "Showers",
            icon: "🌦️"
        };

    }


    if (
        code >= 95 &&
        code <= 99
    ) {

        return {
            description: "Thunderstorm",
            short: "Storm",
            icon: "⛈️"
        };

    }


    return {
        description: "Unknown weather",
        short: "Unknown",
        icon: "🌡️"
    };

}


// ==========================================
// LOADING FUNCTIONS
// ==========================================

function showLoading() {

    loading.classList.remove("hidden");

    weatherContainer.classList.add("hidden");

    welcomeMessage.classList.add("hidden");

    searchButton.disabled = true;

    searchButton.textContent =
        "Loading...";

}


function hideLoading() {

    loading.classList.add("hidden");

    searchButton.disabled = false;

    searchButton.textContent =
        "Search";

}


// ==========================================
// ERROR FUNCTION
// ==========================================

function showError(message) {

    errorMessage.textContent =
        message;

}


function clearError() {

    errorMessage.textContent =
        "";

}


// ==========================================
// DATE & TIME
// ==========================================
function updateDateTime() {

    const now = new Date();

    currentDate.textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    currentTime.textContent =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}

// ==========================================
// COORDINATE FUNCTIONS
// ==========================================

function latitudeText(value) {

    return `${value.toFixed(2)}°`;

}


function longitudeText(value) {

    return `${value.toFixed(2)}°`;

}