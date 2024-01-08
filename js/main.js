const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
  if (this.readyState === this.DONE) {
    let jsonResult = JSON.parse(this.responseText);
    console.log(jsonResult);
    let countrySelected = document.querySelector('#countries');
    let countryName = '';
    countryName += `<option value ="">Select Country</option>
                        `;
    for (let i = 0; i < jsonResult.length; i++) {
      countryName +=
        `<option value ="` +
        jsonResult[i].key +
        `">` +
        jsonResult[i].value +
        `</option>
                        `;
    }
    countrySelected.innerHTML = countryName;
  }
});

xhr.open(
  'GET',
  'https://referential.p.rapidapi.com/v1/country?fields=iso_a2%2Cstate_code%2Cstate_hasc%2Ctimezone%2Ctimezone_offset&lang=en&limit=250'
);
xhr.setRequestHeader(
  'X-RapidAPI-Key',
  'd9935709d4mshbda5a3edfae39b2p161af4jsnf2e04b2c1271'
);
xhr.setRequestHeader('X-RapidAPI-Host', 'referential.p.rapidapi.com');
xhr.send(data);

citesInCountry = (countryCode) => {
  const data = null;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    let waitingDiv = document.getElementById('waiting-box');
    waitingDiv.innerHTML = "<p class = 'text-center'>Loading...</p>";

    if (this.readyState === this.DONE) {
      cities = JSON.parse(this.responseText);
     
      waitingDiv.innerHTML = '';
      let citiesList = document.querySelector('#cities-list');
      let cityName = '';
      for (let j = 0; j < cities.length; j++) {
        // always start from 0
        cityName +=
          `<li class="sm:py-4 listed">
                                <div class="flex items-center space-x-4">
                                        <div class="flex-1 min-w-0">
                                        <p class="city-name text-sm font-medium text-gray-900 truncate dark:text-white">
                                                ` +
          cities[j].value +
          `
                                        </p>
                                        </div>
                                        <button data-city=` +
          cities[j].value +
          ` id="weather-button-` +
          j +
          `" type="button" class="weather-button
                                         text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none
                                          focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                          Show Weather</button>
                                </div>
                                </li>`;
      }
      citiesList.innerHTML = cityName;
    }
    let weatherAdd = document.querySelectorAll('.weather-button');
    if (weatherAdd.length) {
      weatherAdd.forEach((element) => {
        weatherCheck(element);
      });
    }
  });

  xhr.open(
    'GET',
    'https://referential.p.rapidapi.com/v1/city?fields=iso_a2%2Cstate_code%2Cstate_hasc%2Ctimezone%2Ctimezone_offset&iso_a2=' +
      countryCode +
      '&lang=en&limit=250'
  );
  xhr.setRequestHeader(
    'X-RapidAPI-Key',
    'd9935709d4mshbda5a3edfae39b2p161af4jsnf2e04b2c1271'
  );
  xhr.setRequestHeader('X-RapidAPI-Host', 'referential.p.rapidapi.com');
  xhr.send(data);
};

let filter = () => {
  let filterValue, input, ul, li, i;

  input = document.querySelector('#search');
  filterValue = input.value.toUpperCase();
  ul = document.querySelector('#cities-list');
  li = ul.getElementsByTagName('li');

  for (i = 0; i < li.length; i++) {
    let filterName = li[i].getElementsByTagName('p')[0];
    if (filterName.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }
};
const weatherOfCity = (cityName) => {
  let weatherStatusDiv = document.querySelector('.weather-button');
  let CurrentWeather = weatherStatusDiv.closest('li');

  let url = `https://api.weatherapi.com/v1/current.json?key=f5bad8eea4f24ba78e2195605230309&q=${cityName}&aqi=no`;

  fetch(url)
    .then((respond) => respond.json())
    .then((data) => {
      CurrentWeather.innerHTML = `
                        <li class="sm:py-4 listed flex justify-between">
                        <span>
                        <h3 class="text-transparent bg-clip-text text-2xl bg-sky-800">${data.location.country}</h3>
                        <small class="text-transparent bg-clip-text bg-emerald-600">${data.location.name}</small>
                        </span>
                        <span>
                        <p class="text-transparent bg-clip-text bg-sky-800">${data.current.condition.text}</p>
                        <img class="" src"${data.current.condition.icon}" alt="weather-icon">
                        </span>
                        <span>
                        <p class="text-transparent bg-clip-text bg-emerald-600">Current temp :${data.current.temp_c}&#176;</p>
                        <p class="text-transparent bg-clip-text bg-emerald-600">Feels like :${data.current.feelslike_c}&#176;</p>
                        </span>
                        </li>
                        `;
    })
    .catch(() => {
      CurrentWeather.innerHTML = `<h3> City not found </h3>`;
    });
};

let countrySelected = document.querySelector('#countries');
countrySelected.addEventListener('change', (e) => {
  let countryName = document.querySelector('#countries').value;
  citesInCountry(countryName);
});

const weatherCheck = (element) => {
  element.addEventListener('click', (e) => {
    let button = e.target;
    let cityName = button.dataset.city;
    // call the weather API to get the city current weather
    weatherOfCity(cityName);
  });
};
