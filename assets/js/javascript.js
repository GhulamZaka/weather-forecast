// Saving search history for cities
var searchBtn = $(".btn");
var cityInput = $("#city-input");
var searchHistory = $(".list-group");
var cityArray = JSON.parse(localStorage.getItem("savedCity")) || [];

function savedCity(event) {
    event.preventDefault();

    cityInput = $("#city-input").val();
    cityArray.push(cityInput);

    localStorage.setItem("savedCity", JSON.stringify(cityArray));
    searchHistory.empty();


    displayList();
    getCurrentWeather();
}
    
    
function displayList() {
    for (var i = 0; i < cityArray.length; i++) {
        var cityList = $("<li>").addClass("list-group-item"). text(cityArray [i]);
        searchHistory.append(cityList);
    }
}

displayList();
searchBtn.click(savedCity);

// get weather API

function getCurrentWeather() {
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q="+cityInput+"&appid=60912993e53c4b95122f3139db219ebb";
      console.log(currentUrl);
    fetch(currentUrl)
    .then(function (response) {
        console.log(response);
        if (response.ok) {
            return response.json()
        }
        else {
            alert("Error");
        }
    })
    .then(function (data) {
      displayCurrentWeather(data);
       getForecast(data);
        console.log(data);
    }) 
    .catch(function(error) {
        alert("Unable to find");
    });
};

  // -----------------3. display current weather---------------------------
  var city = $("#city");
  var today = $("#today");
  var currentWeatherEl = $("#current-weather");
  
  var displayCurrentWeather = function (data) {
    currentWeatherEl.empty();
    city.text(data.name);
    today.text(" (" + moment().format("MM/DD/YYYY") + ") ");
    var currentIcon = $("<img src=http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png>").addClass("icon");
    var currentTemp = $("<p>").text("Temp: " + ((data.main.temp - 273.15) * 1.8 + 32).toFixed() + "°F");
    var currentWind = $("<p>").text("Wind: " + data.wind.speed + " MPH");
    var currentHumidity = $("<p>").text("Humidity: " + data.main.humidity + "%");
    $("#current-tab").addClass("current-card");
  
    city.append(today, currentIcon);
    currentWeatherEl.append(city, currentTemp, currentWind, currentHumidity);
  };
  

// get 5-day forecast API
var getForecast = function (data) {
    var cityLat = data.coord.lat;
    var cityLon = data.coord.lon;

    var forecastUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat +"&lon=" + cityLon +"&exclude=minutely,hourly&appid=60912993e53c4b95122f3139db219ebb";
  
    fetch(forecastUrl).then(function (response) {
      response.json().then(function (data) {
        displayForecast(data);
      });
    });
  };


// display city weather

$('.list-group').on('click', 'li', function() {
    cityInput = $(this).text();
    getCurrentWeather();
  });



