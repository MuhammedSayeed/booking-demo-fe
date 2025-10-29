"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Star,
  Search,
  CalendarIcon,
  Wifi,
  Coffee,
  Tv,
  Utensils,
  Car,
  Snowflake,
  Dumbbell,
  Bath,
  Filter,
  X,
} from "lucide-react";
import { format } from "date-fns";
import getSearchResults from "@/lib/search";
import HoteCard from "@/components/hotel-card";
import { loading } from "@/public/svgs/loading";
import PaginationHotal from "@/components/pagination-hotal";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Hotel } from "@/interfaces/hotel";
import BASEURL from "@/context/handleAPIDomain";

export default function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{
    destination: string;
    checkin: string;
    checkout: string;
    guests: string;
  }>;
}) {
  const tMain = useTranslations();
  const { locale } = useParams();
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [querys, setquerys] = useState<{
    destination: string;
    checkin: string;
    checkout: string;
    guests: string;
  }>({
    destination: "",
    checkin: "",
    checkout: "",
    guests: "",
  });

  const [data, setdata] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const [statusForm, setStatusForm] = useState({
    loading: true,
    error: false,
  });
  useEffect(() => {
    const fetchData = async () => {
      const querys = await searchParams;

      const hotalsData = await getSearchResults({
        api: `${BASEURL}/hotels/api/v1`,
        search: querys.destination !== undefined ? querys.destination : "",
        page: querys.destination !== undefined ? 1 : "",
        lang: Array.isArray(locale) ? locale[0] : locale || "",
      });
      setdata(hotalsData);
      setquerys(querys);
      setStatusForm((priv) => ({
        ...priv,
        loading: false,
      }));
    };
    fetchData();
  }, []);

  const [priceRange, setPriceRange] = useState([50, 500]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

const [hotelSelected, setHotelSelected] = useState<Hotel>()

  return (
    <div className="container py-8">
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* Filters Sidebar - Desktop */}
        <form action="/hotels" method="GET">
          <div className="w-full md:w-64 lg:w-72 hidden md:block">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">{tMain("Search")}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">{tMain("Destination")}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="destination"
                        id="destination"
                        defaultValue={querys.destination}
                        placeholder={tMain("Where are you going?")}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{tMain("Check-in / Check-out")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "MMM d")} -{" "}
                                {format(date.to, "MMM d, yyyy")}
                              </>
                            ) : (
                              format(date.from, "MMM d, yyyy")
                            )
                          ) : (
                            <span>{tMain("Select dates")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <div className="hidden">
                        <input
                          type="text"
                          defaultValue={`${date.from}`}
                          name="checkin"
                        />
                        <input
                          type="text"
                          defaultValue={`${date.to}`}
                          name="checkout"
                        />
                      </div>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={{
                            from: new Date(querys.checkin),
                            to: new Date(querys.checkout),
                          }}
                          onSelect={(range) =>
                            setDate({ from: range?.from, to: range?.to })
                          }
                          numberOfMonths={2}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">{tMain("Guests")}</Label>
                    <Select name="guests">
                      <SelectTrigger id="guests">
                        <SelectValue placeholder={tMain("Number of guests")} />
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

                  <Button className="w-full bg-primary text-white">
                    <Search className="mr-2 h-4 w-4" />
                    {tMain("Search")}
                  </Button>
                </div>
              </div>

              <Separator />
              
            </div>
          </div>
        </form>

        {/* Mobile Filter Button */}
        <Button
          variant="outline"
          className="md:hidden flex items-center gap-2 mb-4 "
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        {/* Mobile Filters Sidebar */}
        {isFilterOpen && (
          <form action="/hotels" method="GET">
            <div className="fixed inset-0 z-50 bg-background p-6 md:hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                <div>
                  <h3 className="font-semibold mb-4">Search</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile-destination">Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="mobile-destination"
                          placeholder="Where are you going?"
                          className="pl-9"
                          name="destination"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Check-in / Check-out</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "MMM d")} -{" "}
                                  {format(date.to, "MMM d, yyyy")}
                                </>
                              ) : (
                                format(date.from, "MMM d, yyyy")
                              )
                            ) : (
                              <span>Select dates</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <div className="hidden">
                          <input
                            type="text"
                            defaultValue={`${date.from}`}
                            name="checkin"
                          />
                          <input
                            type="text"
                            defaultValue={`${date.to}`}
                            name="checkout"
                          />
                        </div>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(range) =>
                              setDate({ from: range?.from, to: range?.to })
                            }
                            numberOfMonths={1}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile-guests">Guests</Label>
                      <Select>
                        <SelectTrigger id="mobile-guests">
                          <SelectValue placeholder="Number of guests" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 Guest</SelectItem>
                          <SelectItem value="1">1 Guest</SelectItem>
                          <SelectItem value="2">2 Guests</SelectItem>
                          <SelectItem value="3">3 Guests</SelectItem>
                          <SelectItem value="4">4 Guests</SelectItem>
                          <SelectItem value="5">5+ Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                 <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    defaultValue={[50, 500]}
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex items-center justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Amenities</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mobile-wifi" />
                    <Label htmlFor="mobile-wifi" className="text-sm">
                      WiFi
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mobile-breakfast" />
                    <Label htmlFor="mobile-breakfast" className="text-sm">
                      Breakfast
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mobile-parking" />
                    <Label htmlFor="mobile-parking" className="text-sm">
                      Parking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mobile-ac" />
                    <Label htmlFor="mobile-ac" className="text-sm">
                      Air Conditioning
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mobile-gym" />
                    <Label htmlFor="mobile-gym" className="text-sm">
                      Gym
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mobile-spa" />
                    <Label htmlFor="mobile-spa" className="text-sm">
                      Spa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mobile-restaurant" />
                    <Label htmlFor="mobile-restaurant" className="text-sm">
                      Restaurant
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Star Rating</h3>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      {rating} <Star className="h-3 w-3 fill-current" />
                    </Button>
                  ))}
                </div>
              </div> 
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Hotel Listings */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{tMain("Rooms")}</h1>
            {/* <Select defaultValue="recommended">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          {/* Hotel Cards */}
          {!statusForm.loading ? (
            data.results.length > 0 ? (
              <>
                <HoteCard hotels={data.results} />
              </>
            ) : (
              <>
                <div className="container py-12 text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    {tMain("Hotel Not Found")}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {tMain(
                      "The hotel you're looking for doesn't exist or has been removed"
                    )}
                    .
                  </p>
                  <form action="/hotels" method="GET">
                    <Button className="bg-primary text-white">
                      {tMain("Browse All Hotels")}
                    </Button>
                  </form>
                </div>
              </>
            )
          ) : (
            <div className="w-40 mx-auto mt-20">{loading}</div>
          )}
          {/* Pagination */}
          <PaginationHotal
            data={data}
            query={querys}
            loading={statusForm.loading}
          />
        </div>
      </div>
    </div>
  );
}
