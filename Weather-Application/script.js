document.getElementById('cityInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') getWeather();
});

// Weather code interpretation based on WMO standards
function getWeatherIconAndDescription(code) {
  const weatherMap = {
    0: { icon: "☀️", desc: "Clear sky" },
    1: { icon: "🌤️", desc: "Mainly clear" },
    2: { icon: "⛅", desc: "Partly cloudy" },
    3: { icon: "☁️", desc: "Overcast" },
    45: { icon: "🌫️", desc: "Fog" },
    48: { icon: "🌫️", desc: "Depositing rime fog" },
    51: { icon: "🌧️", desc: "Light drizzle" },
    53: { icon: "🌧️", desc: "Moderate drizzle" },
    55: { icon: "🌧️", desc: "Dense drizzle" },
    56: { icon: "🌧️", desc: "Light freezing drizzle" },
    57: { icon: "🌧️", desc: "Dense freezing drizzle" },
    61: { icon: "🌧️", desc: "Slight rain" },
    63: { icon: "🌧️", desc: "Moderate rain" },
    65: { icon: "🌧️", desc: "Heavy rain" },
    66: { icon: "🌧️", desc: "Light freezing rain" },
    67: { icon: "🌧️", desc: "Heavy freezing rain" },
    71: { icon: "🌨️", desc: "Slight snow fall" },
    73: { icon: "🌨️", desc: "Moderate snow fall" },
    75: { icon: "🌨️", desc: "Heavy snow fall" },
    77: { icon: "🌨️", desc: "Snow grains" },
    80: { icon: "🌧️", desc: "Slight rain showers" },
    81: { icon: "🌧️", desc: "Moderate rain showers" },
    82: { icon: "🌧️", desc: "Violent rain showers" },
    85: { icon: "🌨️", desc: "Slight snow showers" },
    86: { icon: "🌨️", desc: "Heavy snow showers" },
    95: { icon: "⛈️", desc: "Thunderstorm" },
    96: { icon: "⛈️", desc: "Thunderstorm with slight hail" },
    99: { icon: "⛈️", desc: "Thunderstorm with heavy hail" },
  };
  return weatherMap[code] || { icon: "❓", desc: "Unknown" };
}

async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const city = cityInput.value.trim();
  const weatherDiv = document.getElementById("weatherInfo");
  const searchBox = document.querySelector(".search-box");
  
  if (!city) {
    searchBox.classList.remove('error');
    void searchBox.offsetWidth; // Trigger reflow
    searchBox.classList.add('error');
    return;
  }

  // Show Loading state
  weatherDiv.innerHTML = `<div class="loader"></div>`;
  searchBox.classList.remove('error');

  try {
    // 1. Convert City Name to Coordinates using Open-Meteo Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Geocoding failed.");
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${city}" not found`);
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Fetch Weather Data using coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&wind_speed_unit=ms`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("Weather API failed.");
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    // Convert WMO code
    const weatherDetails = getWeatherIconAndDescription(current.weathercode);

    // 3. Update DOM dynamically
    weatherDiv.innerHTML = `
      <div class="weather-data">
        <h2>${name}, ${country}</h2>
        <div class="condition">
          <span>${weatherDetails.icon}</span> ${weatherDetails.desc}
        </div>
        <div class="metrics">
          <div class="metric-card">
            <span class="label">Temperature</span>
            <span class="value">${current.temperature}°C</span>
          </div>
          <div class="metric-card">
            <span class="label">Wind Speed</span>
            <span class="value">${current.windspeed} m/s</span>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    searchBox.classList.add('error');
    weatherDiv.innerHTML = `
      <div class="error-msg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>${err.message}</span>
      </div>
    `;
  }
}
