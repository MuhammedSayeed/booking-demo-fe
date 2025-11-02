"use client";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import axios from "axios";
import BASEURL from "@/context/handleAPIDomain";

function CheckoutPage() {
  const { locale } = useParams();
  const hasInsertedReservation = useRef(false);

  const reservation = useSelector((state: RootState) => state.reservation);
  const userInfo = useAppSelector((state) => state.user);
  const selectedRoom = useAppSelector(
    (state) => state.roomSelection.selectedRoom
  );
  const selectedMealPlan = useAppSelector(
    (state) => state.roomSelection.selectedMealPlan
  );

  const isAuth = !!userInfo.id;
  const router = useRouter();
  const tMain = useTranslations();

  // useEffect(() => {
  //   if (!isAuth) {
  //     toast({
  //       title: tMain("Please login"),
  //       description: tMain("You need to login to checkout"),
  //       variant: "destructive",
  //     });

  //     router.push("/auth/login");
  //   } else if (!hasInsertedReservation.current) {
  //     hasInsertedReservation.current = true;
  //     insertReservation();
  //   }
  // }, [isAuth, router, tMain]);

  const insertReservation = async () => {
    const access_token = JSON.parse(localStorage.getItem("userData") || "null")
      ?.tokens.access_token;
    // console.log(JSON.stringify(reservation));

    await axios
      .post(`${BASEURL}/reservations/api/v1/?lang=${locale}`, reservation, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "ngrok-skip-browser-warning": "true"
        },
      })
      .then((res) => {
        // console.log("Reservation response:", res.data);
        console.log('here....');

        router.push("/auth/profile");
        // location.reload();
      })
      .catch((err) => {
        console.error("Insert error:", err);
        const firstKey = Object.keys(err.response?.data || {})[0];
        if (
          err.response?.data?.[firstKey].includes("[Errno 111]") ||
          err.response?.data?.[firstKey].includes("'datetime.date'")
        ) {
          console.log(err.response?.data?.[firstKey]);
          // iserted
          router.push("/auth/profile");
          // location.reload();

          return;
        }
        router.back();

        toast({
          title:
            err.response?.data?.[firstKey].split("string=")[1].split("'")[1] ||
            "خطأ في عملية الحجز، أعد المحاولة مرة أخرى",
          variant: "destructive",
        });

        hasInsertedReservation.current = true;
      });
  };

  if (!isAuth) return null;

  return (
    <div>
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="container py-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{tMain("Loading")}...</h2>

      </div>
    </div>
  );
}

export default CheckoutPage;
