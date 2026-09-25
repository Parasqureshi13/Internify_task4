# WeatherScope 🌤️

WeatherScope is a responsive dynamic weather web application that fetches live weather information using the Open-Meteo API. Users can search for cities and view current weather conditions through a clean and responsive interface.

## Features

* 🔎 Search weather by city name
* 🌐 Live weather data using Open-Meteo API
* ⚡ Fetch API with Async/Await
* ⏳ Loading spinner while data is being fetched
* ❌ Error handling for invalid cities and API failures
* 🌡️ Current temperature and feels-like temperature
* 💧 Humidity information
* 💨 Wind speed
* 📊 Atmospheric pressure
* 🕘 Stores the last 3 searches using LocalStorage
* ✨ Smooth animation when new weather data loads
* 📱 Fully responsive design for mobile, tablet, and desktop
* 🎨 Clean and modern user interface
* 🗑️ Clear recent search history functionality

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Fetch API
* Async/Await
* Open-Meteo API
* LocalStorage
* Font Awesome

## API

This project uses the **Open-Meteo API** to retrieve live weather information.

No API key is required.

## Project Structure

```text
WeatherScope/
│
├── index.html
├── style.css
└── script.js
```

## How It Works

1. Enter a city name in the search bar.
2. The application finds the city's geographical coordinates using the Open-Meteo Geocoding API.
3. The coordinates are used to request the latest weather information.
4. The fetched data is dynamically displayed in the weather card.
5. The searched city is saved in LocalStorage.
6. The three most recent searches remain available after refreshing the page.

## Responsive Design

WeatherScope is designed to work across different screen sizes, including:

* Desktop
* Laptop
* Tablet
* Mobile devices


## Live demo link
https://parasqureshi13.github.io/Internify_task4/

## Project Purpose
This project was developed as part of an internship task to demonstrate practical knowledge of API integration, asynchronous JavaScript, dynamic DOM manipulation, error handling, browser storage, animations, and responsive web design.

## Author

**Paras Qureshi**

Front-End Developer

---

Built with HTML, CSS and JavaScript.
