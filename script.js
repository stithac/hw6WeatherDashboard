var apiKey = "cf269a69cae8b944e13e39ba3072c250";

//Elements
var cityInputEl = $("<input>");
var cityList = $("<ul>");
    cityList.attr("class", "list-group");
var cityListLi = $("<li>");
    cityListLi.attr("class", "list-group-item cityLi");
var cityNameLbl = $("<h3>");
var weatherIcon = $("<img>");
    weatherIcon.attr("class", "icon");
var tempEl = $("<p>");
var humidityEl = $("<p>");
var windEl = $("<p>");
var uvEl = $("<p>");
var forecastLbl = $("<h4>");

var city;
var cities = [];

//Buttons
var searchBtn = $("<button>");
    searchBtn.attr("class", "fas fa-search searchBtn btn");

buildDashboard(); //function invoked on page load

//buildDashboard() function is called when the page loads.
//Builds initial page with placeholder divs
function buildDashboard(){
    console.log("*** Start of buildDashboard() function ***");

    $(".searchDiv").append(cityInputEl);
    $(".searchDiv").append(searchBtn);

    $(".left-content").append(cityList);

    $("#snapshot").append(cityNameLbl);
    $("#snapshot").append(weatherIcon);
    $("#snapshot").append(tempEl);
    $("#snapshot").append(humidityEl);
    $("#snapshot").append(windEl);
    $("#snapshot").append(uvEl);

    //Checks to see if there are any meetings in localStorage. If there are meetings saved in localStorage, they are stored in meetings variable.
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null){

        cities = storedCities;

        for(i = 0; i < cities.length; i++){

            var li = $("<li>");
                li.attr("class", "list-group-item cityLi");
                $(li).text(cities[i]);
                cityList.prepend(li);
        }
    }

}//End of buildDashboard()

//getCity() function gets the city from the input and creates the API query URL.  It then calls the searchCity() function with the API query URL passed in as a parameter
function getCity(input){
    console.log(input); //testing

    $(cityListLi).text(input);

    //Check to see if the input is in the cities array.  If not, the variable item will be undefined.  If it is, item will equal the city
    var item = cities.find(item => item === input);

        //If the city is not in the array, push the input to the cities array and prepend to the cityList in the left nav
        if(item === undefined){

            cities.push(input);

            cityList.prepend(cityListLi);

            console.log(cities);
        }

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&appid=" + apiKey + "&units=imperial";

    console.log(queryURL);
    searchCity(queryURL);
} //End of getCity()

//searchCity() function takes in the query URL and makes the AJAX calls to get the weather information for that city
function searchCity(url){

    //initial call is used to get the lat and lon of the city.  That is then passed to a different API call to get more details about the city
    $.ajax({
        url: url,
        method: "GET",
    }).then(function(response) {

        console.log(response);

        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;

        var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

        displayInfo(response, url);//call displayInfo function and pass in the response object and the new API URL
    });

    $(cityInputEl).val("");

    localStorage.setItem("cities", JSON.stringify(cities)); //Updates cities array in local storage

}

//displayInfo() function makes a second API call to get more information about the city. The city information is then displayed on the page
function displayInfo(response, url){

    $(".daily").empty(); //clear any information in daily divs
    // $("#snapshot").empty();

    $.ajax({
        url: url,
        method: "GET",
    }).then(function(res) {
        console.log(res);

        //Assigns all appropriate values to the elements on the page
        var icon = "https://openweathermap.org/img/wn/" + res.current.weather[0].icon + ".png";
            $(weatherIcon).attr("src", icon);
            console.log(icon);

        var temp = res.current.temp;
            $(tempEl).text("Temperature: " + temp + "°F");

        var humidity = res.current.humidity;
            $(humidityEl).text("Humidity: " + humidity + "%");

        var wind = res.current.wind_speed;
            $(windEl).text("Wind Speed: " + wind + " MPH");

        var uv = res.current.uvi;
            $(uvEl).text("UV Index: " + uv);
            if(parseInt(uv) <= 2){
                $(uvEl).attr("class", "low");
            }else if(parseInt(uv) > 2 && parseInt(uv) <= 5){
                $(uvEl).attr("class", "moderate");
            }else if(parseInt(uv) > 5 && parseInt(uv) <= 7){
                $(uvEl).attr("class", "high");
            }else {
                $(uvEl).attr("class", "very-high");
            }

        var name = response.city.name;

        var d = new Date(res.current.dt * 1000);
            $(cityNameLbl).text(name + " (" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear()+ ")");
            console.log(d);
            console.log(res.current.dt);

        forecastLbl.text("5-Day Forecast:");
        $(forecastHeader).append(forecastLbl);

        //Update 5-day forecast elements
        for(i = 1; i < 6; i++){
            var date = new Date(res.daily[i].dt * 1000);
            console.log(date);

            var daily = $("<p>");
                $(daily).attr("class", "center dailyEl")
            var weather = $("<img>");
                $(weather).attr("class", "icon");
            var temp = $("<p>");
                $(temp).text("Temperature: " + res.daily[i].temp.day + "°F");
            var humidity = $("<p>");
                $(humidity).text("Humidity: " + res.daily[i].humidity + "%");

            $(daily).text((date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear());

            icon = "https://openweathermap.org/img/wn/" + res.daily[i].weather[0].icon + ".png";
            console.log(icon);

            $(weather).attr("src", icon);

            $("#forecast" + i).append(daily);
            $("#forecast" + i).append(weather);
            $("#forecast" + i).append(temp);
            $("#forecast" + i).append(humidity);
        }
    });
}//End of displayInfo()

//Click event for the left-hand navigation. When an item is clicked, the getCity() function is called with the city as a parameter
$(document).on("click",".cityLi",function(event){

    city = event.target.innerHTML;
    getCity(city);

});

$(searchBtn).on("click",function(event){
    // event.preventDefault() can be used to prevent an event's default behavior.
    // Here, it prevents the search button from trying to submit a form when clicked
    event.preventDefault();

    if($(cityInputEl).val() !== ""){

        getCity($(cityInputEl).val());
    }else{
        alert("Enter city name");
    }
});


