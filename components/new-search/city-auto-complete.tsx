"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import BASEURL from "@/context/handleAPIDomain"
import { useTranslations } from "next-intl"

interface CityAutocompleteProps {
    value: string
    onChange: (value: string) => void
    error?: string
}

interface CityOption {
    id: string
    state_province: string
}

export function CityAutocomplete({ value, onChange, error }: CityAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<CityOption[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const tMain = useTranslations();

    const fetchCities = useCallback(async (searchTerm: string) => {
        if (searchTerm.length <= 2) {
            setSuggestions([])
            setIsOpen(false)
            return
        }

        setIsLoading(true)
        try {
            const res = await axios.get(`${BASEURL}/hotels/api/v1/cities`, {
                headers: {
                    "ngrok-skip-browser-warning": "true"
                }
            })
            // Simulate filtering based on search term (API returns all cities)
            if (res.data) {
                const filtered = res.data.results.slice(0, 5)
                setSuggestions(filtered)
                setIsOpen(true)
            }
        } catch (error) {
            setSuggestions([])
            setIsOpen(false)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        onChange(newValue)

        // Clear existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        // Set new timer for API call
        debounceTimer.current = setTimeout(() => {
            fetchCities(newValue)
        }, 300)
    }

    const handleSelectCity = (city: CityOption) => {
        onChange(city.state_province)
        setSuggestions([])
        setIsOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    return (
        <div className="space-y-2 relative" ref={containerRef}>

            <Label htmlFor="city">
                City
            </Label>
            <div className="relative">
                <Input
                    id="city"
                    placeholder="Enter city name"
                    value={value}
                    onChange={handleInputChange}
                    onClick={() => value.length > 2 && setIsOpen(true)}
                    className={error ? "border-red-500" : ""}
                    autoComplete="off"
                />

                {isOpen && (suggestions.length > 0 || isLoading) && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-xl z-50">
                        {isLoading ? (
                            <div className="p-3 text-sm text-gray-500">Loading cities...</div>
                        ) : (
                            <ul className="max-h-48 overflow-y-auto">
                                {suggestions.map((city) => (
                                    <li key={city.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelectCity(city)}
                                            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                                        >
                                            {city.state_province}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}
