"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchCriteria {
  city: string
  from_date: string
  to_date: string
  num_adults: string
  num_children: string
  lang: string
}

interface SearchSidebarProps {
  onSearch: (criteria: SearchCriteria) => void
}

const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const formatDateToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return ""
  const [day, month, year] = dateString.split("/")
  return `${year}-${month}-${day}`
}

export default function SearchSidebar({ onSearch }: SearchSidebarProps) {
  const searchParams = useSearchParams()
  const [criteria, setCriteria] = useState<SearchCriteria>({
    city: searchParams.get("city") || "",
    from_date: searchParams.get("from_date") ? formatDateToYYYYMMDD(searchParams.get("from_date") || "") : "",
    to_date: searchParams.get("to_date") ? formatDateToYYYYMMDD(searchParams.get("to_date") || "") : "",
    num_adults: searchParams.get("num_adults") || "1",
    num_children: searchParams.get("num_children") || "0",
    lang: searchParams.get("lang") || "en",
  })

  const handleChange = (field: keyof SearchCriteria, value: string) => {
    setCriteria((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!criteria.city || !criteria.from_date || !criteria.to_date || !criteria.num_adults) {
      alert("Please fill in all required fields")
      return
    }

    const searchData: SearchCriteria = {
      ...criteria,
      from_date: formatDateToDDMMYYYY(criteria.from_date),
      to_date: formatDateToDDMMYYYY(criteria.to_date),
    }

    onSearch(searchData)
  }

  return (
    <aside className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Hotel Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Find your perfect stay</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-foreground">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Enter city name"
            value={criteria.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="bg-background border-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="from_date" className="text-foreground">
            Check-in Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="from_date"
            type="date"
            value={criteria.from_date}
            onChange={(e) => handleChange("from_date", e.target.value)}
            className="bg-background border-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="to_date" className="text-foreground">
            Check-out Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="to_date"
            type="date"
            value={criteria.to_date}
            onChange={(e) => handleChange("to_date", e.target.value)}
            className="bg-background border-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="num_adults" className="text-foreground">
            Number of Adults <span className="text-destructive">*</span>
          </Label>
          <Input
            id="num_adults"
            type="number"
            min="1"
            max="10"
            value={criteria.num_adults}
            onChange={(e) => handleChange("num_adults", e.target.value)}
            className="bg-background border-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="num_children" className="text-foreground">
            Number of Children
          </Label>
          <Input
            id="num_children"
            type="number"
            min="0"
            max="10"
            value={criteria.num_children}
            onChange={(e) => handleChange("num_children", e.target.value)}
            className="bg-background border-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lang" className="text-foreground">
            Language
          </Label>
          <Select value={criteria.lang} onValueChange={(value) => handleChange("lang", value)}>
            <SelectTrigger id="lang" className="bg-background border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Search Hotels
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </p>
      </div>
    </aside>
  )
}
