$(document).ready(function(){
    var cityHistory = [];
    var location;
    var todayDate = moment().format("dddd, MMMM Do");
    var year = moment().format("YYYY");

    $(".date").html("(" + todayDate + " " + year + ")");
    showStorage();

    //click event when search button is clicked
    $(".search-button").click(function(){
        event.preventDefault();

        location = $("#city-name").val();
        cityHistory.push(location);
        showWeather(true);
    });

    //click event if you click on the history list to re look at past city searched
    $("li").click(function(){
        location = $(this).text();
        cityHistory.push(location);
        
        showWeather(false)
    });

    //function to prevent buttons replicating with the new information
    function showWeather(saveHistory){
        if(location !== "" && saveHistory){
            var newList = $("<li>").text(location);
            newList.addClass("list-group-item");

            //will append search to current list
            $(".list-group").append(newList);
            console.log(cityHistory);

            //place search into the locale storage
            localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
        }
    

        //call URL to call basic weather databases for all cities to be shown
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=166a433c57516f51dfab1f7edaed8413";

        //run ajax call
        $.ajax({
            url: queryURL,
            method: "GET"
        })

        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {
            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            // make information appear on to HTML
            $(".city").text(response.name);
            var weatherImg = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
            $(".weather-image").attr("src", weatherImg);
            $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
            $(".humidity").text("Humidity: " + response.main.humidity + " %");

            // Convert the temp to fahrenheit from celsius
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            // add temp content to html
            $(".tempF").text("Temperature (F) " + tempF.toFixed(2) + " °F");

            //Add latitude and longitude for UV
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;

            //Here we are building the URL we need to query the UV index
            var QueryUVUrl= "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=166a433c57516f51dfab1f7edaed8413";

            //Here we run our uvindex Ajax call
            $.ajax({
                url: QueryUVUrl,
                method: "GET"
            }) 

            .then(function(response){
                //add uvi index to html
                var uv = response.current.uvi;
                $("#uv-container").text("UV Index:  ");
                console.log(uv);
                $("#uv-text").text(uv);

                //We now colorcode the index
                if (uv < 3){
                $("#uv-text").addClass("green")
                }
                else if (uv > 7){
                $("#uv-text").addClass("red")
                }
                else {
                $("#uv-text").addClass("yellow")
                } 

                //This will keep the forecast from replicating with every city search
                $(".forecast").empty();
                var forecastH2 = $("<h2>").text("Five Day Forecast");
                $(".forecast").append(forecastH2)

                //use a forloop to create a forecast of the next five days
                for (i = 1; i < 6; i++ ){
                var timeStamp = response.daily[i].dt * 1000;

                //use moment.js to display the upcoming dates
                var dateLine = new Date(timeStamp);
                var calendar = {year: 'numeric', month: 'numeric', day: 'numeric'};
                var forecastTime = dateLine.toLocaleString("en-US", calendar);
                var enterTime = $("<p>").text(forecastTime);
                var forecastCard = $("<div>").addClass("timeCard");

                //attach the date to the forecast div
                forecastCard.append(enterTime);

                //now build forecast and display weather image
                var weatherImg = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
                var forecastImg = $("<img>").attr("src", weatherImg);
                forecastCard.append(forecastImg);

                //set temperature for every day of the 5 day forecast
                var tempF = ((response.daily[i].temp.day - 273.15) * 1.80 + 32).toFixed(2);
                var tempPar = $("<p>").text("Temp: " + tempF + " °F")
                forecastCard.append(tempPar);

                //set humidity for every day
                var humidity = $("<p>").text("Humidity: " + response.daily[i].humidity + " %");
                forecastCard.append(humidity);

                //Append the div to the html div
                $(".forecast").append(forecastCard);   
                }
            });
        });
    }
    function showStorage(){
        $(".list-group").empty();
        //get search city history from locale storage
        cityHistory = JSON.parse(localStorage.getItem("cityHistory"));

        if(!cityHistory){
            //If there is no history start with a default city
            cityHistory = ["Salt lake city"];
            localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
        }
        //create loop to make list of cities previously searched from local storage
        location = cityHistory[cityHistory.length-1];
        showWeather(false);
        //create for loop to take info from locale storage and display on the list
        for(i=0; i<cityHistory.length; i++){
            var newLi = $("<li>").text(cityHistory[i]);
            newLi.addClass("list-group-item");
            $(".list-group").append(newLi);
        }
    }
});