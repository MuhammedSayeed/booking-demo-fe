"use client";

import MealOptionCard from "@/components/MealOptionCard";
import { RoomMealPlan } from "@/interfaces/hotel";
import { setReservation } from "@/lib/features/reservation/reservationSlice";
import { setSelectedMealPlan } from "@/lib/features/RoomsMealData/RoomsMealData";
import { clearUser, isAuthenticated } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

interface MealPlansListProps {
  mealPlans: RoomMealPlan[];
}

export default function MealPlansList({ mealPlans }: MealPlansListProps) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const isAuth = useSelector(isAuthenticated);

  const [mealPlanSelected, setMealPlanSelected] = useState<RoomMealPlan>({
    id: '',
  } as RoomMealPlan); // Redux Toolkit

  const reservation = useSelector((state: RootState) => state.reservation);

  const handleReservation = (meal: RoomMealPlan) => {
    dispatch(setSelectedMealPlan(meal));

    dispatch(
      setReservation({
        hotel_id: reservation.hotel_id,
        room_configurations: reservation.room_configurations.map(
          (roomConfig) => {
            return {
              room_type_id: roomConfig.room_type_id,
              room_view_id: roomConfig.room_view_id,
              meal_plan_id: meal.id, // Set the selected meal plan ID
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

  /*
 [
          {
            room_type_id: reservation.room_configurations,
            room_view_id: roomSelected.room_view.id,
            meal_plan_id: -1,
            num_rooms: -1,
          },
        ]

*/
  const tMain = useTranslations();

  // // console.log("🚀 mealPlanSelected =", mealPlanSelected);
  if (!Array.isArray(mealPlans) || mealPlans.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        {tMain("There are not available meal plans currently available")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mealPlans.map((meal) => (
        <button
          onClick={() => {
            setMealPlanSelected(meal);
            handleReservation(meal);
          }}
          key={meal.id}
          className={`${
            meal.id === mealPlanSelected.id
              ? "opacity-100"
              : mealPlanSelected.id === ''
              ? "opacity-100"
              : "opacity-50"
          }  hover:opacity-100 focus:outline-none`}
        >
          <MealOptionCard {...meal} />
        </button>
      ))}
    </div>
  );
}
