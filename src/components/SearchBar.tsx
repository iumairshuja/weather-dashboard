import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchCities } from '../lib/services/weather';

interface SearchBarProps {
  onCitySelect: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const cities = await searchCities(searchTerm);
        setSuggestions(cities);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onCitySelect(searchTerm);
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (cityName: string) => {
    onCitySelect(cityName);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 relative">
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a city..."
          className="w-full bg-[#002B5B]/30 border border-[#8FE3CF]/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#8FE3CF] transition-colors"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        
        {suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-[#002B5B] rounded-xl shadow-lg overflow-hidden z-10">
            {suggestions.map((city, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(city.name)}
                className="w-full px-4 py-2 text-left hover:bg-[#2B4865] transition-colors"
              >
                {city.name}
              </button>
            ))}
          </div>
        )}
        
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#8FE3CF] border-t-transparent"></div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;