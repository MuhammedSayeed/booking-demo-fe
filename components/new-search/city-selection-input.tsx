"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import BASEURL from "@/context/handleAPIDomain"

interface CitySelectProps {
    value: string
    onChange: (value: string) => void
    error?: string
}

interface City {
    id: string
    state_province: string
}

export function CitySelect({ value, onChange, error }: CitySelectProps) {
    const [cities, setCities] = useState<City[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await axios.get(`${BASEURL}/hotels/api/v1/cities`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                })
                setCities(res.data.results || [])
            } catch (error) {
                console.error("[v0] Error fetching cities:", error)
                setCities([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchCities()
    }, [])

    return (
        <div className="space-y-2">
            <Label htmlFor="city">
                City
            </Label>
            <Select value={value} onValueChange={onChange} disabled={isLoading}>
                <SelectTrigger id="city" className={error ? "border-red-500" : ""}>
                    <SelectValue placeholder={isLoading ? "Loading cities..." : "Select a city"} />
                </SelectTrigger>
                <SelectContent>
                    {cities.map((city) => (
                        <SelectItem key={city.id} value={city.state_province}>
                            {city.state_province}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}
