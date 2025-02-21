import React from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow } from 'lucide-react';
import type { ForecastDay } from '../lib/types/weather';

interface ForecastCardProps extends ForecastDay {
  unit: string;
  convertTemp: (temp: number) => number;
  onClick: () => void;
  isSelected: boolean;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ 
  date, 
  maxTemp, 
  minTemp, 
  condition, 
  unit, 
  convertTemp,
  onClick,
  isSelected
}) => {
  const getWeatherIcon = () => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-8 h-8 text-[#8FE3CF]" />;
      case 'clouds':
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="w-8 h-8 text-[#8FE3CF]" />;
      case 'rain':
      case 'moderate rain':
        return <CloudRain className="w-8 h-8 text-[#8FE3CF]" />;
      case 'drizzle':
        return <CloudDrizzle className="w-8 h-8 text-[#8FE3CF]" />;
      case 'thunderstorm':
        return <CloudLightning className="w-8 h-8 text-[#8FE3CF]" />;
      case 'snow':
        return <CloudSnow className="w-8 h-8 text-[#8FE3CF]" />;
      default:
        return <Sun className="w-8 h-8 text-[#8FE3CF]" />;
    }
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full bg-[#2B4865]/30 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-[#2B4865]/50 transition-colors ${
        isSelected ? 'ring-2 ring-[#8FE3CF]' : ''
      }`}
    >
      <h3 className="font-semibold mb-1">{date}</h3>
      <div className="flex justify-center mb-2">
        {getWeatherIcon()}
      </div>
      <div className="flex justify-center gap-2 text-xl font-bold">
        <span className="text-[#8FE3CF]">{convertTemp(maxTemp)}°</span>
        <span className="text-gray-400">{convertTemp(minTemp)}°</span>
      </div>
      <p className="text-sm text-gray-300 mt-1">{condition}</p>
    </button>
  );
};

export default ForecastCard;