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
        
        getCity(cities[cities.length - 1]);
    }

}//End of buildDashboard()

function getCity(input){
    console.log(input);

    $(cityListLi).text(input);

    var item = cities.find(item => item === input);

        if(item === undefined){

            cities.push(input);

            cityList.prepend(cityListLi);

            console.log(cities);
        }

    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + input + "&appid=" + apiKey + "&units=imperial";

    console.log(queryURL);
    searchCity(queryURL);
}

function searchCity(url){

    $.ajax({
        url: url,
        method: "GET",
    }).then(function(response) {

        console.log(response);

        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;

        var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

        displayInfo(response, url);
    });

    $(cityInputEl).val("");

    localStorage.setItem("cities", JSON.stringify(cities)); //Updates cities array in local storage

}

function displayInfo(response, url){

    $(".daily").empty(); //clear any information in daily divs
    // $("#snapshot").empty();

    $.ajax({
        url: url,
        method: "GET",
    }).then(function(res) {
        console.log(res);

        var icon = "http://openweathermap.org/img/wn/" + res.current.weather[0].icon + ".png";
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

        var name = response.city.name;

        var d = new Date(res.current.dt * 1000);
            $(cityNameLbl).text(name + " (" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear()+ ")");
            console.log(d);
            console.log(res.current.dt);

        forecastLbl.text("5-Day Forecast:");
        $(forecastHeader).append(forecastLbl);

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

            icon = "http://openweathermap.org/img/wn/" + res.daily[i].weather[0].icon + ".png";
            console.log(icon);

            $(weather).attr("src", icon);

            $("#forecast" + i).append(daily);
            $("#forecast" + i).append(weather);
            $("#forecast" + i).append(temp);
            $("#forecast" + i).append(humidity);
        }
    });
}

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


buildDashboard();