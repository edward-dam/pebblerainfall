// Author: Ed Dam

// pebblejs
require('pebblejs');

// clayjs
var Clay       = require('pebble-clay');
var clayConfig = require('./config');
var clay = new Clay(clayConfig);

// libraries
var UI       = require('pebblejs/ui');
var Vector2  = require('pebblejs/lib/vector2');
var ajax     = require('pebblejs/lib/ajax');
var Settings = require('pebblejs/settings');

// collect api data
var gpsLatitude;
var gpsLongitude;
var token = '6dc8bde763d1816f2e3f249ec11ee48f';
//console.log('Saved apidata: ' + Settings.data('rainfallapi'));
collectgpslocation(collectweatherdata);

// definitions
var window = new UI.Window();
var windowSize = window.size();
var size = new Vector2(windowSize.x, windowSize.y);
var icon = 'images/rain_icon.png';
var backgroundColor = 'black';
var highlightBackgroundColor = 'white';
var textColor = 'white';
var highlightTextColor = 'black';
var textAlign = 'center';
var fontLarge = 'gothic-28-bold';
var fontMedium = 'gothic-24-bold';
var fontSmall = 'gothic-18-bold';
//var fontXSmall = 'gothic-14-bold';
function position(height){
  return new Vector2(0, windowSize.y / 2 + height);
}

// main screen
var mainWind = new UI.Window();
var mainText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
var mainImage = new UI.Image({size: size});
mainText.position(position(-70));
mainImage.position(position(-65));
mainText.font(fontLarge);
mainText.text('RAINFALL');
mainImage.image('images/splash.png');
mainWind.add(mainText);
mainWind.add(mainImage);
mainWind.show();

// up screen
mainWind.on('click', 'up', function(e) {
  var upWind = new UI.Window();
  var upHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  var upText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  upHead.position(position(-35));
  upText.position(position(-5));
  upHead.font(fontLarge);
  upText.font(fontMedium);
  upHead.text('Dark Sky API');
  upText.text('www.darksky.net');
  upWind.add(upHead);
  upWind.add(upText);
  upWind.show();
});

// down screen
mainWind.on('click', 'down', function(e) {
  var downWind = new UI.Window();
  var downHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  var downText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  downHead.position(position(-30));
  downText.position(position(-5));
  downHead.font(fontMedium);
  downText.font(fontSmall);
  downHead.text('Rainfall v1.1');
  downText.text('by Edward Dam');
  downWind.add(downHead);
  downWind.add(downText);
  downWind.show();
});

// select button
mainWind.on('click', 'select', function(e) {

  // load collected api data
  var apidata = Settings.data('rainfallapi');
  //console.log('Loaded apidata: ' + apidata);
  
  // load options
  var options = JSON.parse(localStorage.getItem('clay-settings'));
  //console.log('Loaded temp_degrees option: ' + options.temp_degrees);
  
  // determine api data
  var currentData = apidata.currently;
  var currentSumm = currentData.summary;
  var currentRain = Math.round((currentData.precipIntensity * 25.4) * 10) / 10;
  var currentTemp = Math.round((currentData.apparentTemperature - 32) * 5 / 9) + '°C';
  if ( options !== null ) {
    if ( options.temp_degrees === "fahrenheit" ) {
      currentTemp = Math.round(currentData.apparentTemperature) + '°F';
    }
  }
  for (var i = 1; i < 25; i++) {
    determinetime(apidata.hourly.data[i]);
    determinerain(apidata.hourly.data[i]);
    //console.log('hourlyTime' + i + ': ' + window["hourlyTime" + i]);
    //console.log('hourlyRain' + i + ': ' + window["hourlyRain" + i]);
  }

  // display screen
  var rainfallMenu = new UI.Menu({ //fullscreen: true,
    textColor: textColor, highlightBackgroundColor: highlightBackgroundColor,
    backgroundColor: backgroundColor, highlightTextColor: highlightTextColor,
    status: { separator: 'none', color: textColor, backgroundColor: backgroundColor }
  });
  rainfallMenu.section(0, { title: 'Current Weather' });
  rainfallMenu.item(0, 0, { //icon: icon,
    title: currentSumm, subtitle: 'Feels Like: ' + currentTemp,
  });
  rainfallMenu.section(1, {title: 'Rainfall Forecast'});
  rainfallMenu.item(1, 0, { icon: icon,
    title: 'Now', subtitle: 'Rainfall: ' + currentRain + 'mm'
  });
  for (i = 1; i < 25; i++) {
    rainfallMenu.item(1, i, { icon: icon,
      title: window["hourlyTime" + i],
      subtitle: 'Rainfall: ' + window["hourlyRain" + i] + 'mm'
    });
  }
  rainfallMenu.show();
  mainWind.hide();

  // function determine time
  function determinetime(data) {
    var time = new Date(data.time*1000);
    var hour = time.getHours();
    var minutes = time.getMinutes();
    hour = hour > 9 ? hour : '0' + hour;
    minutes = minutes > 9 ? minutes : '0' + minutes;
    window["hourlyTime" + i] = hour + ":" + minutes;
  }
  
  // function determine rain
  function determinerain(data) {
    var rain = Math.round((data.precipIntensity * 25.4) * 10) / 10;
    window["hourlyRain" + i] = rain;
  }
});

// functions

function collectgpslocation(callback) {
  navigator.geolocation.getCurrentPosition(function(api) {
    //console.log('Collected gpsLocation: ' + api.coords);
    gpsLatitude = api.coords.latitude;
    gpsLongitude = api.coords.longitude;
    //console.log('Latitude gpsLocation: ' + gpsLatitude);
    //console.log('Longitude gpsLocation: ' + gpsLongitude);
    callback();
  });
}

function collectweatherdata() {
  var url = 'https://api.darksky.net/forecast/' + token + '/' +
  gpsLatitude + ',' + gpsLongitude + '?exclude=[minutely,daily,alerts,flags]';
  //console.log('url: ' + url);
  ajax({ url: url, method: 'get', type: 'json' },
    function(api){
      //console.log('Collected apidata: ' + api);
      Settings.data('rainfallapi', api);
    }
  );
}
