
"use strict";

const API = "f1a58e4e6d654b21b952a16e23ddb830";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// 📅 Day & Date
const today = new Date();
dayEl.textContent = days[today.getDay()];
dateEl.textContent = `${today.getDate()} ${today.toLocaleString("default",{month:"long"})} ${today.getFullYear()}`;

// 🔍 Search button
btnEl.addEventListener("click", (e) => {
e.preventDefault();

if (inputEl.value !== "") {
findLocation(inputEl.value);
inputEl.value = "";
} else {
iconsContainer.innerHTML = "<h3>Please enter a city ❌</h3>";
}
});

// ⌨️ Enter key support
inputEl.addEventListener("keypress", (e) => {
if (e.key === "Enter") {
e.preventDefault();
btnEl.click();
}
});

// 🌍 Main function
async function findLocation(city) {
iconsContainer.innerHTML = "<h2>Loading...</h2>";
dayInfoEl.innerHTML = "";
listContentEl.innerHTML = "";

try {
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`;
const res = await fetch(url);
const data = await res.json();


if (data.cod !== 404) {

  // 🎨 Change theme based on weather
  changeTheme(data.weather[0].main);

  const image = displayImageContent(data);
  const right = rightSideContent(data);

  displayForeCast(data.coord.lat, data.coord.lon);

  // ✨ Smooth animation
  setTimeout(() => {
    iconsContainer.innerHTML = image;
    iconsContainer.classList.add("fadeIn");
    dayInfoEl.innerHTML = right;
  }, 800);

} else {
  iconsContainer.innerHTML = `<h3>${data.message} ❌</h3>`;
}


} catch (err) {
iconsContainer.innerHTML = "<h3>Something went wrong ⚠️</h3>";
}
}

// 🌤 Main weather UI
function displayImageContent(data) {
return `     <img class="weather_icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">     <h2 class="weather_temp">${Math.round(data.main.temp - 273.15)}°C</h2>     <h3 class="cloudtxt">${data.weather[0].description}</h3>
  `;
}

// 📊 Right panel
function rightSideContent(data) {
return `     <div class="content">       <p class="title">NAME</p>       <span class="value">${data.name}</span>     </div>     <div class="content">       <p class="title">TEMP</p>       <span class="value">${Math.round(data.main.temp - 273.15)}°C</span>     </div>     <div class="content">       <p class="title">HUMIDITY</p>       <span class="value">${data.main.humidity}%</span>     </div>     <div class="content">       <p class="title">WIND SPEED</p>       <span class="value">${data.wind.speed} Km/h</span>     </div>
  `;
}

// 📅 Forecast
async function displayForeCast(lat, lon) {
const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}`;
const res = await fetch(url);
const data = await res.json();

const uniqueDays = [];

const filtered = data.list.filter((item) => {
const d = new Date(item.dt_txt).getDate();
if (!uniqueDays.includes(d)) {
uniqueDays.push(d);
return true;
}
});

filtered.forEach((item, index) => {
if (index <= 3) {
listContentEl.insertAdjacentHTML("beforeend", forecast(item));
}
});
}

// 📦 Forecast card
function forecast(data) {
const d = new Date(data.dt_txt);
const dayName = days[d.getDay()].slice(0,3);

return `     <li>       <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">       <span>${dayName}</span>       <span class="day_temp">${Math.round(data.main.temp - 273.15)}°C</span>     </li>
  `;
}

// 🎨 Dynamic theme
// function changeTheme(weather) {
// const root = document.documentElement;

// if (weather === "Clear") {
// root.style.setProperty("--main-color", "#facc15");
// } else if (weather === "Clouds") {
// root.style.setProperty("--main-color", "#64748b");
// } else if (weather === "Rain") {
// root.style.setProperty("--main-color", "#3b82f6");
// } else if (weather === "Thunderstorm") {
// root.style.setProperty("--main-color", "#8b5cf6");
// } else {
// root.style.setProperty("--main-color", "#0f172a");
// }
// }


function changeTheme(weather) {
const root = document.documentElement;

if (weather === "Clear") {
root.style.setProperty("--main-color", "#745907"); // soft golden (not harsh)
}
else if (weather === "Clouds") {
root.style.setProperty("--main-color", "#5a5a63e4"); // slate grey
}
else if (weather === "Rain") {
root.style.setProperty("--main-color", "#293d47"); // calm blue
}
else if (weather === "Thunderstorm") {
root.style.setProperty("--main-color", "#3a394a"); // deep indigo
}
else {
root.style.setProperty("--main-color", "#334155"); // neutral
}
}
