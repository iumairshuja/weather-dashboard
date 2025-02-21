import React, { useState, useEffect } from 'react';
import { Settings, Thermometer, Wind, Droplets, Sun, Moon } from 'lucide-react';
import ForecastCard from './components/ForecastCard';
import SearchBar from './components/SearchBar';
import HourlyForecast from './components/HourlyForecast';
import { fetchWeather } from './lib/services/weather';
import { DEFAULT_CITY } from './lib/config/constants';
import type { CurrentWeather, ForecastDay } from './lib/types/weather';

export default function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [unit, setUnit] = useState('C');
  const [isDark, setIsDark] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await fetchWeather(city);
        setWeather(data.current);
        setForecast(data.forecast);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };
    loadWeather();
  }, [city]);

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  const convertTemp = (temp: number) => {
    if (!temp) return 0;
    return unit === 'C' 
      ? Math.round(temp) 
      : Math.round(temp * 9/5 + 32);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-[#256D85] to-[#2B4865]'
    } text-white`}>
      <header className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-['Helvetica'] font-bold text-[#8FE3CF]">Weather Dashboard</h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 hover:bg-[#002B5B] rounded-full transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>
              
              {isSettingsOpen && (
                <div className="absolute right-4 mt-32 bg-[#002B5B] rounded-xl shadow-lg p-4 z-10">
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={toggleUnit}
                      className="flex items-center gap-2 hover:text-[#8FE3CF] transition-colors"
                    >
                      <Thermometer className="w-5 h-5" />
                      {unit}°
                    </button>
                    <button 
                      onClick={toggleTheme}
                      className="flex items-center gap-2 hover:text-[#8FE3CF] transition-colors"
                    >
                      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <SearchBar onCitySelect={handleCitySelect} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {weather && (
          <>
            <div className="bg-[#2B4865]/30 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{city}</h2>
                  <p className="text-gray-300 mb-4">{weather.date}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Thermometer className="w-8 h-8 text-[#8FE3CF]" />
                    <span className="text-5xl font-bold">
                      {convertTemp(weather.temp)}°{unit}
                    </span>
                  </div>
                  <p className="text-xl mt-2">{weather.condition}</p>
                  <div className="flex justify-center md:justify-start gap-4 mt-2">
                    <span className="text-[#8FE3CF]">H: {convertTemp(weather.maxTemp)}°</span>
                    <span className="text-gray-400">L: {convertTemp(weather.minTemp)}°</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#002B5B]/30 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Wind className="w-5 h-5 text-[#8FE3CF]" />
                      <span>Wind</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{Math.round(weather.windSpeed)} km/h</p>
                  </div>
                  <div className="bg-[#002B5B]/30 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-[#8FE3CF]" />
                      <span>Humidity</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{weather.humidity}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2B4865]/30 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Hourly Forecast - {forecast[selectedDay]?.date}
              </h3>
              <HourlyForecast 
                hourlyData={forecast[selectedDay]?.hourlyData || []}
                unit={unit}
                convertTemp={convertTemp}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <ForecastCard 
                  key={index}
                  {...day}
                  unit={unit}
                  convertTemp={convertTemp}
                  onClick={() => setSelectedDay(index)}
                  isSelected={selectedDay === index}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}