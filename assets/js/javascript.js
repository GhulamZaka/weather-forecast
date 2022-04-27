// Saving search history for cities
var searchBtn = $(".btn");
var cityInput = $("#city-input");
var searchHistory = $(".list-group");
var cityArray = JSON.parse(localStorage.getItem("savedCity")) || [];

function savedCity() {
    cityInput = $("#city-input").val();
    cityArray.push(cityInput);

    localStorage.setItem("savedCity", JSON.stringify(cityArray));
    displayList();
}
    
    
function displayList() {
    for (var i = 0; i < cityArray.length; i++) {
        var cityList = $("<li>").addClass("list-group-item"). text(cityArray [i]);
        searchHistory.append(cityList);
    }
}

displayList();
searchBtn.click(savedCity);

function getCurrentWeather() {
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput +
    "&appid=60912993e53c4b95122f3139db219ebb";

    fetch(currentUrl)
    .then(function (response) {
        if (response.ok) {
            response.JSON().then(function (data) {
                displayCurrentWeather(data);
                getForeCast(data);
            });
        }
        else {
            alert("Error");
        }
    })
    .catch(function(error) {
        alert("Unable to find");
    });
};




