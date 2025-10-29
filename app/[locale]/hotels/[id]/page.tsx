"use client";

import { useEffect, useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Star,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import getSingleHotelResults from "@/lib/singleHotel";
import { useParams, useRouter } from "next/navigation";
import { Hotel } from "@/interfaces/hotel";
import axios from "axios";
import { convertTo12Hour } from "@/lib/utils";

import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { useTranslations } from "next-intl";
import HandelReviewCard from "@/components/HandelReviewCard";
import BASEURL from "@/context/handleAPIDomain";
import GetRooms from "@/components/GetRooms";
import GetMeals from "@/components/GetMeals";
import { useAppSelector } from "@/lib/hooks";
import MapDisplay from "@/components/MapDisplay";
// import MapPage from "@/components/MapPage";

function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [hotel, setdata] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorRooms, setErorrRooms] = useState("");
  const [errorHotels, setErorrHotels] = useState("");
  const { locale } = useParams();
  const tMain = useTranslations();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const hotelData = await getSingleHotelResults({
          api: `${BASEURL}/hotels/api/v1/${params.id}?lang=${locale}`,
        });
        if (isMounted) setdata(hotelData);
      } catch (error) {
        if (isMounted) handleHotelError(error);
      }

      const favorites = localStorage.getItem("favoriteHotels");
      if (
        isMounted &&
        favorites &&
        favorites.includes(params.id?.toString() || "")
      ) {
        setIsFavorite(true);
      }

      if (isMounted) setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [params.id, locale]);
  const dateHand = useAppSelector((state) => state.searchDateSlice);

  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: dateHand.from || undefined,
    to: dateHand.to || undefined,
  });

  const [selectedGuests, setSelectedGuests] = useState<string>("1");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (hotel?.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (hotel?.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "This hotel has been removed from your favorites"
        : "This hotel has been added to your favorites",
    });
    const favoriteHotels = JSON.parse(
      localStorage.getItem("favoriteHotels") || "[]"
    );

    if (isFavorite) {
      localStorage.setItem(
        "favoriteHotels",
        JSON.stringify(favoriteHotels.filter((id: string) => id !== params.id))
      );
    } else {
      localStorage.setItem(
        "favoriteHotels",
        JSON.stringify([...favoriteHotels, params.id])
      );
    }
  };

  const handleShare = () => {
    toast({
      title: "Link copied",
      description: "Hotel link has been copied to clipboard",
    });
    navigator.clipboard.writeText(window.location.href);
  };

  const handleBookNow = () => {
    if (!date.from || !date.to) {
      toast({
        title: "Please select dates",
        description:
          "You need to select check-in and check-out dates to proceed",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Proceeding to reservation",
      description: "You will be redirected to complete your booking",
    });
  };

  const handleHotelError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      setErorrHotels(`${error.response.data.detail || ""}`);
    } else {
      setErorrHotels("An unknown error occurred");
    }
  };

  const handleRoomError = (error: unknown) => {
    if (error instanceof Error) {
      setErorrRooms(error.message);
    } else {
      setErorrRooms("An unknown error occurred");
    }
  };

  if (errorHotels && !hotel) {
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="container py-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{tMain("Hotel Not Found")}</h2>
        <p className="text-muted-foreground mb-6">
          {tMain(
            "The hotel you're looking for doesn't exist or has been removed"
          )}
          .
        </p>
        <Button asChild className="bg-primary  text-white">
          <Link href="/hotels">{tMain("Browse All Hotels")}</Link>
        </Button>
      </div>
    );
  }

  if (loading || !hotel) {
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="container py-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{tMain("Loading")}...</h2>
        <p className="text-muted-foreground mb-6">
          {tMain("Please wait while we fetch the hotel details")}.
        </p>
      </div>
    );
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="container py-8">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary">
          {tMain("Home")}
        </Link>
        <span className="mx-2">/</span>
        <button onClick={() => router.back()} className="hover:text-primary">
          {tMain("Hotels")}
        </button>
        <span className="mx-2">/</span>
        <span className="text-foreground">{hotel.name}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            </div>
            <div className="flex items-center ml-4">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              <span className="font-medium">{hotel.category}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleFavorite}>
            <Heart
              className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
            />
            {isFavorite ? tMain("Saved") : tMain("Save")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            {tMain("Share")}
          </Button>
        </div>
      </div>

      <div className="relative mb-8 rounded-xl overflow-hidden">
        <div className="relative h-[300px] md:h-[500px] w-full">
          <Image
            src={hotel.images[currentImageIndex]?.image || "/hero/hero-1.jpg"}
            alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
          />
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
          onClick={handlePrevImage}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous image</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
          onClick={handleNextImage}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next image</span>
        </Button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          {hotel.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-primary" : "bg-white/50"
                }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <span className="sr-only">View image {index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs dir={locale === "ar" ? "rtl" : "ltr"} defaultValue="overview">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">{tMain("Overview")}</TabsTrigger>
              <TabsTrigger value="rooms">{tMain("Rooms")}</TabsTrigger>
              <TabsTrigger value="amenities">{tMain("Amenities")}</TabsTrigger>
              <TabsTrigger value="meal">{tMain("Meal")}</TabsTrigger>
              <TabsTrigger value="reviews">{tMain("Reviews")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {tMain("About this hotel")}
                  </h2>
                  <p className="text-muted-foreground">{hotel.description}</p>
                </div>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {tMain("Top amenities")}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {hotel.amenities.slice(0, 8).map((amenity) => (
                      <div
                        key={amenity.amenity.name}
                        className="flex items-center gap-2"
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: amenity.amenity.icon,
                          }}
                        />
                        <span>{amenity.amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rooms" className="mt-6">
              <GetRooms handleRoomError={handleRoomError} />
            </TabsContent>

            <TabsContent value="amenities" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">{tMain("Amenities")}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity.amenity.name}
                      className="flex items-center gap-2"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: amenity.amenity.icon,
                        }}
                      />
                      <span>{amenity.amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="meal" className="mt-6">
              <GetMeals handleHotelError={handleHotelError} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">{tMain("Reviews")}</h2>
                <HandelReviewCard hotel_id={`${params.id}`} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">{tMain("City")}</h2>
              <div className="flex justify-between items-end">
                <div className="grid gap-3 mt-2">
                  <span className="text-xl font-bold">{hotel.city.name}</span>
                  <span className="text-xl font-bold">
                    {hotel.country.name} ({hotel.country.code})
                  </span>
                  <span className="text-sm font-bold">
                    {hotel.city.state_province}
                  </span>
                  <Link
                    href={`mailto:${hotel.email}`}
                    className="text-sm font-bold !underline"
                  >
                    {hotel.email}
                  </Link>
                  <Link
                    href={hotel.website}
                    className="text-sm font-bold !underline"
                  >
                    {hotel.website}
                  </Link>
                  <span className="text-sm font-bold">{hotel.postal_code}</span>
                </div>
                {window.localStorage.getItem("userData") ? (
                  <Button
                    onClick={() => {
                      if (
                        date.from !== undefined &&
                        date.to !== undefined &&
                        selectedGuests.length > 0
                      ) {
                        router.push(
                          `/${locale}/hotels/${hotel.id}/reservations/${hotel.name
                          }?from=${format(date.from, "dd/MM/yyyy")}&to=${format(
                            date.to,
                            "dd/MM/yyyy"
                          )}&guests=${selectedGuests}`
                        );
                      } else {
                        toast({
                          title: tMain("Search error"), //
                          description: tMain(
                            "The reservation period must be specified at least"
                          ), //
                          variant: "destructive",
                        });
                      }
                    }}
                    className="bg-primary text-white"
                  >
                    {/* <Link
                      href={`/${locale}/hotels/${hotel.id}/reservations/${hotel.name}`}
                    >
                    </Link> */}
                    {tMain("Book Now")}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      router.push(`/${locale}/auth/login`);
                    }}
                    className="bg-primary text-white"
                  >
                    {/* <Link href={`/${locale}/auth/login`}> */}
                    {tMain("Book Now")}
                    {/* </Link> */}
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label>{tMain("Check-in / Check-out")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal dark:text-white"
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
                      className="co"
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
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
                <Select
                  onValueChange={(e) => {
                    setSelectedGuests(e);
                  }}
                  name="guests"
                >
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
            </div>
            <Separator />
            <div>
              <h2 className="text-2xl font-semibold">{tMain("Time")}</h2>
              <div className="grid gap-3 mt-2">
                <span className="text-xl font-bold">
                  check in {convertTo12Hour(hotel.check_in_time)}
                </span>
                <span className="text-xl font-bold">
                  check out {convertTo12Hour(hotel.check_out_time)}
                </span>
              </div>
            </div>
            <Separator />
            <div>
              <h2 className="text-xl font-semibold">{tMain("Address")}</h2>
              <div className="flex items-center mt-3 gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{hotel.address}</span>
              </div>
            </div>
            <Separator />
            <div>
              <h2 className="text-xl font-semibold">{tMain("Contact Us")}</h2>
              <div className="grid grid-cols-1 gap-4">
                <Link
                  href={`mailto:${hotel.email}`}
                  className="text-sm font-bold !underline"
                >
                  {hotel.email}
                </Link>
                <Link
                  href={`tel:${hotel.phone}`}
                  className="text-sm font-bold !underline"
                >
                  {hotel.phone}
                </Link>
                <Link
                  href={hotel.website}
                  className="text-sm font-bold !underline"
                >
                  {hotel.website}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <MapDisplay
          latitude={Number(hotel.city.latitude) || 0}
          longitude={Number(hotel.city.longitude) || 0}
        />
      </div>
    </div>
  );
}

export default memo(HotelDetailPage);
