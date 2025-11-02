"use client";

import MealPlansList from "@/components/MealPlansList";
import RoomsList from "@/components/RoomsList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BASEURL from "@/context/handleAPIDomain";
import { toast } from "@/hooks/use-toast";
import {
  RoomCombinationsResponse,
  RoomMealPlan,
} from "@/interfaces/hotel";
import { useBookingStore } from "@/store/use-reverstation-store";
import axios from "axios";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface RoomType {
  id: string;
  name: string;
  description: string;
  max_occupancy: number;
  created_at: string; // ISO date string
  updated_at: string;
}

export interface RoomView {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IRoomConfiguration {
  capacity: number;
  room_type: RoomType;
  room_view: RoomView;
  total_price: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  created_at: string; // ISO timestamp
  updated_at: string;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  external_system_id: string;
  meals: Meal[];
  created_at: string;
  updated_at: string;
}

export interface RoomMealConfiguration {
  id: string;
  created_at: string;
  meal_plan: MealPlan;
  today_price: number;
}

function Reservations() {
  const { locale } = useParams();
  const tMain = useTranslations();
  const router = useRouter();
  const [rooms, setRooms] = useState<IRoomConfiguration[]>([]);
  const [meals, setMeals] = useState<RoomMealConfiguration[]>([]);
  const [loading, setLoading] = useState(false);

  const access_token = JSON.parse(
    localStorage.getItem("userData") || "null"
  )?.tokens.access_token;


  const { hotel_id: id, from_date: from, to_date: to, adults: guests, children, setRoomConfigurations, room_configurations, resetBooking } = useBookingStore();

  useEffect(() => {
    if (!id) return;
    const loadRooms = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASEURL}/rooms/api/v1/room-reservation-options/${id}?from_date=${from}&to_date=${to}&num_adults=${guests}&num_children=${children}&lang=${locale}`, {
          headers: {
            "ngrok-skip-browser-warning": "true"
          }
        })
        if (res.data) {
          setRooms(res.data[0].rooms)
        }
      } catch (error: any) {

        const messageError = error.response.data.error;
        toast({
          title: messageError,
          variant: "destructive",
        });

      } finally {
        setLoading(false)
      }
    }


    const loadMeals = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASEURL}/rooms/api/v1/meals/${id}?lang=${locale}`, {
          headers: {
            "ngrok-skip-browser-warning": "true"
          }
        })
        if (res.data) {
          setMeals(res.data)

        }
      } catch (error: any) {

        const messageError = error.response.data.error;
        toast({
          title: messageError,
          variant: "destructive",
        });

      } finally {
        setLoading(false)
      }
    }

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
  const handleSelectRoom = ({ room_type_id, room_view_id }: { room_type_id: string, room_view_id: string }) => {
    setRoomConfigurations([
      {
        meal_plan_id: "",
        room_type_id,
        room_view_id,
        num_rooms: 1,
      }
    ])
  }

  const handleSelectMeal = ({ meal_plan_id }: { meal_plan_id: string }) => {
    setRoomConfigurations(room_configurations.map((rc) => ({
      ...rc,
      meal_plan_id,
    })))
  }


  const handleReservation = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASEURL}/reservations/api/v1/`, {
        hotel_id: id,
        room_configurations,
        from_date: from,
        to_date: to,
        adults: guests,
        children: children,
      }, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${access_token}`
        }
      })
      if (res.data) {
        resetBooking();
        router.push(`/reservation/${res.data.id}`)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="container py-8">
      {/* Rooms */}
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">{tMain("Available Rooms")}</h1>
        <div className="flex gap-8">
          {
            rooms.map((room) => {
              const isActiveRoom = room_configurations.some((rc) => rc.room_type_id === room.room_type.id && rc.room_view_id === room.room_view.id);
              console.log(isActiveRoom);

              return (
                <div key={room.room_type.id} className="w-fit hover:shadow-sm cursor-pointer">
                  <Card onClick={() => handleSelectRoom({ room_type_id: room.room_type.id, room_view_id: room.room_view.id })} className={clsx("p-4", isActiveRoom ? "bg-neutral-100" : "")}>
                    <div className="flex flex-wrap justify-between gap-12">
                      <div>
                        <h2 className="text-lg font-bold">{room.room_type.name}</h2>
                        <p className="text-sm text-muted-foreground">{room.room_view.name}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">${room.total_price}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })
          }
        </div>

      </div>
      {/* Meals Plan */}
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">{tMain("Meal Plan")}</h1>
        <div className="flex flex-wrap gap-8">
          {
            meals.map((meal) => {
              const isActiveMeal = room_configurations.some((rc) => rc.meal_plan_id === meal.id);
              return (
                meal.meal_plan.meals.length > 0 && (
                  <div key={meal.id} className="w-fit hover:shadow-sm cursor-pointer min-h-32">
                    <Card onClick={() => handleSelectMeal({ meal_plan_id: meal.id })} className={clsx("p-4 h-full", isActiveMeal ? "bg-neutral-100" : "")}>
                      <div className="flex flex-wrap justify-between gap-12">
                        <div>
                          <h2 className="text-lg font-bold">{meal.meal_plan.name}</h2>
                          {
                            <div className="space-y-1 mt-4">
                              {
                                meal.meal_plan.meals.map((meal) => {
                                  return (
                                    <div key={meal.id} className="text-sm text-muted-foreground">
                                      {meal.name}
                                    </div>
                                  )
                                })
                              }
                            </div>
                          }
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600">${meal.today_price}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              )
            })
          }
        </div>
      </div>

      <div className="w-fit mx-auto">
        <Button disabled={loading} onClick={handleReservation} size={"lg"}>
          {loading ? "Loading..." : "Book Now"}
        </Button>
      </div>
    </div>
  );
}

export default Reservations;
