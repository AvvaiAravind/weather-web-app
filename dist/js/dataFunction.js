export const setLocationObject = (locationObject, coordsObject) => {
  const { lat, lon, name, unit } = coordsObject;
  locationObject.setLat(lat);
  locationObject.setLon(lon);
  locationObject.setName(name);
  if (unit) {
    locationObject.setUnit(unit);
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async (entryText, units) => {
  const lat = locationObj.getLat();
  const lon = locationObj.getLon();
  const units = locationObj.getUnit();
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
  try {
    const weatherStream = await fetch(url);
    const weaterhJson = await weatherStream.json();
    return weaterhJson;
  } catch (err) {
    console.error(err);
  }
};

export const getCoordsFromApi = async (entryText, units) => {
  const regex = /^\d+$/g;
  const flag = regex.test(entryText) ? "zip" : "q";
  const WEATHER_API_KEY = "1b35bcb599637ff3ac284c728e842246";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
  const encodeUrl = encodeURI(url);
  try {
    const dataStream = await fetch(encodeUrl);
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (err) {
    console.error(err.stack);
  }
};

export const cleanText = (text) => {
  const regex = / {2,}/g;
  const entryText = text.replaceAll(regex, " ").trim();
  return entryText;
};
