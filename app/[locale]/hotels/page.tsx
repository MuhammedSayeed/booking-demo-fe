"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, Search, CalendarIcon, Filter, X, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import HotelCard from "@/components/search/hotel-card"
import { CityAutocomplete } from "@/components/search/city-auto-complete"

interface Hotel {
  id: string
  name: string
  category: string
  address: string
  city: {
    id: string
    name: string
    country: {
      name: string
      code: string
    }
  }
  images: any[]
  amenities: any[]
}

interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Hotel[]
}

interface Filters {
  priceRange: [number, number]
  stars: string[]
  amenities: string[]
}

export default function HotelsPage() {
  const tMain = useTranslations()
  const { locale } = useParams()
  const searchParams = useSearchParams()

  // Search state
  const [destination, setDestination] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })
  const [guests, setGuests] = useState("1")

  // Data state
  const [data, setData] = useState<ApiResponse>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000],
    stars: [],
    amenities: [],
  })
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Fetch hotels
  const fetchHotels = useCallback(
    async (url?: string) => {
      setLoading(true)
      setError(null)
      try {
        const fetchUrl =
          url ||
          `${process.env.NEXT_PUBLIC_BASEURL}/hotels/api/v1/?page=${currentPage}&search=${destination || ""}&lang=${locale}`

        const response = await axios.get(fetchUrl, {
          headers: {
            "ngrok-skip-browser-warning": "true"
          }
        })
        setData(response.data)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } catch (err) {
        console.error("Error fetching hotels:", err)
        setError(tMain("Failed to load hotels"))
      } finally {
        setLoading(false)
      }
    },
    [currentPage, destination, locale, tMain],
  )


  // Initial fetch
  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  // Filter hotels based on selected filters
  const filteredHotels = data.results.filter((hotel) => {
    // Price filter (mock - API doesn't return price)
    // Stars filter
    if (filters.stars.length > 0) {
      const hotelStars = hotel.category.match(/\d+/)?.[0]
      if (!hotelStars || !filters.stars.includes(hotelStars)) {
        return false
      }
    }
    return true
  })

  const handleSearch = () => {
    setCurrentPage(1)
    fetchHotels()
  }

  const handleNextPage = () => {
    if (data.next) {
      fetchHotels(data.next)
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (data.previous) {
      fetchHotels(data.previous)
      setCurrentPage((prev) => Math.max(1, prev - 1))
    }
  }



  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex flex-col lg:flex-row gap-6">


          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-transparent"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              >
                <Filter className="h-4 w-4" />
                {tMain("Filters")}
              </Button>
            </div>


            {/* Search Bar */}
            <SearchBar
              destination={destination}
              onDestinationChange={setDestination}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              guests={guests}
              onGuestsChange={setGuests}
              onSearch={handleSearch}
              loading={loading}
              tMain={tMain}
            />

            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{tMain("Hotels")}</h1>
              <p className="text-muted-foreground">
                {data.count} {tMain("hotels found")}
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <LoadingSpinner size="lg" text={`${tMain("Loading hotels")}...`} />
            ) : filteredHotels.length > 0 ? (
              <>
                {/* Hotel Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>

                {/* Pagination */}
                <PaginationControls
                  currentPage={currentPage}
                  hasNext={!!data.next}
                  hasPrevious={!!data.previous}
                  totalCount={data.count}
                  onNext={handleNextPage}
                  onPrevious={handlePreviousPage}
                  tMain={tMain}
                />
              </>
            ) : (
              <EmptyState tMain={tMain} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

// Search Bar Component
function SearchBar({
  destination,
  onDestinationChange,
  dateRange,
  onDateRangeChange,
  guests,
  onGuestsChange,
  onSearch,
  loading,
  tMain,
}: any) {
  return (
    <Card className="mb-8 bg-card border">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="space-y-2">
            <Label>{tMain("Destination")}</Label>
            <CityAutocomplete
              value={destination}
              onChange={onDestinationChange}
              placeholder={tMain("Where are you going?")}
              name="destination"
            />
          </div>

          {/* Check-in / Check-out */}
          <div className="space-y-2">
            <Label>{tMain("Check-in / Check-out")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d")
                    )
                  ) : (
                    <span>{tMain("Select dates")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => onDateRangeChange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label>{tMain("Guests")}</Label>
            <Select value={guests} onValueChange={onGuestsChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 {tMain("Guest")}</SelectItem>
                <SelectItem value="2">2 {tMain("Guests")}</SelectItem>
                <SelectItem value="3">3 {tMain("Guests")}</SelectItem>
                <SelectItem value="4">4 {tMain("Guests")}</SelectItem>
                <SelectItem value="5">5+ {tMain("Guests")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button onClick={onSearch} disabled={loading} className="w-full gap-2">
              <Search className="h-4 w-4" />
              {tMain("Search")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


// Pagination Controls Component
function PaginationControls({ currentPage, hasNext, hasPrevious, totalCount, onNext, onPrevious, tMain }: any) {
  const itemsPerPage = 10
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="flex items-center justify-between py-6 border-t">
      <div className="text-sm text-muted-foreground">
        {tMain("Page")} {currentPage} {tMain("of")} {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="gap-2 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          {tMain("Previous")}
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext} className="gap-2 bg-transparent">
          {tMain("Next")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState({ tMain }: any) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">{tMain("No hotels found")}</h2>
        <p className="text-muted-foreground mb-6">{tMain("Try adjusting your search criteria")}</p>
      </CardContent>
    </Card>
  )
}
