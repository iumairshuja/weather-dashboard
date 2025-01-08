import React, { useRef } from 'react';
import { Cloud, Sun, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HourlyWeather } from '../lib/types/weather';

interface HourlyForecastProps {
  hourlyData: HourlyWeather[];
  unit: string;
  convertTemp: (temp: number) => number;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData, unit, convertTemp }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-6 h-6 text-[#8FE3CF]" />;
      case 'clouds':
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="w-6 h-6 text-[#8FE3CF]" />;
      case 'rain':
      case 'moderate rain':
        return <CloudRain className="w-6 h-6 text-[#8FE3CF]" />;
      case 'drizzle':
        return <CloudDrizzle className="w-6 h-6 text-[#8FE3CF]" />;
      case 'thunderstorm':
        return <CloudLightning className="w-6 h-6 text-[#8FE3CF]" />;
      case 'snow':
        return <CloudSnow className="w-6 h-6 text-[#8FE3CF]" />;
      default:
        return <Sun className="w-6 h-6 text-[#8FE3CF]" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2B4865]/50 p-2 rounded-full hover:bg-[#2B4865] transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <div 
        ref={scrollRef}
        className="overflow-x-auto hourly-scroll px-8"
      >
        <div className="flex gap-4 pb-4">
          {hourlyData.map((hour, index) => (
            <div 
              key={index}
              className="flex flex-col items-center bg-[#2B4865]/30 backdrop-blur-sm rounded-xl p-4 min-w-[140px]"
            >
              <span className="text-sm font-medium">{hour.time}</span>
              {getWeatherIcon(hour.condition)}
              <span className="text-lg font-bold mt-2">{convertTemp(hour.temp)}°{unit}</span>
              <span className="text-xs text-gray-300 mt-1">{hour.chanceOfRain}% rain</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => scroll('right')} 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2B4865]/50 p-2 rounded-full hover:bg-[#2B4865] transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

export default HourlyForecast;