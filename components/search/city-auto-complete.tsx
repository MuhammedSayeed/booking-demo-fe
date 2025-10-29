"use client"

import { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2 } from "lucide-react"
import axios from "axios"

import { useParams } from "next/navigation"

// City interface for autocomplete
interface City {
    id: number
    name: string
    country: {
        id: number
        name: string
        code: string
    }
    state_province: string
}

interface CityAutocompleteProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    name?: string
    className?: string
    onCitySelect?: (city: City) => void
}

export function CityAutocomplete({
    value,
    onChange,
    placeholder = "Where are you going?",
    name = "destination",
    className = "",
    onCitySelect,
}: CityAutocompleteProps) {
    const [cities, setCities] = useState<City[]>([])
    const [showCitySuggestions, setShowCitySuggestions] = useState(false)
    const [loadingCities, setLoadingCities] = useState(false)
    const param = useParams()

    // Fetch cities from API
    const fetchCities = useCallback(
        async (searchTerm: string) => {
            if (searchTerm.length < 2) {
                setCities([])
                setShowCitySuggestions(false)
                return
            }

            setLoadingCities(true)
            try {
                // Try multiple possible endpoints for cities
                let response
                const possibleEndpoints = [
                    `${process.env.NEXT_PUBLIC_BASEURL}/hotels/api/v1/cities/?search=${encodeURIComponent(searchTerm)}&lang=${param.locale}`,
                    `${process.env.NEXT_PUBLIC_BASEURL}/cities/api/v1/?search=${encodeURIComponent(searchTerm)}&lang=${param.locale}`,
                    `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/cities/?search=${encodeURIComponent(searchTerm)}&lang=${param.locale}`,
                    // Fallback: extract cities from hotels data
                    `${process.env.NEXT_PUBLIC_BASEURL}/hotels/api/v1/?search=${encodeURIComponent(searchTerm)}&lang=${param.locale}`,
                ]

                for (const endpoint of possibleEndpoints) {
                    try {
                        response = await axios.get(endpoint, {
                            headers: {
                                "ngrok-skip-browser-warning": "true"
                            },
                        })

                        // If this is the hotels endpoint (last one), extract unique cities
                        if (endpoint.includes("/hotels/api/v1/?search=")) {
                            const hotels = response.data.results || []
                            const uniqueCities = hotels
                                .map((hotel: any) => hotel.city)
                                .filter(
                                    (city: any, index: number, self: any[]) => city && self.findIndex((c) => c.id === city.id) === index,
                                )
                                .filter((city: any) => city.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            setCities(uniqueCities)
                        } else {
                            // Direct cities endpoint response
                            setCities(response.data.results || response.data || [])
                        }

                        setShowCitySuggestions(true)
                        break // Exit loop if successful
                    } catch (error) {
                        // Continue to next endpoint
                        continue
                    }
                }

                if (!response) {
                    throw new Error("No cities endpoint available")
                }
            } catch (error) {
                console.log("Error fetching cities:", error)
                setCities([])
                setShowCitySuggestions(false)
            } finally {
                setLoadingCities(false)
            }
        },
        [param.locale],
    )

    // Debounced search for cities
    useEffect(() => {
        const timer = setTimeout(() => {
            if (value) {
                fetchCities(value)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [value, fetchCities])

    // Handle city selection
    const handleCitySelect = (city: City) => {
        onChange(city.name)
        setShowCitySuggestions(false)
        onCitySelect?.(city)
    }

    // Handle input blur to hide suggestions
    const handleInputBlur = () => {
        // Delay hiding to allow for city selection
        setTimeout(() => {
            setShowCitySuggestions(false)
        }, 200)
    }

    return (
        <div className="relative">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                    name={name}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => value.length >= 2 && setShowCitySuggestions(true)}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    className={`pl-9 ${className}`}
                    autoComplete="off"
                />
                {loadingCities && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* City Suggestions Dropdown */}
            {showCitySuggestions && cities.length > 0 && (
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
                                    {city.state_province && `${city.state_province}, `}
                                    {city.country.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
