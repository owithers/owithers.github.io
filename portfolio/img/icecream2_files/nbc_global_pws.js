nbc.globalPWS = {
  isStationActive: true,
  pwsIconHTML: '<div class="hppwsIndicator"><img src="//' + nbc.mediaDomain + '/images/desktop-PWSicon-blue.png"></div>',
  localData: {}
};
nbc.requestPWS = function(userPWS) {
  var randomDomainPWS = (nbc.globalSiteKey == "tlmd" && nbc.path == "/en-vivo" && nbc.market !== "telemundo47") ? "//" + nbc.env + "www.telemundo47.com" : "//" + nbc.env + "www.telemundo52.com";
  randomDomainPWS = (nbc.path !== "/en-vivo") ? nbc.fullDomain : randomDomainPWS;
  randomDomainPWS = (nbc.globalSiteKey !== "tlmd") ? location.protocol + '//' + nbc.env + nbc.domain : randomDomainPWS;
  var callBackVar = (nbc.globalSiteKey == "tlmd" && nbc.path == "/en-vivo") ? "&callback=jsonCallback" : "";
  var jsonDataType = (nbc.globalSiteKey == "tlmd" && nbc.path == "/en-vivo") ? "JSONP" : "json";
  var pwsid = userPWS;
  console.log('*** handler request: ' + randomDomainPWS + '/i/dispatcher/?h=wu_request&type=station&pws=' + pwsid + callBackVar);
  jQuery.ajax({
    url: randomDomainPWS + '/i/dispatcher/?h=wu_request&type=station&pws=' + pwsid + callBackVar,
    dataType: jsonDataType,
    jsonpCallback: 'jsonCallback',
    cache: false,
    success: function(data) {
      // success!
    },
    error: function() {
      console.log("data returned nothing");
    },
    complete: function(data) {
      nbc.globalPWS.requestedPWS = jQuery.parseJSON(data.responseText);
      if (nbc.globalPWS.requestedPWS !== null && nbc.globalPWS.requestedPWS.hasOwnProperty("current_observation")) {

        if (nbc.globalPWS.requestedPWS.current_observation.temp_f !== -9999) {
          nbc.globalPWS.isStationActive == false;
        }

        nbc.globalPWS.localData.customCity = nbc.globalPWS.requestedPWS.current_observation.observation_location.city;
        nbc.globalPWS.localData.customGeoCity = nbc.globalPWS.requestedPWS.current_observation.display_location.city;
        nbc.globalPWS.localData.customState = nbc.globalPWS.requestedPWS.current_observation.display_location.state;
        nbc.globalPWS.localData.customFeels = nbc.globalPWS.checkNumber(nbc.globalPWS.requestedPWS.current_observation.feelslike_f, "temp");
        nbc.globalPWS.localData.customCond = nbc.globalPWS.requestedPWS.current_observation.weather;
        nbc.globalPWS.localData.customTemp = nbc.globalPWS.checkNumber(nbc.globalPWS.requestedPWS.current_observation.temp_f, "temp");
        nbc.globalPWS.localData.customDewpt = nbc.globalPWS.checkNumber(nbc.globalPWS.requestedPWS.current_observation.dewpoint_f, "temp");
        nbc.globalPWS.localData.customWind = nbc.globalPWS.requestedPWS.current_observation.wind_string;
        nbc.globalPWS.localData.customHumid = nbc.globalPWS.checkNumber(nbc.globalPWS.requestedPWS.current_observation.relative_humidity, "pct");
        nbc.globalPWS.localData.customLat = nbc.globalPWS.requestedPWS.current_observation.display_location.latitude;
        nbc.globalPWS.localData.customLon = nbc.globalPWS.requestedPWS.current_observation.display_location.longitude;
        nbc.globalPWS.localData.customObs = nbc.globalPWS.requestedPWS.current_observation.observation_time;
        nbc.globalPWS.localData.icon = nbc.globalPWS.returnMappedImage(nbc.globalPWS.requestedPWS.current_observation.icon);
        nbc.globalPWS.localData.headerIcon = nbc.globalPWS.returnMappedImage(nbc.globalPWS.requestedPWS.current_observation.icon, "header");

        if (nbc.omniture.pageType === "home" && nbc.globalPWS.isStationActive === true) {
          var updateWidget = setTimeout(function() {
            jQuery('div.nav-weather-temp').html(Math.round(nbc.globalPWS.localData.customTemp) + '&deg;');
            jQuery('div.nav-weather-icon img').attr('src', nbc.globalPWS.localData.headerIcon);
            jQuery('div.weather-module-temp').html(Math.round(nbc.globalPWS.localData.customTemp) + '&deg;');
            jQuery('div.weather-module-condition').html(nbc.globalPWS.localData.customCond);
            jQuery('div.weather-module-city').html(nbc.globalPWS.localData.customCity);
            jQuery('.weather-module-current .weather-module-icon img').attr('src', nbc.globalPWS.localData.icon);
            jQuery('div.weather-module-location').append(nbc.globalPWS.pwsIconHTML);
          }, 3000);
        }

        if (nbc.omniture.pageType !== "home" && nbc.globalPWS.isStationActive === true) {
          var updateDynWidget = setTimeout(function() {
            jQuery('div.nav-weather-temp').html(Math.round(nbc.globalPWS.localData.customTemp) + '&deg;');
            jQuery('div.nav-weather-icon img').attr('src', nbc.globalPWS.localData.headerIcon);
            jQuery('span.weatherCityState').html(nbc.globalPWS.localData.customCity);
            jQuery('#weather-module-data-0 .temperature a').html(Math.round(nbc.globalPWS.localData.customTemp) + '&deg;');
            jQuery('div.conditon-feelslike-wrapper .condition').html(nbc.globalPWS.localData.customCond);
            jQuery('#weather-module-data-0 .feels-like').html('Feels Like ' + Math.round(nbc.globalPWS.localData.customFeels) + '&deg;');
            jQuery('#weather-module-data-0 div.weatherIcon img').attr('src', nbc.globalPWS.localData.icon);
            jQuery('a[data-tracking="changelocation"]').append(nbc.globalPWS.pwsIconHTML);
          }, 3000);
        }
      }
    }
  });
};

nbc.globalPWS.checkNumber = function(number, type) {
  if (type === "pct") {
    number = number.split("%")[0];
  }
  var num = Number(number);
  if (type === "temp") {
    if (num >= -50 && num <= 150) {
      return Math.round(num);
    }
  }
  if (type === "vol") {
    if (num >= 0) {
      return Math.round(num);
    }
  }
  if (type === "pct") {
    if (num >= 0 && num <= 100) {
      return Math.round(num) + "%";
    }
  }

  if (type === "speed") {
    if (num >= 0) {
      return Math.round(num);
    }
  }
  return "--";
};

nbc.globalPWS.returnMappedImage = function(iconCode, pos) {
  var dayOrNight = "";
  dayOrNight = (typeof wsiDayorNight !== "undefined") ? wsiDayorNight : "day";
  if (pos == "header") {
    return nbc.mediaDomain + "/designimages/ots_light_wx_" + nbc.globalPWS.wsiWUMapping[dayOrNight][iconCode] + ".png";
  } else {
    return nbc.mediaDomain + "/designimages/ots_dark_wx_" + nbc.globalPWS.wsiWUMapping[dayOrNight][iconCode] + ".png";
  }
};

nbc.globalPWS.wsiWUMapping = {
  day: {
    chanceflurries: 77,
    chancerain: 82,
    chancesleet: 88,
    chancesnow: 83,
    chancetstorms: 84,
    clear: 85,
    cloudy: 67,
    flurries: 77,
    fog: 70,
    hazy: 72,
    mostlycloudy: 69,
    mostlysunny: 65,
    partlycloudy: 66,
    partlysunny: 66,
    rain: 82,
    sleet: 88,
    snow: 83,
    sunny: 85,
    tstorms: 84,
    unknown: 86
  },
  night: {
    chanceflurries: 108,
    chancerain: 107,
    chancesleet: 110,
    chancesnow: 109,
    chancetstorms: 116,
    clear: 97,
    cloudy: 103,
    flurries: 108,
    fog: 104,
    hazy: 72,
    mostlycloudy: 99,
    mostlysunny: 102,
    partlycloudy: 98,
    partlysunny: 98,
    rain: 107,
    sleet: 110,
    snow: 109,
    sunny: 97,
    tstorms: 116,
    unknown: 86
  }
};

/* SEARCH FOR PWS COOKIE, GRAB IT, DON'T LET GO. */
if (U.readCookie("pwsid") && U.readCookie("pwsid") !== "") {
  nbc.userPWS = U.readCookie("pwsid");
  nbc.requestPWS(nbc.userPWS);
}
