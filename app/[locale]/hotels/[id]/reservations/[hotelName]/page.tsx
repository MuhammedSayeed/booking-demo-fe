"use client";

import BookingDetails from "@/components/BookingDetails";
import MealPlansList from "@/components/MealPlansList";
import RoomsList from "@/components/RoomsList";
import BASEURL from "@/context/handleAPIDomain";
import { toast } from "@/hooks/use-toast";
import {
  Room,
  RoomCombinationsResponse,
  RoomMealPlan,
  RoomReservationOption,
} from "@/interfaces/hotel";
import axios from "axios";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Reservations() {
  const { locale, id, hotelName } = useParams();
  const tMain = useTranslations();
  // console.log("hotelName==> ", hotelName);

  // const hotel_name = `${hotelName}`.replaceAll(/%20/g, " ");
  const hotel_name = decodeURIComponent(`${hotelName}`);

  // const [rooms, setRooms] = useState<RoomReservationOption[]>([]);
  const [rooms, setRooms] = useState<RoomCombinationsResponse[]>([
    {
      rooms: [
        {
          room_type: {
            id: "b9z24oDJ",
            name: "Single Room",
            description: "",
            max_occupancy: 1,
            created_at: "2025-05-14T16:13:08.599998Z",
            updated_at: "2025-06-27T18:35:42.317622Z",
          },
          room_view: {
            id: "5xE0Govq",
            name: "City View",
            description: "",
            created_at: "2025-05-14T16:14:47.469485Z",
            updated_at: "2025-05-14T16:14:47.469485Z",
          },
          capacity: 1,
          total_price: "40.00",
        },
        {
          room_type: {
            id: "K8zKrEdZ",
            name: "Double Room",
            description: "",
            max_occupancy: 2,
            created_at: "2025-05-14T16:12:45.905594Z",
            updated_at: "2025-06-27T18:36:18.340453Z",
          },
          room_view: {
            id: "5xE0Govq",
            name: "City View",
            description: "",
            created_at: "2025-05-14T16:14:47.469485Z",
            updated_at: "2025-05-14T16:14:47.469485Z",
          },
          capacity: 2,
          total_price: "70.00",
        },
        {
          room_type: {
            id: "K8zKrEdZ",
            name: "Double Room",
            description: "",
            max_occupancy: 2,
            created_at: "2025-05-14T16:12:45.905594Z",
            updated_at: "2025-06-27T18:36:18.340453Z",
          },
          room_view: {
            id: "5xE0Govq",
            name: "City View",
            description: "",
            created_at: "2025-05-14T16:14:47.469485Z",
            updated_at: "2025-05-14T16:14:47.469485Z",
          },
          capacity: 2,
          total_price: "70.00",
        },
      ],
      total_cost: "180.00",
      total_rooms: 3,
    }
  ]);
  const [meals, setMeals] = useState<RoomMealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;



    const loadRooms = async () => {
      const from = new URLSearchParams(window.location.search).get("from");
      // console.log(from);

      const to = new URLSearchParams(window.location.search).get("to");

      const guests = new URLSearchParams(window.location.search).get("guests");
      try {
        const data = await axios
          .get(
            `${BASEURL}/rooms/api/v1/room-reservation-options/${id}?from_date=${from}&to_date=${to}&num_adults=${guests}&lang=${locale}`,{
              headers :{
                "ngrok-skip-browser-warning": "true"
              }
            }
          )
          .then((res) => res.data)
          .catch((error) => {
            // @ts-ignore
            const messageError = error.response.data.error;
            toast({
              title: messageError,
              variant: "destructive",
            });
          });
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    const loadMeals = async () => {
      try {
        const data = await axios
          .get(`${BASEURL}/rooms/api/v1/meals/${id}?lang=${locale}` , {
            headers:{
              "ngrok-skip-browser-warning": "true"
            }
          })
          .then((res) => res.data)
          .catch((error) => {
            // @ts-ignore
            const messageError = error.response.data.error;
            toast({
              title: messageError,
              variant: "destructive",
            });
            // console.log(messageError);
          });
        setMeals(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
    loadMeals();
  }, [id]);
  if (loading) {
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="container py-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{tMain("Loading")}...</h2>
        <p className="text-muted-foreground mb-6">
          {tMain("Please wait while we fetch the Reservations details")}.
        </p>
      </div>
    );
  }
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="container py-8">
      {/* {hotel_name} / Room View / Meal Plan / Enter Data */}
      {/* Breadcrumbs */}
      <div
 
        className="flex items-center text-sm text-muted-foreground mb-4"
      >
        <Link href="/" className="hover:text-primary">
          {tMain("Home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/hotels/${id}`} className="hover:text-primary">
          {hotel_name}
        </Link>
        <span className="mx-2">/</span>
      </div>

      {/* Rooms */}
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">{tMain("Available Rooms")}</h1>
        <RoomsList
          rooms={rooms}
          locale={`${locale}`}
          id={`${id}`}
          hotelName={`${hotelName}`}
          bookTranslation={`${tMain("Select Room")}`}
          view={`${tMain("view")}`}
          MaxOccupancy={`${tMain("Capacity")}`}
          // MaxOccupancy={`${tMain("Max Occupancy")}`}
          description={`${tMain("description")}`}
        />
      </div>
      {/* Meals Plan */}
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">{tMain("Meal Plan")}</h1>
        <MealPlansList mealPlans={meals} />
      </div>

      {/* Enter Data */}
      {rooms && (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">
            {tMain("Booking Details")}
          </h1>
          <BookingDetails />
        </div>
      )}
    </div>
  );
}

export default Reservations;
