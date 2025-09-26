// Weather API

const apiKey = '28005a3f08f94cce93e190128252509';

const inputForm = document.querySelector('.header__input form');
const inputCity = document.getElementById('input__city');
const autocompleteList = document.createElement('ul');
autocompleteList.classList.add('autocomplete-list');
inputForm.appendChild(autocompleteList);

// Update Weather

function updateWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=en`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      
      // Main Info

      document.getElementById('city').textContent = data.location.name;
      document.getElementById('temperature').textContent =
        Math.round(data.current.temp_c) + '°';

      // Custom Date

      const [datePart, timePart] = data.location.localtime.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hourStr, minuteStr] = timePart.split(':');
      const dateObj = new Date(year, month - 1, day, hourStr, minuteStr);

      const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const formattedDate = `${String(dateObj.getHours()).padStart(
        2,
        '0'
      )}:${String(dateObj.getMinutes()).padStart(2, '0')} ${
        weekdays[dateObj.getDay()]
      }, ${dateObj.getDate()} ${months[dateObj.getMonth()]} '${String(
        dateObj.getFullYear()
      ).slice(2)}`;
      document.getElementById('date').textContent = formattedDate;

      // Icons And Background

      const condition = data.current.condition.text.toLowerCase();
      const isDay = data.current.is_day === 1;
      let iconFile, bgClass;

      if (condition.includes('clear')) {
        iconFile = isDay ? 'sunny.svg' : 'clear-night.svg';
        bgClass = isDay ? 'sunny' : 'clear-night';
      } else if (condition.includes('partly') || condition.includes('cloud')) {
        iconFile = isDay ? 'partly-cloudy.svg' : 'partly-cloudy-night.svg';
        bgClass = 'cloudy';
      } else if (
        condition.includes('cloudy') ||
        condition.includes('overcast')
      ) {
        iconFile = 'cloudy.svg';
        bgClass = 'cloudy';
      } else if (condition.includes('rain') || condition.includes('drizzle')) {
        iconFile = 'rain.svg';
        bgClass = 'rain';
      } else if (condition.includes('snow')) {
        iconFile = 'snow.svg';
        bgClass = 'snow';
      } else if (condition.includes('thunder')) {
        iconFile = 'thunderstorm.svg';
        bgClass = 'thunderstorm';
      } else if (condition.includes('fog') || condition.includes('mist')) {
        iconFile = 'fog.svg';
        bgClass = 'fog';
      } else {
        iconFile = 'default.svg';
        bgClass = 'default';
      }

      document.getElementById(
        'weather-icon'
      ).innerHTML = `<img src="images/icons/${iconFile}" alt="${data.current.condition.text}">`;

      // Add Classes For Body

      document.body.className = '';
      document.body.classList.add(bgClass);
      document.body.classList.add('weather-loaded');

      // Weather Details

      document.querySelector('.details__description').textContent =
        data.current.condition.text;
      document.querySelector('.temp-max__value').textContent =
        Math.round(data.current.temp_c) + '°';
      document.querySelector('.temp-min__value').textContent =
        Math.round(data.current.temp_c) + '°';
      document.querySelector('.humidity__value').textContent =
        data.current.humidity + '%';
      document.querySelector('.cloudy__value').textContent =
        data.current.cloud + '%';
      document.querySelector('.wind__value').textContent =
        data.current.wind_kph + ' km/h';

      // Details Icons 

      document.querySelector('.temp-max__icon').innerHTML =
        '<img src="images/icons/temp-up.svg">';
      document.querySelector('.temp-min__icon').innerHTML =
        '<img src="images/icons/temp-down.svg">';
      document.querySelector('.humidity__icon').innerHTML =
        '<img src="images/icons/humidity.svg">';
      document.querySelector('.cloudy__icon').innerHTML =
        '<img src="images/icons/cloudy.svg">';
      document.querySelector('.wind__icon').innerHTML =
        '<img src="images/icons/wind.svg">';
    })
    .catch((err) => console.error('Error:', err));
}

// Seacrh form

inputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = inputCity.value.trim();
  if (city) {
    updateWeather(city);
    autocompleteList.innerHTML = '';
  }
});

// Autosuggestions

inputCity.addEventListener('input', () => {
  const query = inputCity.value.trim();
  if (!query) {
    autocompleteList.innerHTML = '';
    return;
  }

  fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`)
    .then((res) => res.json())
    .then((data) => {
      autocompleteList.innerHTML = '';
      data.forEach((city) => {
        const li = document.createElement('li');
        li.textContent = `${city.name}, ${city.country}`;
        li.addEventListener('click', () => {
          inputCity.value = city.name;
          autocompleteList.innerHTML = '';
          updateWeather(city.name);
        });
        autocompleteList.appendChild(li);
      });
    })
    .catch((err) => console.error(err));
});

// Close When Click Outside

document.addEventListener('click', (e) => {
  if (!inputForm.contains(e.target)) {
    autocompleteList.innerHTML = '';
  }
});

// Initialisation With Default City

updateWeather('Kyiv');
