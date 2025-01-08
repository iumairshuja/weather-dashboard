import axios from 'axios';

const OPENWEATHER_KEY = '29892887fa2cac938bc496af5beef8d4';
const WEATHERAPI_KEY = '6999d80d0c954154a9d33047250801';

// Primary API (OpenWeatherMap)
const fetchFromOpenWeather = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_KEY}`
    );
    return {
      temp: response.data.main.temp,
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      feelsLike: response.data.main.feels_like
    };
  } catch (error) {
    throw error;
  }
};

// Backup API (WeatherAPI)
const fetchFromWeatherAPI = async (city) => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${city}`
    );
    return {
      temp: response.data.current.temp_c,
      condition: response.data.current.condition.text,
      humidity: response.data.current.humidity,
      windSpeed: response.data.current.wind_kph,
      feelsLike: response.data.current.feelslike_c
    };
  } catch (error) {
    throw error;
  }
};

// Fetch current weather with failover
export const fetchWeather = async (city) => {
  try {
    return await fetchFromOpenWeather(city);
  } catch (error) {
    console.log('Falling back to WeatherAPI');
    return await fetchFromWeatherAPI(city);
  }
};

// Fetch forecast
export const fetchForecast = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${OPENWEATHER_KEY}`
    );
    
    // Get one forecast per day
    const dailyForecasts = response.data.list
      .filter((item, index) => index % 8 === 0)
      .slice(0, 5)
      .map(item => ({
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: item.main.temp,
        condition: item.weather[0].main
      }));
    
    return dailyForecasts;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return [];
  }
};

// City search with autocomplete
export const searchCities = async (query) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${OPENWEATHER_KEY}`
    );
    return response.data.map(city => ({
      name: `${city.name}, ${city.country}`,
      lat: city.lat,
      lon: city.lon
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};