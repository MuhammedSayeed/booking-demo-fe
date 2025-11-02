"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  Search,
  MapPin,
  MessageSquare,
  BedDouble,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { setReservation } from "@/lib/features/reservation/reservationSlice";
import { toast } from "@/hooks/use-toast";

function BookingDetails() {
  const tMain = useTranslations();
  const param = useParams();
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const parseDate = (dateString: string) => {
    // نفترض التنسيق هو DD/MM/YYYY
    const [day, month, year] = dateString.split("/").map(Number);
    // ملاحظة: الشهر في JavaScript يبدأ من 0 (يناير = 0)
    return new Date(year, month - 1, day);
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const fromDate = urlParams.get("from");
      const toDate = urlParams.get("to");

      if (fromDate) {
        setDate((prev) => ({
          ...prev,
          from: parseDate(fromDate),
        }));
      }
      if (toDate) {
        setDate((prev) => ({
          ...prev,
          to: parseDate(toDate),
        }));
      }
    }
  }, []);

  const router = useRouter();

  const reservation = useSelector((state: RootState) => state.reservation);
  //   // console.log(reservation);
  const dispatch = useAppDispatch();

  const handleReservation = () => {
    dispatch(
      setReservation({
        hotel_id: reservation.hotel_id,
        room_configurations: reservation.room_configurations.map(
          (roomConfig) => {
            return {
              room_type_id: roomConfig.room_type_id,
              room_view_id: roomConfig.room_view_id,
              meal_plan_id: roomConfig.meal_plan_id, // Set the selected meal plan ID
              num_rooms: roomConfig.num_rooms,
            };
          }
        ),
        from_date: reservation.from_date,
        to_date: reservation.to_date,
        adults: reservation.adults,
        children: reservation.children,
        special_requests: reservation.special_requests,
      })
    );
  };

  const selectedRoom = useSelector(
    (state: RootState) => state.roomSelection.selectedRoom
  );
  const selectedMeal = useSelector(
    (state: RootState) => state.roomSelection.selectedMealPlan
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const specialRequests = formData.get("special_requests") as string;
    const guests = formData.get("guests") as string;
    const num_childrens = formData.get("children") as string;
    const num_rooms = formData.get("num_rooms") as string;
   

    // validations
    if (!selectedRoom) {
      toast({
        title: tMain("select a room"),
        description: tMain("Please select a room before booking"),
        variant: "destructive",
      });
      return;
    }
    if (date.from === undefined || date.to === undefined) {
      toast({
        title: tMain("select a date range"),
        description: tMain("Please select a date range before booking"),
        variant: "destructive",
      });
      return;
    }

    dispatch(
      setReservation({
        ...reservation,
        hotel_id: `${param.id}`,
        special_requests: specialRequests,
        children: +num_childrens,
        adults: +guests,
        from_date: date.from ? format(date.from, "yyyy-MM-dd") : "",
        to_date: date.to ? format(date.to, "yyyy-MM-dd") : "",
      })
    );
    router.push("/checkout");
  };
  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-4xl bg-white/95 dark:bg-[#111827] dark:text-white text-black mx-auto">
          <CardContent className="p-4 md:p-6">
            <div
              dir={param.locale === "ar" ? "rtl" : "ltr"}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {tMain("Special Requests")}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    name="special_requests"
                    type="text"
                    placeholder={tMain("Where are you going?")}
                    className="pl-9 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {tMain("Check-in / Check-out")}
                </label>
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
                <label className="text-sm font-medium">{tMain("Guests")}</label>
                <Select
                  name="guests"
                  defaultValue={`${new URLSearchParams(
                    window.location.search
                  ).get("guests")}`}
                >
                  <SelectTrigger className="dark:text-white">
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
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {tMain("Childrens")}
                </label>
                <Select name="children" defaultValue="0">
                  <SelectTrigger className="dark:text-white">
                    <SelectValue placeholder={tMain("Number of Childrens")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 {tMain("children")}</SelectItem>
                    <SelectItem value="1">1 {tMain("children")}</SelectItem>
                    <SelectItem value="2">2 {tMain("Childrens")}</SelectItem>
                    <SelectItem value="3">3 {tMain("Childrens")}</SelectItem>
                    <SelectItem value="4">4 {tMain("Childrens")}</SelectItem>
                    <SelectItem value="5">5+ {tMain("Childrens")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full gap-2 bg-primary  text-white">
                  <Search className="h-4 w-4" />
                  {tMain("Book Now")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default BookingDetails;
