export interface CurrentWeather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  maxTemp: number;
  minTemp: number;
  date: string;
  hourlyData: HourlyWeather[];
}

export interface HourlyWeather {
  time: string;
  temp: number;
  condition: string;
  chanceOfRain: number;
}

export interface ForecastDay {
  date: string;
  day: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  hourlyData: HourlyWeather[];
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}