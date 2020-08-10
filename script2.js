//Call jquery function and declare variables
$(document).ready(function () {
     var APIKey = "&appid=31953802ee9a3ba80d5a0cdb2858de30";
     var city = "";
     var currentDate = moment().format("L");
     var searchedHistory = JSON.parse(localStorage.getItem("cities")) === null ? [] : JSON.parse(localStorage.getItem("cities"));

     console.log(searchedHistory);
     console.log(currentDate);

     displayCityHistory();


    //Set the Current Weather (function/variables) and index the information to html
     function currentWeather() {

        if ($(this).attr("id") === "searchBtn") {
            city = $("#cityName").val();
        } else {
            city = $(this).text();
        }

        currentDataURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + APIKey;
        console.log(searchedHistory.indexOf(city));

        if (searchedHistory.indexOf(city) === -1) {

            searchedHistory.push(city);
        }

        console.log(searchedHistory);
        localStorage.setItem("cities", JSON.stringify(searchedHistory));
        

        $.getJSON(currentDataURL, function (json) {
            var temp = (json.main.temp - 273.15) * (9 / 5) + 32;
            var windSpeed = json.wind.speed * 2.237;

            $("#localCity").text(json.name + " " + currentDate);
            $("#imgIcon").attr("src", "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temperature").text("Temperature: " +temp.toFixed(2) + "°F");
            $("#humidity").text("Humidity: " + json.main.humidity + "%");
            $("#windSpeed").text("Wind Speed: " + windSpeed.toFixed(2) + " " + "mph");

        // UV index
            lat = json.coord.lat;
            lon = json.coord.lon;

            uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + APIKey;

            $.ajax({
                url: uvQueryURL,
                method: "GET",
        

            }).then(function(response){
                var uvResult = response[0].value;
                $("#uv")[0].innerHTML= '<b>UV Index: <b><span class="badge badge-pill badge-light" id="uvi-badge">' + uvResult + "</span>"; 
        
                if (uvResult < 3) {
                    $("#uvi-badge").css("background-color", "green");
                } else if (uvResult < 6) {
                    $("#uvi-badge").css("background-color", "yellow");
                } else if (uvResult < 8) {
                    $("#uvi-badge").css("background-color", "orange");
                } else if (uvResult < 11) {
                    $("#uvi-badge").css("background-color", "red");
                } else {
                    $("#uvi-badge").css("background-color", "purple");
                }

            });
        });

        
    }
    
    //Declare forecast function of the folliowing five days 
    function forescast() {
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + APIKey;

        $.ajax({
            url: forecastURL,
            method: "GET"

        }).then(function (response) {
            for (var i = 0; i < response.list.length; i++) {
          
                var dateTime = response.list[i].dt_txt;
                var date = dateTime.split(" ")[0];

                if (date.length === 10) {
                    var year = date.split("-")[0];
                    var month = date.split("-")[1];
                    var day = date.split("-")[2];
                    $("#day" + i).children(".date").text(month + "/" + day + "/" + year);
                    $("#day" + i).children(".img").attr("src", "https://api.openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    $("#day" + i).children(".temp").text("Temp: " + ((response.list[i].main.temp - 273.15) * (9 / 5) + 32).toFixed(2) + "°F");
                    $("#day" + i).children(".hum").text("Humidity: " + response.list[i].main.humidity + "%");
                }
            }
        });
    }

    // Declare function to display ans save the city searched
    function displayCityHistory() {

        $("#checkHist").empty();
        searchedHistory.forEach(function (city) {

            console.log(searchedHistory);
            var histItem = $("<li>");

            histItem.addClass("list-group-item btn btn-light");
            histItem.text(city);
            

            $("#checkHist").prepend(histItem);
            
        });
        $(".btn").click(currentWeather);
        $(".btn").click(forescast);

    }

    // Run a function for the clear button
    function clearHistory() {
        $("#checkHist").empty();
        searchedHistory = [];
        localStorage.setItem("cities", JSON.stringify(searchedHistory));
    }
    $("#clearBtn").click(clearHistory);
    $("#searchBtn").click(displayCityHistory);

});









