import countries from "../data/countries.json" assert { type: "json" };

async function getRequest(locationData) {
  let request;
  if (typeof locationData == "object") {
    let latitude = locationData[0];
    let longitude = locationData[1];
    request = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=20f7632ffc2c022654e4093c6947b4f4`;
  } else {
    request = `https://api.openweathermap.org/data/2.5/weather?q=${locationData}&APPID=20f7632ffc2c022654e4093c6947b4f4`;
  }
  let response = await fetch(request);
  if (!response.ok) {
    return 400;
  }
  let data = await response.json();

  let currentWeather = data.weather[0].main;
  return [data, currentWeather];
}

async function getGif(searchInput) {
  const request = `https://api.giphy.com/v1/gifs/translate?api_key=9Irfv12EE5h8tj4TGFf7pIJgSYg8u9l4&s=${searchInput}`;
  const response = await fetch(request);
  const recievedData = await response.json();
  const imageUrl = recievedData.data.images.original.url;
  return imageUrl;
}

function getRandomCity() {
  const randomIndex = Math.floor(Math.random() * countries.length);
  const item = countries[randomIndex];
  return item.name;
}

export { getRequest, getGif, getRandomCity };
