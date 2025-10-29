"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import axios from "axios";
import BASEURL from "@/context/handleAPIDomain";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSearchDateSlice } from "@/lib/features/SearchDate/SearchDate";
import { useAppSelector } from "@/lib/hooks";

interface City {
  id: number;
  name: string;
  country: {
    id: number;
    name: string;
    code: string;
  };
  state_province: string;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  className?: string;
  onCitySelect?: (city: City) => void;
}

export function CityAutocomplete({
  value,
  onChange,
  placeholder = "Where are you going?",
  name = "destination",
  className = "",
  onCitySelect,
}: CityAutocompleteProps) {
  const [newValue, setNewValue] = useState(value);
  const [cities, setCities] = useState<City[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // New state to track typing
  const param = useParams();
  //   console.log("value ", value);

  // Sync newValue with prop value
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // Fetch cities from API
  const findCitys = async (newValue: string) => {
    await axios.get(`${BASEURL}/hotels/api/v1/cities` , {
      headers : {
        "ngrok-skip-browser-warning": "true"
      }
    }).then((response) => { 
      const allCities: City[] = response.data.results;
      setLoadingCities(true);
      const filteredCities = allCities.filter((city) =>
        city.name.toLowerCase().includes(newValue.toLowerCase())
      );
      setCities(filteredCities.slice(0, 10)); // Limit to 10 suggestions
      setLoadingCities(false);
      setShowCitySuggestions(filteredCities.length > 0);
      // console.log("filteredCities ", filteredCities);
    }).catch((error) => {
      console.error("Error fetching cities:", error);
    }
    );
  };
  // Debounced search for cities
  useEffect(() => {
    setCities([]);
    setShowCitySuggestions(false);
    const timer = setTimeout(() => {
      if (newValue && !isCitySelected && isTyping) {
        findCitys(newValue);
      } else {
        setCities([]);
        setShowCitySuggestions(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [newValue, isCitySelected, isTyping]);

  // Handle city selection
  const date = useAppSelector((state) => state.searchDateSlice);
  const dispatch = useDispatch();
  const handleCitySelect = (city: City) => {
    dispatch(
      setSearchDateSlice({
        from: date.from,
        to: date.to,
        guests: date.guests,
        city: city.name,
      })
    );
    setNewValue(city.name);
    onChange(city.name);
    setShowCitySuggestions(false);
    setIsCitySelected(true);
    setIsTyping(false); // Stop typing state
    onCitySelect?.(city);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // console.log("inputValue ", inputValue);

    setNewValue(inputValue);
    onChange(inputValue);
    setIsCitySelected(false);
    setIsTyping(true); // Set typing state to true
    setShowCitySuggestions(inputValue.length >= 2); // Show suggestions if input length >= 2
  };

  // Handle input blur to hide suggestions
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowCitySuggestions(false);
      setIsTyping(false); // Reset typing state
    }, 200);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (newValue.length >= 2 && !isCitySelected && isTyping) {
      setShowCitySuggestions(true);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          name={name}
          type="text"
          value={newValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`pl-9 ${className}`}
          autoComplete="off"
        />
        {loadingCities && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            <i className="fa-duotone fa-solid fa-spinner animate-spin"></i>
          </div>
        )}
      </div>

      {/* City Suggestions Dropdown */}
      {showCitySuggestions && cities.length > 0 && isTyping && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {cities.map((city) => (
            <div
              key={city.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm"
              onMouseDown={() => handleCitySelect(city)}
            >
              <MapPin className="h-3 w-3 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">{city.name}</div>
                <div className="text-gray-600 text-xs">
                  {`${city.state_province && `${city.state_province}, `}${
                    city.country.name
                  }`.length > 50
                    ? city.country.name.slice(0, 50) + "..."
                    : city.country.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
