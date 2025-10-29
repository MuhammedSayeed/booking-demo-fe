"use client";
import React from "react";
import { useEffect, useState, memo } from "react";

import { useParams } from "next/navigation";
import { MealPlanOption, Room } from "@/interfaces/hotel";
import { useTranslations } from "next-intl";
import BASEURL from "@/context/handleAPIDomain";
import getSingleHotelResults from "@/lib/singleHotel";
import MealPlanCard from "@/components/MealPlanCard";

function GetMeals({
  handleHotelError,
}: {
  handleHotelError: (error: any) => void;
}) {
  const params = useParams();
  const [meal, setmeal] = useState<MealPlanOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMeal, setErorrMeal] = useState("");
  const { locale } = useParams();
  const tMain = useTranslations();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const mealsData = await getSingleHotelResults({
          api: `${BASEURL}/rooms/api/v1/meals/${params.id}?lang=${locale}`,
        });
        if (isMounted) setmeal(mealsData);
      } catch (error) {
        if (isMounted) handleHotelError(error);
      }

      if (isMounted) setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  if (loading) {
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{tMain("Meal Plan")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {meal.map((option) => (
          <MealPlanCard key={option.id} option={option} />
        ))}
        {errorMeal && <span className="text-red-500">{errorMeal}</span>}
      </div>
    </div>
  );
}

export default memo(GetMeals); // Memoizing to prevent unnecessary re-renders
