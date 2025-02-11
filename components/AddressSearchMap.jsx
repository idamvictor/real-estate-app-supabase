"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { Input } from "../components/ui/input";
import dynamic from "next/dynamic";

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import("../components/map"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});

export function AddressSearchMap({ onLocationSelect }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (value.length >= 3) {
        searchAddress(value);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const searchAddress = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (location) => {
    setValue(location.display_name);
    setShowSuggestions(false);
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative" ref={inputRef}>
        <Input
          type="text"
          placeholder="Search Property Address"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="w-full h-12 pl-10"
        />
        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            {loading ? (
              <div className="p-2 text-center">Loading...</div>
            ) : (
              suggestions.map((location) => (
                <div
                  key={location.display_name}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(location)}
                >
                  <MapPin className="inline-block mr-2 h-4 w-4" />
                  {location.display_name}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="w-full h-[300px] rounded-lg overflow-hidden">
          <Map
            center={[
              Number.parseFloat(selectedLocation.lat),
              Number.parseFloat(selectedLocation.lon),
            ]}
          />
        </div>
      )}
    </div>
  );
}
