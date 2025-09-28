// Fix: define citiesElement and originalCitiesHTML at the top
const citiesElement = document.getElementById('cities');
const originalCitiesHTML = citiesElement.innerHTML;

function updateTime() {
  // Los Angeles
  let losAngelesElement = document.querySelector(".default-los-angeles");
  if (losAngelesElement) {
    let losAngelesDateElement = losAngelesElement.querySelector(".date");
    let losAngelesTimeElement = losAngelesElement.querySelector(".time");
    let losAngelesTime = moment().tz("America/Los_Angeles");
    losAngelesDateElement.innerHTML = losAngelesTime.format("MMMM\tDo YYYY");
    losAngelesTimeElement.innerHTML = losAngelesTime.format("h:mm:ss [<small>]A[</small>]");
  }
  // Paris
  let parisElement = document.querySelector(".default-paris");
  if (parisElement) {
    let parisDateElement = parisElement.querySelector(".date");
    let parisTimeElement = parisElement.querySelector(".time");
    let parisTime = moment().tz("Europe/Paris");
    parisDateElement.innerHTML = parisTime.format("MMMM\tDo YYYY");
    parisTimeElement.innerHTML = parisTime.format("h:mm:ss [<small>]A[</small>]");
  }
}

let dualCityInterval = null;

function updateDualCities() {
  let city1 = document.querySelector('#city1').value;
  let city2 = document.querySelector('#city2').value;
  if (!city1 && !city2) {
    // Restore default view
    if (dualCityInterval) clearInterval(dualCityInterval);
    citiesElement.innerHTML = originalCitiesHTML;
    updateTime();
    mainInterval = setInterval(updateTime, 1000);
    return;
  }
  if (mainInterval) clearInterval(mainInterval);
  if (dualCityInterval) clearInterval(dualCityInterval);
  let cities = [];
  if (city1) cities.push(city1);
  if (city2 && city2 !== city1) cities.push(city2);
  let html = cities.map(tz => {
    let cityName = tz === "current" ? "My current location" : tz.replace("_", " ").split("/")[1];
    let cityTime = moment().tz(tz === "current" ? moment.tz.guess() : tz);
    return `<div class="city">
      <div>
        <h2>${cityName}</h2>
        <div class="date">${cityTime.format("MMMM\tDo YYYY")}</div>
      </div>
      <div class="time">${cityTime.format("h:mm:ss")} <small>${cityTime.format("A")}</small></div>
    </div>`;
  }).join('');
  citiesElement.innerHTML = html;
  dualCityInterval = setInterval(() => {
    let cityDivs = document.querySelectorAll('#cities .city');
    cities.forEach((tz, i) => {
      let cityName = tz === "current" ? "My current location" : tz.replace("_", " ").split("/")[1];
      let cityTime = moment().tz(tz === "current" ? moment.tz.guess() : tz);
      let dateDiv = cityDivs[i].querySelector('.date');
      let timeDiv = cityDivs[i].querySelector('.time');
      if (dateDiv && timeDiv) {
        dateDiv.innerHTML = cityTime.format("MMMM\tDo YYYY");
        timeDiv.innerHTML = `${cityTime.format("h:mm:ss")} <small>${cityTime.format("A")}</small>`;
      }
    });
  }, 1000);
}






updateTime();
let mainInterval = setInterval(updateTime, 1000);

let city1Select = document.querySelector('#city1');
let city2Select = document.querySelector('#city2');
function handleCityChange() {
  let city1 = city1Select.value;
  let city2 = city2Select.value;
  if (city1 || city2) {
    updateDualCities();
  } else {
    // Restore default view immediately
    if (dualCityInterval) clearInterval(dualCityInterval);
    citiesElement.innerHTML = originalCitiesHTML;
    updateTime();
    mainInterval = setInterval(updateTime, 1000);
  }
}
city1Select.addEventListener('change', handleCityChange);
city2Select.addEventListener('change', handleCityChange);
