"use client";
import { MealPlanOption } from "@/interfaces/hotel";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
// import { FaUtensils } from "react-icons/fa"; // npm install react-icons

export default function MealPlanCard({ option }: { option: MealPlanOption }) {
  const tMain = useTranslations();
  const { locale , id} = useParams();
  return (
    <div className="border rounded-2xl shadow-md p-5 bg-white dark:bg-gray-800 dark:hover:bg-[#0369a062] hover:bg-[#0369a024] flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-1 dark:text-white text-[#020817]">
          {option.meal_plan.name}
        </h2>

        {option.meal_plan.description && (
          <p className="text-sm text-gray-600 mb-2">
            {option.meal_plan.description}
          </p>
        )}

        <ul className="list-none space-y-1 mb-4">
          {option.meal_plan.meals.map((meal) => (
            <li
              key={meal.id}
              className="flex items-center dark:text-white text-[#020817] text-sm"
            >
              {/* <FaUtensils className="mr-2 text-[#0369a0]" /> */}
              {meal.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold  dark:text-[#afdef7]">
          SAR {option.today_price.toFixed(2)}
        </span>
        
      </div>
    </div>
  );
}
