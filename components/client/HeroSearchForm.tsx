"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSearchDateSlice } from "@/lib/features/SearchDate/SearchDate";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

export default function HeroSearchForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const date = useAppSelector((state) => state.searchDateSlice);
  const tMain = useTranslations();
  const param = useParams();

  const [destination, setDestination] = useState("");


  useEffect(() => {


    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const dest = urlParams.get("destination");
      if (dest) setDestination(dest);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center text-white p-4">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
        {tMain("HomePage.hero.title1")}
      </h1>
      <p className="text-xl md:text-xl max-w-2xl mb-8">
        {tMain("HomePage.hero.title2")}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const destination = formData.get("destination") as string;
          const checkin = formData.get("checkin") as string;
          const checkout = formData.get("checkout") as string;
          const guests = formData.get("guests") as string;

          dispatch(
            setSearchDateSlice({
              from: date.from,
              to: date.to,
              guests: guests,
            })
          );

          if (!!date.from && !date.to) {
            toast({
              title: tMain("Search error"),
              description: tMain("Exit date must be specified") + ".",
              variant: "destructive",
            });
            return;
          }

          if (!destination && !checkin) {
            router.push("/hotels");
            return;
          }

          router.push(
            "/hotels?" +
              new URLSearchParams({
                destination,
                checkin,
                checkout,
                guests,
              }).toString()
          );
        }}
      >
        <Card className="w-full max-w-4xl bg-white/95 text-black">
          <CardContent className="p-4 md:p-6">

            <div
              dir={param.locale === "ar" ? "rtl" : "ltr"}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {/* Destination Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {tMain("Destination")}
                </label>
                <CityAutocomplete
                  value={destination}
                  onChange={setDestination}
                  placeholder={tMain("Where are you going?")}
                  name="destination"
                  className="dark:text-white"
                />
              </div>

              {/* Check-in / Check-out */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {tMain("Check-in / Check-out")}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full trigger-button justify-start text-left font-normal dark:text-white"
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
                      defaultValue={`${date.from || ""}`}
                      name="checkin"
                    />
                    <input
                      type="text"
                      defaultValue={`${date.to || ""}`}
                      name="checkout"
                    />
                  </div>
                  <PopoverContent
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    avoidCollisions={true}
                    className="w-auto p-0 !left-auto !top-auto data-[state=open]:animate-none"
                  >
                    <Calendar
                      initialFocus
                      className="co"
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={(range) =>
                        dispatch(
                          setSearchDateSlice({
                            from: range?.from,
                            to: range?.to,
                          })
                        )
                      }
                      numberOfMonths={2}
                      disabled={(d) => d < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="space-y-2 relative">
                <label className="text-sm font-medium">{tMain("Guests")}</label>
                <div className="relative inline-block w-full max-w-xs">
                  <select
                    name="guests"
                    defaultValue="1"
                    className="w-full px-4 py-2 pr-10 text-sm bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                  >
                    <option value="1">1 {tMain("Guest")}</option>
                    <option value="2">2 {tMain("Guests")}</option>
                    <option value="3">3 {tMain("Guests")}</option>
                    <option value="4">4 {tMain("Guests")}</option>
                    <option value="5">5+ {tMain("Guests")}</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button className="w-full gap-2 bg-primary  text-white">
                  <Search className="h-4 w-4" />
                  {tMain("Search")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
