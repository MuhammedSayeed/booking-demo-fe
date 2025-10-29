"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RoomMealPlan } from "@/interfaces/hotel";
import { useTranslations } from "next-intl";

export default function MealOptionCard({
  meal_plan,
  today_price,
}: RoomMealPlan) {

  // if (!Array.isArray(meal_plan) || meal_plan.length === 0) {
  //   return (
  //     <div className="text-center text-gray-500 dark:text-gray-400">
  //       لا توجد خطط وجبات متاحة حالياً.
  //     </div>
  //   );
  // }
    const tMain = useTranslations();
  
  return (
    <div className=" min-h-[190px] bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800">
      <div className="p-5 space-y-3">
        {/* Meal Plan Name */}
        <h2 className="text-xl font-semibold  dark:text-primary mb-2">
          {meal_plan?.name || "بدون اسم"}
        </h2>

        {/* Meal Plan Description */}
        {meal_plan.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            {meal_plan.description}
          </p>
        )}

        {/* Meals */}
        {Array.isArray(meal_plan.meals) && meal_plan.meals.length > 0 ? (
          <div className="space-y-1 mb-4">
            {meal_plan.meals.map((item) => (
              <p key={item.id} className="text-sm">
                🍽️ {item.name} -{" "}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.description}
                </span>
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">لا توجد وجبات متوفرة</p>
        )}

        {/* Price */}
        {today_price !== undefined && (
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {tMain("Daily price")}:{" "}
            <span className="font-bold  dark:text-primary">
              SAR {today_price}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
