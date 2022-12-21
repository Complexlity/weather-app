import { getRequest, getGif, getRandomCity } from "./functions.js";

let dq = document.querySelector.bind(document);
let dqa = document.querySelectorAll.bind(document);
let c = console.log.bind(document);

let root = dq(":root");

let searchForm = dq("[data-search]");
let searchButton = dq("[data-searchBtn");
let searchInput = searchForm.querySelector("input");
let cityName = dq("[data-cityName]");
let time = dq("[data-time]");
let temperature = dq("[data-temperature]");
let weather = dq("[data-weather]");
let windPressure = dq("[data-windPressure]");
let windSpeed = dq("[data-windSpeed]");
let humidity = dq("[data-humidity]");
let weatherIcon = dq("[data-weatherIcon]");
let gif = dq("[data-gif]");
let loader = dq("[data-loader]");
let locationIcon = dq("[data-locationIcon]");
let humidityIcon = dq("[data-humidityIcon]");
let windSpeedIcon = dq("[data-windSpeedIcon]");
let windPressureIcon = dq("[data-windPressureIcon]");
// London latitude and longitude
let lat = "51.5085";
let lon = "-0.1257";

window.onload = function () {
  getDefaultLocation();
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitQuery();
});

searchButton.addEventListener("click", submitQuery);

function submitQuery() {
  let query = searchInput.value;
  if (!query) return;
  searchInput.value = "";
  query = query.replace(/(\s+$|^\s+)/g, "");
  loadSite(query);
}

async function loadSite(cityName) {
  loader.classList.add("transition-none");
  loader.style.opacity = "1";

  let weatherData = await getRequest(cityName);
  if (weatherData === 400) {
    console.log(weatherData);
    alert(cityName.toUpperCase() + " Not Found!. Resetting to your location");
    getDefaultLocation();
    return;
  }
  let backgroundGif = await getGif(weatherData[1]);
  let data = [weatherData, backgroundGif];
  updatePage(data);
}

async function getDefaultLocation() {
  // if (navigator.geolocation) {
  //   // device can return its location
  //   alert("I am here 1");
  //   function success(position) {
  //     alert("I am here 2");
  //     lat = position.coords.latitude;
  //     lon = position.coords.longitude;
  //     loadSite([lat, lon]);
  //   }

  //   function error(err) {
  //     alert("I am here 3");
  //     alert("Location data unauthorized!! Rerouting to random location");
  //     let randomCity = getRandomCity();
  //     loadSite(randomCity);
  //   }

  //   navigator.geolocation.getCurrentPosition(success, error);
  // } else {
  //   let randomCity = getRandomCity();
  //   loadSite(randomCity);
  // }
  let randomCity = getRandomCity();
  console.log(randomCity);
  loadSite(randomCity);
}

function updatePage(data) {
  let weatherData = data[0];
  let backgroundGif = data[1];
  gif.src = backgroundGif;
  data = weatherData[0];
  let iconCode = data.weather[0].icon;
  let today = new Date();
  let backgroundImage;
  let weatherArray = ["rain", "clouds", "clear", "mist", "snow", "haze"];
  let weatherName = weatherData[1].toLowerCase();
  backgroundImage = `url('../assets/${weatherName}.jpg')`;

  if (!weatherArray.includes(weatherName)) backgroundImage = "#e0f2fe";
  root.style.setProperty("--bg-image", backgroundImage);

  if (weatherName === "rain") setTheme("light");
  else setTheme("dark");

  if (data.name.length > 8) {
    cityName.style.fontSize = time.style.fontSize = ".9em";
  } else cityName.style.fontSize = time.style.fontSize = "1em";

  cityName.innerHTML = data.name;
  time.innerHTML = `Today ${today.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })}`;
  temperature.innerHTML =
    Math.round((data.main.temp - 273.15) * 10) / 10 + "°C";
  weatherIcon.src = "https://openweathermap.org/img/w/" + iconCode + ".png";
  weatherIcon.style.display = "inline-block";
  weather.innerHTML = weatherData[1];
  windPressure.innerHTML = data.main.pressure + "hpa";
  humidity.innerHTML = data.main.humidity + "%";
  windSpeed.innerHTML = data.wind.speed + "mph";
  loader.classList.remove("transition-none");
  loader.style.opacity = "0";
}

function setTheme(theme) {
  if (theme == "light") {
    locationIcon.src = "./assets/location_white.png";
    humidityIcon.src = "./assets/humidity_white.png";
    windSpeedIcon.src = "./assets/wind-speed_white.png";
    windPressureIcon.src = "./assets/wind-pressure_white.png";
    root.style.setProperty("--text-clr", "white");
  } else if (theme == "dark") {
    locationIcon.src = "./assets/location.png";
    humidityIcon.src = "./assets/humidity.png";
    windSpeedIcon.src = "./assets/wind-speed.png";
    windPressureIcon.src = "./assets/wind-pressure.png";
    root.style.setProperty("--text-clr", "black");
  }
}

const asyncCallWithTimeout = async (asyncPromise, timeLimit) => {
  let timeoutHandle;

  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error("Async call timeout limit reached")),
      timeLimit
    );
  });

  return Promise.race([asyncPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
};
