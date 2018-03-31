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
            console.log(data)
            // Log weather at currnet location
            var weatherAtLocation = data['weather'][0]['main'];
            var myLocationLat = data['coord']['lat'];
            var myLocationLong = data['coord']['lon'];
            // Change Page Content to Results
            var successApiString = '<center><div id="contentContainerInner"><h1>Results</h1>' +
                '<br /><br /><div id="btn" type="button" onClick="loadInitialElements()">Reset Page</div><br />' +
                data['name'] + ": " + weatherAtLocation + '</div><br /><br /></center>';
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
    
    
    var url = 'http://api.openweathermap.org/data/2.5/box/city?bbox='+(long-3).toString()+','+(lat-3).toString()+','+(long+3).toString()+','+(lat+3).toString()+',20';
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
        for(var i = 0; i < returnLength; i++) {
            console.log(i + ': ' + data['list'][i]['weather'][0]['main']);
            pointsToMap.push([data['list'][i]['coord']['Lat'],data['list'][i]['coord']['Long']])
        }
        displayMap(pointsToMap);
    
    
        
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