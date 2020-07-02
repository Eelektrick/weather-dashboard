$(document).ready(function(){
    var cityHistory = [];
    var location;
    var todayDate = moment().format("dddd, MMMM Do");
    var year = moment().format("YYYY");

    $(".date").html(todayDate + " " + year);
    showStorage();

    //click event when search button is clicked
    $(".search-button").click(function(){
        event.preventDefault();

        location = $("#city-name").val();
        cityHistory.push(location);
        showWeather(true);
    });

    function showStorage(){
        $(".history-list").empty();
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
            newLi.addClass("#history-city");
            $("history-list").append(newLi);
        }
    }

    //function to prevent buttons replicating with the new information
    function showWeather(saveHistory){
        if(location !== "" && saveHistory){
            var newList = $("<li>").text(location);
            newList.addClass("#history-city");

            //will append search to current list
            $(".history-list").append(newList);
            console.log(cityHistory);

            //place search into the locale storage
            localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
        }
    }
});