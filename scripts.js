/* 

Here Comes The Sun

Where's my nearest sunshine and how do I get there?

Thanks to https://openweathermap.org/ and https://developer.google.com

For M x

*/

function loadHomepage() {
    var pageHtmlString = '<center>' +
                '<h1>Here Comes The Sun </h1>' +
                '<h3>How far away is the nearest sunshine... And how do I get there?</h3><br />' +
                '<div id="contentContainerInner">' +
                    '<table id="whereAreYouTable">' +
                        '<tr>' +
                            '<td id="whereAreYouCell">Where Are You?</td>' +
                            '<td id="cityInputCell"><input id="cityInput" type="text" id="myLocation" name="myLocation" /></td>' +
                            '<td id="cityInputCell"><select id="countryInput"><option selected value="uk">UK</option>' + listCountryCodes() + '</td>' +        
                        '</tr>' +
                    '</table>' +
                    '<div id="errorNoInputText"></div>' + 
                    '<br />' +
                    '<div id="btn" type="buttorrn" onClick="apiCallCheckSource(' + '\'userSelectedLocation\'' + ')" >Bring Me Sunshine</div>' +
                    '<br /><h3>or</h3><br />' +
                    '<div id="btn" type="button" onClick="apiCallCheckSource(' + '\'currentLocation\'' + ')">Use My Current Location</div>' +
                    '<br /><br />' +
                '</div>' +
            '</center>' + footerCode;
    $("#whiteContainer").html(pageHtmlString);
}

function listCountryCodes() {
    // Generate HTML List of countries
    var countries = { 'AU': 'Australia', 'AT': 'Austria', 'BE': 'Belgium', 'BG': 'Bulgaria', 'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DE': 'Germany', 
                     'DK': 'Denmark', 'EE': 'Estonia', 'ES': 'Spain', 'FI': 'Finland', 'FR': 'Spain', 'GR': 'Greece', 'HU': 'Hungary','HR': 'Croatia', 
                     'IE': 'Ireland','IT': 'Italy','LT': 'Lithuania', 'LU': 'Luxembourg','LV': 'Latvia','MT': 'Malta','NL': 'Netherlands', 'NO': 'Norway', 
                     'PL': 'Poland','PT': 'Portugal','RO': 'Romania', 'SE': 'Sweden','SI': 'Slovenia', 'SK': 'Slovakia', 'US': 'USA' }                                      
    var countryList = "";
    for(c in countries) {
        countryList = countryList + '<option value="' + c + '">' + countries[c] + '</option>';
    }
    return countryList;
}
 
var footerCode = '<div id="footer">' + 
                    'Created by <a href="https://esouthren.github.io/okayestcoder/index.html" target="_blank">the Okay-est Coder</a> | <a href="#" onClick="loadAboutPage()">About</a>' +
                '</div>';

function loadAboutPage() {
    // About information
    var pageHtmlString = '<center>' +
                            '<h1>About</h1>' +
                            '<div id="contentContainerInner">' +
                            '<p style="width: 10%">' + 
                                '<h3>It all started with bad British weather and a small request:' +
                                '<br /><br />' + 
                                '"Let\'s drive to the nearest place that has sun. How do we get there?"' +
                                '<br /><br />' +
                                'This one is for you, M.</h3>' +
                            '</p>' +
                            '<br /><div id="btn" type="button" onClick="loadHomepage()">Return</div>' +
                            '<br /><br />' +
                        '</center>' + footerCode;
   $("#whiteContainer").html(pageHtmlString);
}

function apiCallCheckSource(source) {
    var selectedCountry = $('#countryInput').find('option:selected').val();
    console.log("Country: " + selectedCountry );
    // Are we calling the weather API with a searched location or current position co-ordinates?
    if(source=="userSelectedLocation") {
        var myLocation = $("#cityInput").val();
        console.log("My Location: " + myLocation);
        if((typeof(myLocation)=='undefined') || (myLocation == "")) {
           $("#errorNoInputText").html("type a location or try 'Use My Current Location'")
        }
        else {
            var url = "https://api.openweathermap.org/data/2.5/weather?q=" + myLocation + "," + selectedCountry;
            apiCall(url);
        }
    }    
    else if(source=="currentLocation") {
        // Make call to google Api to get user's current location
         if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
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
    // Call Weather API with supplied URL    
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
            // Log weather at current location
            var weatherAtLocation = data['weather'][0]['main'];
            var myLocationLat = data['coord']['lat'];
            var myLocationLong = data['coord']['lon'];
            loadLoadingPage();
            // API Call for nearby places
            apiSearchNearbyWeather(myLocationLat, myLocationLong);            
        },
        error: function(err) {
            $("#errorNoInputText").html("location not found. Did you select the correct country?")
            console.log('error:' + err)
        }
    })
}

function loadLoadingPage() {
     // Change Page Content to Loading
    var loadingHtmlString = '<center>' +
                                '<div id="contentContainerInner">' +
                                    '<br /><br /><br /><br />' +
                                    '<h1>Loading...</h1>' + 
                                    '<br /><br />' +
                                '</div>' +
                                '<br /><br />' +
                            '</center>';
    $("#whiteContainer").html(loadingHtmlString);
}

function apiSearchNearbyWeather(lat, long) {
    // how large a radius?
    // 3 returns around 300 results
    // 5 = ~1000
    // 10 = 2500
    // 20 = 5000, around 7 seconds
    var ZOOM = 5;
    var url = 'https://api.openweathermap.org/data/2.5/box/city?bbox='+
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
        // Call function that finds nearest place with 'Clear' weather description (i.e. sunny)
        findNearestSunnyLocation(data, lat, long);        
    },
        error: function(err) {
            $("#errorNoInputText").html("location not found!")
            console.log('error:' + err)
        }
    })   
}

function findNearestSunnyLocation(weatherData, currentLat, currentLong) {
    // Find all the sunny spots, then find the nearest one
    var sunnyLocations = [];
    // Create array of clear spots
    var numPlaces = weatherData['list'].length;
    for(var i = 0; i < numPlaces; i++) {
        if(weatherData['list'][i]['weather'][0]['main']=='Clear') {
            sunnyLocations.push(i);            
        }
    }
    // Didn't find any clear spots?
    if(sunnyLocations.length < 1) {
        drawErrorMessage();
    }
    else {   
        var closestSunnySpot = sunnyLocations[0]['name'];        
        var closestDistance = Number.MAX_SAFE_INTEGER;
        for(i in sunnyLocations) {
            var latTwo = weatherData['list'][sunnyLocations[i]]['coord']['Lat'];
            var longTwo = weatherData['list'][sunnyLocations[i]]['coord']['Lon'];
            var newDistance = distanceBetweenCoords(currentLat, currentLong, latTwo, longTwo);
            if (newDistance < closestDistance) {
                closestSunnySpot = i;
                closestDistance = newDistance;            
            }
        }
        try {
            var closestPlaceName = weatherData['list'][sunnyLocations[closestSunnySpot]]['name'];
            var closestLat = weatherData['list'][sunnyLocations[closestSunnySpot]]['coord']['Lat'];
            var closestLong =  weatherData['list'][sunnyLocations[closestSunnySpot]]['coord']['Lon'];
            var closestSunnyTemp = weatherData['list'][sunnyLocations[closestSunnySpot]]['main']['temp_max'];
            console.log("Closest sunny spot: " + closestPlaceName);
            console.log("Distance: " + closestDistance);
            console.log("Temp: " + closestSunnyTemp);
            displayResults(currentLat, currentLong, closestLat, closestLong, closestPlaceName, closestDistance, closestSunnyTemp);
        }
        catch(err) {
            console.log("Error!");
            drawErrorMessage();
        }
    }
}

function drawErrorMessage() {
    var failedSearchString = '<center>' + 
                                '<div id="contentcontainerInner">' + 
                                    '<h2>Search Error</h2>' +
                                    '<h4>There\'s just no sunshine anywhere today :( </h4>' +
                                '</div>' +
                                '<br />' + 
                                '<div id="btn" type="button" onClick="loadHomepage()">Home</div>' + 
                                '<br /><br /><br />' +
                            '</center>';
    $("#whiteContainer").html(failedSearchString);
}


function distanceBetweenCoords(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    // If user does not activate geolocation, return error
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                      'Error: The Geolocation service failed.' :
                      'Error: Your browser doesn\'t support geolocation.');
}

function displayResults(latOne, longOne, latTwo, longTwo, name, distance, temp) {
    // Display Results of Queries
    var items = ['Taps Aff In', 'Sun\'s Out In', 'Head To', 'Clear Skies In', 'It\'s Marvellous In', 'It\'s Bloomin\' Lovely In', 'There\'s Blue Skies In', 'Get Yourself To','Pack Your Bags And Head To'];
    introString = items[Math.floor(Math.random()*items.length)];
    // Create Google Maps directions URL
    var googleMapsUrl = "https://www.google.com/maps/dir/?api=AIzaSyCundqnc0BKJCsiZHYjzzSq-V4sia_mvVw&origin=" + latOne + "," + longOne + "&destination=" + latTwo + "," + longTwo;
    
    var successApiString = '<center>' + 
                                '<div id="contentContainerInner">' + 
                                    '<h1>' + introString + ' ' + name + '</h1>' +
                                    '<h4>Distance: ' + distance.toFixed(2) + 'km\tMax Temp: ' + temp.toFixed(2) + 'C</h4>' +
                                '</div>' +
                                '<div style="height: 300px; width: 100%;">' + 
                                    '<div id="resultMap">Map go here</div>' + 
                                '</div>' +
                                '<br /><div id="btn" type="button" target="_blank" onclick="window.open(\'' + googleMapsUrl + '\',\'_blank\');">Take Me There</div>' +
                                '<br /><div id="btn" type="button" onClick="loadHomepage()">Search Again</div><br />' +
                                '<br /><br />' +
                            '</center>' + footerCode;
    
    $("#whiteContainer").html(successApiString)
    displayMap(latOne, longOne, latTwo, longTwo);
}

function displayMap(latOne, longOne, latTwo, longTwo) {
    // Draw Map with directions from location to destination 
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var map = new google.maps.Map(document.getElementById('resultMap'), {
        center: {lat: latOne, lng: longOne},
        zoom: 8
    });
    var marker = new google.maps.Marker({
        position:{lat: latTwo, lng: longTwo},
        map: map,
        title: 'Hello World',
        icon: 'sunIcon.png'
    });

    directionsDisplay.setMap(map);
    
    directionsService.route({
      origin: {lat: latOne, lng: longOne},
      destination: {lat: latTwo, lng: longTwo},
      travelMode: 'DRIVING'
    }, function(response, status) {
          if (status === 'OK') {
              directionsDisplay.setDirections(response);        
          } else {
              window.alert('Directions request failed due to ' + status);
          }
    });
}
