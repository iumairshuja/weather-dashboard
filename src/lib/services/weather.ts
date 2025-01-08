import axios from 'axios';
import { API_KEYS, WEATHER_ENDPOINTS } from '../config/constants';
import type { CurrentWeather, ForecastDay, City } from '../types/weather';

// Primary API (WeatherAPI)
const fetchFromWeatherAPI = async (city: string) => {
  try {
    const response = await axios.get(
      `${WEATHER_ENDPOINTS.WEATHERAPI_BASE}/forecast.json?key=${API_KEYS.WEATHERAPI}&q=${city}&days=5&aqi=no`
    );
    
    const hourlyData = response.data.forecast.forecastday[0].hour.map(hour => ({
      time: new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
      temp: hour.temp_c,
      condition: hour.condition.text,
      chanceOfRain: hour.chance_of_rain
    }));

    return {
      current: {
        temp: response.data.current.temp_c,
        condition: response.data.current.condition.text,
        humidity: response.data.current.humidity,
        windSpeed: response.data.current.wind_kph,
        feelsLike: response.data.current.feelslike_c,
        maxTemp: response.data.forecast.forecastday[0].day.maxtemp_c,
        minTemp: response.data.forecast.forecastday[0].day.mintemp_c,
        date: new Date(response.data.current.last_updated).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        hourlyData
      },
      forecast: response.data.forecast.forecastday.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        }),
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        condition: day.day.condition.text,
        hourlyData: day.hour.map(hour => ({
          time: new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
          temp: hour.temp_c,
          condition: hour.condition.text,
          chanceOfRain: hour.chance_of_rain
        }))
      }))
    };
  } catch (error) {
    throw error;
  }
};

// Backup API (OpenWeather)
const fetchFromOpenWeather = async (city: string) => {
  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(
        `${WEATHER_ENDPOINTS.OPENWEATHER_BASE}/weather?q=${city}&units=metric&appid=${API_KEYS.OPENWEATHER}`
      ),
      axios.get(
        `${WEATHER_ENDPOINTS.OPENWEATHER_BASE}/forecast?q=${city}&units=metric&appid=${API_KEYS.OPENWEATHER}`
      )
    ]);

    const hourlyData = forecastResponse.data.list.slice(0, 24).map(hour => ({
      time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
      temp: hour.main.temp,
      condition: hour.weather[0].main,
      chanceOfRain: hour.pop * 100
    }));

    return {
      current: {
        temp: currentResponse.data.main.temp,
        condition: currentResponse.data.weather[0].main,
        humidity: currentResponse.data.main.humidity,
        windSpeed: currentResponse.data.wind.speed * 3.6, // Convert m/s to km/h
        feelsLike: currentResponse.data.main.feels_like,
        maxTemp: currentResponse.data.main.temp_max,
        minTemp: currentResponse.data.main.temp_min,
        date: new Date(currentResponse.data.dt * 1000).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        hourlyData
      },
      forecast: forecastResponse.data.list
        .filter((item, index) => index % 8 === 0)
        .map(day => ({
          date: new Date(day.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          }),
          day: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          maxTemp: day.main.temp_max,
          minTemp: day.main.temp_min,
          condition: day.weather[0].main,
          hourlyData: forecastResponse.data.list
            .filter(hour => 
              new Date(hour.dt * 1000).toDateString() === new Date(day.dt * 1000).toDateString()
            )
            .map(hour => ({
              time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
              temp: hour.main.temp,
              condition: hour.weather[0].main,
              chanceOfRain: hour.pop * 100
            }))
        }))
    };
  } catch (error) {
    throw error;
  }
};

// Fetch weather with failover
export const fetchWeather = async (city: string) => {
  try {
    return await fetchFromWeatherAPI(city);
  } catch (error) {
    console.log('Falling back to OpenWeather API');
    return await fetchFromOpenWeather(city);
  }
};

// City search with autocomplete
export const searchCities = async (query: string): Promise<City[]> => {
  try {
    const response = await axios.get(
      `${WEATHER_ENDPOINTS.WEATHERAPI_BASE}/search.json?key=${API_KEYS.WEATHERAPI}&q=${query}`
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