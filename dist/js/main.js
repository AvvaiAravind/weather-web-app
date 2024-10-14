import {
  setPlaceholderText,
  addSpinner,
  displayError,
  updateScreenReaderConfiramtion,
  displayApiError,
} from "./domFunction.js";
import {
  setLocationObject,
  getHomeLocation,
  getWeatherFromCoords,
  getCoordsFromApi,
  cleanText,
} from "./dataFunction.js";

/* import { CurrentLocation } from "./CurrentLocation";
const currentLoc = new CurrentLocation(); */
import CurrentLocation from "./CurrentLocation.js";
const currentLoc = new CurrentLocation();
//init app
const initApp = () => {
  //add event listener
  //geolocation button
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);
  //home button
  const homeButton = document.getElementById("home");
  homeButton.addEventListener("click", loadWeather);
  //save button
  const saveButton = document.getElementById("saveLocation");
  saveButton.addEventListener("click", saveCurrentLocation);
  // unit button
  const unitButton = document.getElementById("unit");
  unitButton.addEventListener("click", setUnitPref);
  // refresh button
  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", refreshWeather);
  // location entry
  const locationEntry = document.getElementById("searchBar__form");
  locationEntry.addEventListener("submit", submitNewLocation);
  //set up
  setPlaceholderText();
  // load weather
  loadWeather();
};

document.addEventListener("DOMContentLoaded", 0000000000000000000000);

// function
const getGeoWeather = (event) => {
  if (event) {
    // add spinner
    if (event.type === "click") {
      const mapIcon = document.querySelector(".fa-map-marker-alt");
      addSpinner(mapIcon);
    }
  }
  if (!navigator.geolocation) geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (err) => {
  const errMsg = err ? err.message : "Geolocation not Supported";
  displayError(errMsg, errMsg);
};

const geoSuccess = (position) => {
  const myCoordsObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat${position.coords.latitude} Lon${position.coords.longitude}`,
  };
  // set location object
  setLocationObject(currentLoc, myCoordsObj);
  //console.log(currentLoc);
  // update data and display
  updateDataAndDisplay(currentLoc);
};

// setting unit preference

const setUnitPref = () => {
  const unitIcon = document.querySelector(".fa-chart-bar");
  addSpinner(unitIcon);
  currentLoc.toggleUnit();
  updateDataAndDisplay();
};

// refreshing the weather

const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-sync-alt");
  addSpinner(refreshIcon);
  updateDataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  if (!savedLocation && event.type === "click") {
    displayError(
      "No Home Location Saved",
      "Sorry! Please save your home location first"
    );
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
  } else {
    const homeIcon = document.querySelector(".fa-home");
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (home) => {
  if (typeof home === "string") {
    const locationJson = JSON.parse(home);
    const myCoordsObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit,
    };
    setLocationObject(currentLoc, myCoordsObj);
    updateDataAndDisplay(currentLoc);
  }
};

//saving the current location for future reference

const saveCurrentLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector(".fa-save");
    addSpinner(saveIcon);
    const locationObj = {
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      name: currentLoc.getName(),
      unit: currentLoc.getUnit(),
    };
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(locationObj));
    updateScreenReaderConfiramtion(
      `Saved ${currentLoc.getName()} as home location`
    );
  }
};

// searching entries

const submitNewLocation = async (event) => {
  event.preventDefault();
  const text = document.getElementById("searchBar__text").value;
  const entryText = cleanText(text);
  if (!entryText.length) return;
  const locationIcon = document.querySelector(".fa-search");
  addSpinner(locationIcon);
  const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
  if (coordsData) {
    if (coordsData.cod === 200) {
      //work with api data
      const myCoordsObj = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.name}, ${coordsData.sys.country}`
          : coordsData.name,
      };
      setLocationObject(currentLoc, myCoordsObj);
      updateDataAndDisplay(currentLoc);
    } else {
      displayApiError(coordsData);
    }
  } else {
    displayError("Connection Error", "Connection Error");
  }
};

//update and display
// updating the contents from location object that we got from geolocation now  we set that to our class constructor
const updateDataAndDisplay = async (locationObj) => {
  const weatherJson = await getWeatherFromCoords(locationObj);
  console.log(weatherJson);
  // if (weatherJson) updateDisplay(weatherJson, locationObj);
};
