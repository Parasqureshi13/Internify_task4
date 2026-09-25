/* =========================================================
   WEATHER SCOPE
   Dynamic Weather Application
   ========================================================= */

/* =========================
   DOM ELEMENTS
========================= */

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");

const weatherIcon = document.getElementById("weatherIcon");

const recentSearches = document.getElementById("recentSearches");
const clearHistory = document.getElementById("clearHistory");

/* =========================
   API URLS
========================= */

const geocodingAPI = "https://geocoding-api.open-meteo.com/v1/search";

const weatherAPI = "https://api.open-meteo.com/v1/forecast";

/* =========================
   WEATHER CODES
========================= */

const weatherCodes = {
  0: {
    description: "Clear Sky",
    icon: "fa-sun",
  },

  1: {
    description: "Mainly Clear",
    icon: "fa-sun",
  },

  2: {
    description: "Partly Cloudy",
    icon: "fa-cloud-sun",
  },

  3: {
    description: "Overcast",
    icon: "fa-cloud",
  },

  45: {
    description: "Foggy",
    icon: "fa-smog",
  },

  48: {
    description: "Depositing Rime Fog",
    icon: "fa-smog",
  },

  51: {
    description: "Light Drizzle",
    icon: "fa-cloud-rain",
  },

  53: {
    description: "Moderate Drizzle",
    icon: "fa-cloud-rain",
  },

  55: {
    description: "Dense Drizzle",
    icon: "fa-cloud-rain",
  },

  61: {
    description: "Light Rain",
    icon: "fa-cloud-rain",
  },

  63: {
    description: "Moderate Rain",
    icon: "fa-cloud-showers-heavy",
  },

  65: {
    description: "Heavy Rain",
    icon: "fa-cloud-showers-heavy",
  },

  71: {
    description: "Light Snow",
    icon: "fa-snowflake",
  },

  73: {
    description: "Moderate Snow",
    icon: "fa-snowflake",
  },

  75: {
    description: "Heavy Snow",
    icon: "fa-snowflake",
  },

  80: {
    description: "Rain Showers",
    icon: "fa-cloud-rain",
  },

  81: {
    description: "Moderate Rain Showers",
    icon: "fa-cloud-rain",
  },

  82: {
    description: "Heavy Rain Showers",
    icon: "fa-cloud-showers-heavy",
  },

  95: {
    description: "Thunderstorm",
    icon: "fa-cloud-bolt",
  },

  96: {
    description: "Thunderstorm with Hail",
    icon: "fa-cloud-bolt",
  },

  99: {
    description: "Thunderstorm with Heavy Hail",
    icon: "fa-cloud-bolt",
  },
};

/* =========================
   SEARCH EVENT
========================= */

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  await searchWeather(city);
});

/* =========================
   SEARCH WEATHER
========================= */

async function searchWeather(city) {
  showLoading();

  try {
    /*
     * Step 1:
     * Find city coordinates using
     * Open-Meteo Geocoding API
     */

    const locationResponse = await fetch(
      `${geocodingAPI}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    );

    if (!locationResponse.ok) {
      throw new Error("Location request failed.");
    }

    const locationData = await locationResponse.json();

    if (!locationData.results || locationData.results.length === 0) {
      throw new Error("City not found. Please try again.");
    }

    const location = locationData.results[0];

    /*
     * Step 2:
     * Fetch weather using coordinates
     */

    const weatherResponse = await fetch(
      `${weatherAPI}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m&timezone=auto`,
    );

    if (!weatherResponse.ok) {
      throw new Error("Unable to fetch weather data.");
    }

    const weatherData = await weatherResponse.json();

    /*
     * Step 3:
     * Display data
     */

    displayWeather(location, weatherData);

    /*
     * Step 4:
     * Save search
     */

    saveRecentSearch(location.name);

    /*
     * Step 5:
     * Update recent searches UI
     */

    displayRecentSearches();
  } catch (error) {
    showError(error.message || "Something went wrong. Please try again.");
  } finally {
    hideLoading();
  }
}

/* =========================
   DISPLAY WEATHER
========================= */

function displayWeather(location, data) {
  const current = data.current;

  const weatherInfo = weatherCodes[current.weather_code] || {
    description: "Unknown Weather",
    icon: "fa-cloud",
  };

  cityName.textContent = location.name;

  countryName.textContent = `${location.admin1 ? location.admin1 + ", " : ""}${location.country}`;

  temperature.textContent = Math.round(current.temperature_2m);

  weatherDescription.textContent = weatherInfo.description;

  feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;

  humidity.textContent = `${current.relative_humidity_2m}%`;

  windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

  pressure.textContent = `${Math.round(current.surface_pressure)} hPa`;

  weatherIcon.className = `fa-solid ${weatherInfo.icon}`;

  hideError();

  weatherCard.classList.remove("hidden");

  /*
   * Restart animation every time new data loads
   */

  weatherCard.classList.remove("show");

  void weatherCard.offsetWidth;

  weatherCard.classList.add("show");
}

/* =========================
   LOCAL STORAGE
========================= */

function saveRecentSearch(city) {
  let searches = JSON.parse(localStorage.getItem("weatherSearches")) || [];

  /*
   * Remove duplicate city
   */

  searches = searches.filter(
    (item) => item.toLowerCase() !== city.toLowerCase(),
  );

  /*
   * Add latest search at beginning
   */

  searches.unshift(city);

  /*
   * Keep only last 3
   */

  searches = searches.slice(0, 3);

  localStorage.setItem("weatherSearches", JSON.stringify(searches));
}

/* =========================
   DISPLAY RECENT SEARCHES
========================= */

function displayRecentSearches() {
  const searches = JSON.parse(localStorage.getItem("weatherSearches")) || [];

  if (searches.length === 0) {
    recentSearches.innerHTML = `
            <p class="empty-message">
                Your recent searches will appear here.
            </p>
        `;

    return;
  }

  recentSearches.innerHTML = "";

  searches.forEach((city) => {
    const button = document.createElement("button");

    button.className = "recent-item";

    button.innerHTML = `
            <i class="fa-solid fa-location-dot"></i>
            ${city}
        `;

    button.addEventListener("click", () => {
      cityInput.value = city;

      searchWeather(city);
    });

    recentSearches.appendChild(button);
  });
}

/* =========================
   CLEAR SEARCH HISTORY
========================= */

clearHistory.addEventListener("click", () => {
  localStorage.removeItem("weatherSearches");

  displayRecentSearches();
});

/* =========================
   LOADING STATE
========================= */

function showLoading() {
  loading.classList.remove("hidden");

  weatherCard.classList.add("hidden");

  hideError();
}

function hideLoading() {
  loading.classList.add("hidden");
}

/* =========================
   ERROR HANDLING
========================= */

function showError(message) {
  errorText.textContent = message;

  errorMessage.classList.remove("hidden");

  weatherCard.classList.add("hidden");
}

function hideError() {
  errorMessage.classList.add("hidden");
}

/* =========================
   INITIAL LOAD
========================= */

displayRecentSearches();
