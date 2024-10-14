//add spinner
export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country or Zip Code");
};
export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

//display error
export const displayError = (headerMsg, scrMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfiramtion(scrMsg);
};
export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);

  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfiramtion(`${properMsg}. Please try again`);
};
const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return words[0].toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
  const h2 = document.getElementById("currentForecast__location");
  h2.textContent = message;
};
export const updateScreenReaderConfiramtion = (message) => {
  const pOfConfirmation = document.getElementById("confirmation");
  pOfConfirmation.textContent = message;
};
