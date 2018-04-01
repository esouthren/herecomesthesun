var pointsToMap = [];

function loadInitialElements() {
    var pageHtmlString = '<center>' +
                '<h1>Here Comes The Sun </h1>' +
                '<div id="contentContainerInner">' +
                    '<table id="whereAreYouTable">' +
                        '<tr>' +
                            '<td id="whereAreYouCell">Where Are You?</td>' +
                            '<td id="cityInputCell"><input id="cityInput" type="text" id="myLocation" name="myLocation" /></td>' +
                        '</tr>' +
                    '</table>' +
                    '<div id="errorNoInputText"></div>' + 
                    '<br />' +
                    '<div id="btn" type="button" onClick="apiCallCheckSource(' + '\'myLocation\'' + ')" >Bring Me Sunshine</div>' +
                    '<br /><br /><hr /> or <hr /><br />' +
                    '<div id="btn" type="button" onClick="apiCallCheckSource(' + '\'googleLocation\'' + ')">Use My Current Location</div>' +
                    '<br /><br />' +
                '</div>' +
            '</center>';
    $("#whiteContainer").html(pageHtmlString);
}

function apiCallCheckSource(source) {
    
    if(source=="myLocation") {
        var myLocation = $("#cityInput").val();
        console.log("My Location: " + myLocation);
        if((typeof(myLocation)=='undefined') || (myLocation == "")) {
           $("#errorNoInputText").html("type a location or try 'Use My Current Location'")
        }
        else {
            var url = "https://api.openweathermap.org/data/2.5/weather?q=" + myLocation + ",uk"
            apiCall(url);
        }
    }
    
    else if(source=="googleLocation") {
        // Make call to google Api
         if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };
            /*
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
            */
            // Changing Text to show location
            var stringLocation = (position.coords.latitude).toString() + ', ' + (position.coords.latitude).toString();
            $("#location").html(stringLocation);   
                    var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
            console.log("calling google API with latitude: " + position.coords.latitude);
        apiCall(url);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        }
}


    
}
    

function apiCall(url) {

    console.log("Weather maps API Call...");
    
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'JSON',
        data: {
        'APPID': 'd0478ac43e79cf1c6eb4adc5141a2966',
        'units': 'metric'
        },
        success: function(data) {
            var items;
            //console.log(data)
            // Log weather at currnet location
            var weatherAtLocation = data['weather'][0]['main'];
            var myLocationLat = data['coord']['lat'];
            var myLocationLong = data['coord']['lon'];
            // Change Page Content to Results
            var successApiString = '<center><div id="contentContainerInner"><h1>Loading...</h1>' +
                '</div><br /><br /></center>';
           //$("#weatherUpdate").html(data['name'] + ": " + weatherAtLocation);
            $("#whiteContainer").html(successApiString)
            
            // Call for nearby places
            // lon-left,lat-bottom,lon-right,lat-top,zoom
            apiSearchNearbyWeather(myLocationLat, myLocationLong);
            
        },
        error: function(err) {
        $("#errorNoInputText").html("location not found. Is it in the UK?")
        console.log('error:' + err)
        }
    })
}

function apiSearchNearbyWeather(lat, long) {
    // how large a radius?
    // 3 returns around 300 results
    // 5 = ~1000
    // 10 = 2500
    // 20 = 5000, around 7 seconds
    var ZOOM = 5
    var url = 'http://api.openweathermap.org/data/2.5/box/city?bbox='+
                                                                    (long-ZOOM).toString() +
                                                                    ','+(lat-ZOOM).toString() +','+
                                                                    (long+ZOOM).toString() +','+ 
                                                                    (lat+ZOOM).toString()+
                                                                    ',20';
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'JSON',
        data: {
        'APPID': 'd0478ac43e79cf1c6eb4adc5141a2966',
        'units': 'metric'
    },
    success: function(data) {
        var items;
        console.log(data);
        var returnLength = data['list'].length;
        // Call function that finds nearest place with 'Clear' Weather
        findNearestSunnySpot(data, lat, long);
        for(var i = 0; i < returnLength; i++) {
            //console.log(i + ': ' + data['list'][i]['weather'][0]['main']);
            pointsToMap.push([data['list'][i]['coord']['Lat'],data['list'][i]['coord']['Long']])
        }
        //displayMap(pointsToMap);
    
    
        
    },
    error: function(err) {
    $("#errorNoInputText").html("location not found. Is it in the UK?")
    console.log('error:' + err)
    }
})
    
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                      'Error: The Geolocation service failed.' :
                      'Error: Your browser doesn\'t support geolocation.');
    //infoWindow.open(map);
}

function displayResults(latOne, longOne, latTwo, longTwo, name, distance, temp) {
    console.log("Displaying map!");
    var successApiString = '<center><div id="contentContainerInner"><h1>Head to... ' + name + '!</h1>' +
                '<h4>Distance: ' + distance.toFixed(2) + 'km\tMax Temp: ' + temp.toFixed(2) + 'C</h4>' +
                '</div>' +
                '<div style="height: 400px; width: 100%;"><div id="resultMap">Map go here</div></div>' +
                '<br /><div id="btn" type="button" onClick="loadInitialElements()">Back to Home</div><br />' +
                '<br /><br /></center>';
           //$("#weatherUpdate").html(data['name'] + ": " + weatherAtLocation);
            $("#whiteContainer").html(successApiString)
            displayMap(latOne, longOne, latTwo, longTwo);
}

function displayMap(latOne, longOne, latTwo, longTwo) {
    console.log("printing google map...");
  
      var map = new google.maps.Map(document.getElementById('resultMap'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });

  }
//$("#resultMap").html("<h1>Map gonna go here!");


function findNearestSunnySpot(weatherData, currentLat, currentLong) {
    var clearSpotsArray = [];
    // Create array of clear spots
    // calc distance from each one, find smallest
    var numPlaces = weatherData['list'].length;
    for(var i = 0; i < numPlaces; i++) {
        if(weatherData['list'][i]['weather'][0]['main']=='Clear') {
            //console.log("found a clear spot! : ");
            clearSpotsArray.push(i);
            
        }
    }
    console.log("array of index elements: " + clearSpotsArray);
    console.log("first element: " + weatherData['list'][clearSpotsArray[0]]['name']);
    var closestSunnySpot = clearSpotsArray[0]['name'];
    
    var closestDistance = distanceBetweenCoords(currentLat, currentLong, weatherData['list'][clearSpotsArray[0]]['coord']['Lat'],weatherData['list'][clearSpotsArray[0]]['coord']['Lon'])
    for(i in clearSpotsArray) {
        //console.log("i: " + clearSpotsArray[i]);
        var latTwo = weatherData['list'][clearSpotsArray[i]]['coord']['Lat'];
        //console.log("latTwo: " + latTwo);
        var longTwo = weatherData['list'][clearSpotsArray[i]]['coord']['Lon'];
        var newDistance = distanceBetweenCoords(currentLat, currentLong, latTwo, longTwo);
        
        if (newDistance < closestDistance){
            console.log("New Closest distance!");
            console.log(i + ": Place: " + weatherData['list'][clearSpotsArray[i]]['name'] + " Distance: " + newDistance.toFixed(2));
            closestSunnySpot = i;
            closestDistace = newDistance;            
        }
        
    }
    console.log("closest index: " + closestSunnySpot);
    console.log("this is...: " + weatherData['list'][clearSpotsArray[closestSunnySpot]]['name']);
    var closestPlaceName = weatherData['list'][clearSpotsArray[closestSunnySpot]]['name'];
    var closestLat = weatherData['list'][clearSpotsArray[closestSunnySpot]]['coord']['Lat'];
    var closestLong =  weatherData['list'][clearSpotsArray[closestSunnySpot]]['coord']['Lon'];
    var closestSunnyTemp = weatherData['list'][clearSpotsArray[closestSunnySpot]]['main']['temp_max'];
    console.log("Closest sunny spot: " + closestPlaceName);
    console.log("Distance: " + closestDistance);
    console.log("Temp: " + closestSunnyTemp);
    displayResults(currentLat, currentLong, closestLat, closestLong, closestPlaceName, closestDistance, closestSunnyTemp);
}

function distanceBetweenCoords(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
