"use client"
import SearchFormSlider from "@/components/new-search/search-form-slider"
import HotelCard from "@/components/search/hotel-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BASEURL from "@/context/handleAPIDomain"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Hotel {
  hotel_id: string,
  hotel_name: string,
  hotel_address: string,
  hotel_category: string,
  images: string,
  total_price: number
}

export default function HotelsPage() {
  const tMain = useTranslations()
  const searchParams = useSearchParams()
  const { locale } = useParams();
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previous, setPrevious] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Extract query params
  const city = searchParams.get("city") || ""
  const fromDate = searchParams.get("from_date") || ""
  const toDate = searchParams.get("to_date") || ""
  const numAdults = searchParams.get("num_adults") || ""
  const numChildren = searchParams.get("num_children") || ""

  useEffect(() => {
    if (city && fromDate && toDate && numAdults && numChildren) {
      fetchResults()
    }
  }, [city, fromDate, toDate, numAdults, numChildren, page])

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASEURL}/hotels/api/v1/hotel-reservation/?cit=${city}&from_date=${fromDate}&to_date=${toDate}&num_children=${numChildren}&num_adults=${numAdults}&lang=${locale}&page=${page}`, {
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      });
      if (res) {
        setHotels(res.data.results);
        setPrevious(res.data.previous)
        setNext(res.data.next)
      }

    } catch (error) {
      setError("Failed to fetch hotels. Please try again.");

    } finally {
      setLoading(false);
    }
  }


  const handleGetNext = () => {
    if (next === null) return;
    setPage((prev) => prev + 1);
  }

  const handleGetPrevious = () => {
    if (previous === null) return;
    setPage((prev) => prev - 1);
  }

  const RENDER_HOTELS = hotels.map((h) => {
    return (
      <HotelCard key={h.hotel_id} hotel={h} />
    )
  })


  return (
    <div className="min-h-screen">
      <div className="mt-2">
        <SearchFormSlider hideHeading initialValues={{
          city,
          from_date: fromDate,
          to_date: toDate,
          num_adults: numAdults,
          num_children: numChildren
        }} />
      </div>
      <div className="mt-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg text-gray-600">Loading hotels...</span>
          </div>
        )}

        {error && (
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {!loading && !error && hotels.length > 0 && (
          <div className="max-w-7xl px-8 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {RENDER_HOTELS}
            </div>
          </div>
        )}

        {!loading && !error && hotels.length === 0 && city && (
          <Card className="p-6 text-center">
            <p className="text-gray-600">No hotels found. Please modify your search criteria.</p>
          </Card>
        )}
      </div>
      {
        !loading && hotels.length > 0 && (
          <div className="flex items-center gap-2 max-w-7xl px-8 mx-auto mt-6">
            <Button onClick={handleGetPrevious} disabled={previous === null} variant={"outline"} className="border-black">
              {tMain("prev")}
            </Button>
            <Button onClick={handleGetNext} disabled={next === null} variant={"outline"} className="border-black">
              {tMain("next")}
            </Button>
          </div>
        )
      }

    </div>
  )
}
