# hw6WorkDayScheduler, 19 DEC 20 **Extended to 29 DEC 20
#### By Ashley Stith
## Description
This Application runs in the browser and is a simple weather dashboard that allows a user to enter a city and get the current weather and 5-day weather forecast. It features dynamically updated HTML and CSS powered by jQuery. The[OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities.

The application display is a dashboard with sections for the current weather conditions and for the next 5 days.The current weather is displayed at the top and includes the city name, current date, temperature, humidity, wind speed and uv index.  The 5-day forecast is displayed below and includes the date, temperature and humidity for each date. When a user clicks the search button, the city is saved to their browser's localStorage. Once the page is re-loaded, all previously searched cities are displayed on the page. Link to application: https://stithac.github.io/hw6WeatherDashboard/

![Alt text](./Assets/screenshot.png?raw=true)

## Features
* Application calls the buildDashboard() function on load.  This function builds out the display and checks to see if there are any previous searches saved in localStorage.  If so, the search results are included on the display.
* Once a user types in a city name and clicks a Search button, the OpenWeatherMap API is called and the search results are displayed.
    * If the city is not included in the localStorage, it is added to localStorage and to the display on the left-content div.

## Setup/Installation Requirements
* Clone this repository.
* Open app in your browser.

## Known Bugs
Site has been passed through the W3C HTML/CSS validation service.

## Technologies Used
* HTML
* CSS
* JavaScript
* jQuery
* The following libraries are also used:
    * Bootstrap
    * Font Awesome
    * Google Fonts
    * OpenWeather API

## Contribution Guidelines
Direct link to repository: https://github.com/stithac/hw6WeatherDashboard

### Specifications
1. Use Google Chrome (preferred), Firefox or Edge for jQuery to render properly.
