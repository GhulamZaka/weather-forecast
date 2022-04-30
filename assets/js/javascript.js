// Saving search history for cities
var searchBtn = $(".btn");
var cityInput = $("#city-input");
var searchHistory = $(".list-group");
var cityArray = JSON.parse(localStorage.getItem("savedCity")) || [];

function savedCity(event) {
    event.preventDefault();

    cityInput = $("#city-input").val();
    console.log(cityInput);
    searchHistory.empty();


    
    getCurrentWeather();
}
    
   // Displaying the saved cities 
function displayList() {
    for (var i = 0; i < cityArray.length; i++) {
        var cityList = $("<li>").addClass("list-group-item"). text(cityArray [i]);
        searchHistory.append(cityList);
    }
}
displayList();
searchBtn.click(savedCity);

// Getting weather API

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
            alert("Error: Please enter a city name.");
        }
    })
    .then(function (data) {

      displayCurrentWeather(data);
       getForecast(data);
        console.log(data);
        console.log(cityArray);

        var index = cityArray.findIndex(function(city) {
            return city === data.name
        });
        

        if (index === -1) {
        cityArray.push(data.name);
        localStorage.setItem("savedCity", JSON.stringify(cityArray));
        }
        
        displayList();
    }) 

    .catch(function() {
        alert("Unable to find the city.");
        displayList();
    })
    
};

  //  Displaying current weather
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

// Displaying 5-day forecast
var forecast = $("#forecast");

var displayForecast = function (data) {
  var forecastTitle = $("#future-dates");
  forecastTitle.text("5-Day Forecast:");

  // Getting UVI
  function uviColor() {

    var uviEl = data.current.uvi;
    var uvIndex = $("<span>").text(uviEl);
    var uvi = $("<p>").text("UV Index: ");

    if (uviEl >= 0 && uviEl <= 2) {uvIndex.addClass("green uvi");
    } else if (uviEl > 2 && uviEl <= 5) {uvIndex.addClass("yellow uvi");
    } else if (uviEl > 5 && uviEl <= 7) {uvIndex.addClass("orange uvi");
    } else if (uviEl > 7 && uviEl <= 10) {uvIndex.addClass("red uvi");
    } else {uviEl.addClass("purple uvi");}

    uvIndex.appendTo(uvi);
    currentWeatherEl.append(uvi);
  }
  uviColor();

 // 5 days loop forecast 
  forecast.empty();
  for (var i = 1; i < 6; i++) {
    var date = $("<p>").text(moment(data.daily[i].dt * 1000).format("MM/DD/YYYY"));
    var forecastIcon = $("<img src=http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png>").addClass("icon");
    var forecastTemp = $("<p>").text("Temp: " + ((data.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed() + "°F");
    var forecastWind = $("<p>").text("Wind: " + data.daily[i].wind_speed + " MPH");
    var forecastHumidity = $("<p>").text("Humidity: " + data.daily[i].humidity + "%");
    var forecastCard = $("<div>").addClass("card col-md-auto");

    forecastCard.append(
      date,
      forecastIcon,
      forecastTemp,
      forecastWind,
      forecastHumidity
    );

    forecast.append(forecastCard);
  }
};

// Display city weather
$('.list-group').on('click', 'li', function() {
    cityInput = $(this).text();
    getCurrentWeather();
  });



