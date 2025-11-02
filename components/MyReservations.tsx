"use client";
import BASEURL from "@/context/handleAPIDomain";
import { toast } from "@/hooks/use-toast";
import { Booking } from "@/interfaces/hotel";
import { resrevation } from "@/public/fake_data/reservation";
import axios from "axios";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export interface RefundInfo {
  message: string;
  refund_type: "Full" | "Partial" | string;
  refund_percentage: number;
  allowed_refund_amount: number;
}

function handleDate(inputDate: string): string {
  const [day, month, yearAndTime] = inputDate.split("/");
  const [year, time] = yearAndTime.split(" ");
  const isoDate = `${year}-${month}-${day}T${time}:00`;
  return isoDate;
}

function MyReservations() {
  const { locale } = useParams();
  const tMain = useTranslations();
  const router = useRouter();
  const [data, setData] = useState<{
    count: number;
    next: number | null;
    previous: number | null;
    results: Booking[];
  }>();

  const [loading, setloading] = useState(true);
  const [url, setUrl] = useState<string>(
    `${BASEURL}/reservations/api/v1/reservations/?lang=${locale}` 
  );

  const fetchReservations = async (url: string) => {
    setloading(true);
    const access_token = JSON.parse(localStorage.getItem("userData") || "null")
      ?.tokens.access_token;
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        setData({
          count: res.data.length,
          next: null,
          previous: null,
          results: res.data,
        });
      })
      .catch((error) => {
        // @ts-ignore
        if (`${error.response.data.code}` === "token_not_valid") {
          localStorage.removeItem("userData");
          router.push("/auth/login");
          toast({
            title: tMain("Session expired"),
            description: tMain("Please login again"),
            variant: "destructive",
          });
        }

        console.error("Error fetching reservations:", error);
      });

    setloading(false);
  };




  const [rerenderComponent, setrerenderComponent] = useState(false);
  useEffect(() => {
    fetchReservations(url);
  }, [url, rerenderComponent]);

  const typeReservationViews = ["pending", "confirmed", "cancelled"];
  const [typeView, setTypeView] = useState([
    "pending",
    "confirmed",
    "cancelled",
  ]);


  console.log("data" , data);
  

  if (!data || loading)
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="container py-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{tMain("Loading")}...</h2>
        <p className="text-muted-foreground mb-6">
          {tMain("Please wait while we fetch the reservation details")}.
        </p>
      </div>
    );
  return (
    <div>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">
          {tMain("Reservations List")}({data.results.length})
        </h1>
        <div>
          {typeReservationViews.map((review) => (
            <button
              key={`${review}+${Math.random()}`}
              onClick={() => {
                if (typeView.includes(review)) {
                  setTypeView(typeView.filter((item) => item !== review));
                } else {
                  setTypeView([...typeView, review]);
                }
              }}
              className={`${
                typeView.includes(review) ? "bg-[#957428]" : ""
              } hover:bg-[#9b8548] text-black dark:text-white mr-2 mb-2 transition p-2 rounded-lg`}
            >
              {review}
            </button>
          ))}
        </div>

        {/* will edit here */}

      
        <div style={{ marginTop: "20px" }}>
          {data.previous && (
            <button
              onClick={() => setUrl(`${data.previous}&lang=${locale}`)}
              className="mr-2 bg-[#957428] hover:bg-[#9b8548] text-white p-2 rounded transition"
            >
              {tMain("Previous")}
            </button>
          )}
          {data.next && (
            <button
              className="mr-2 bg-[#957428] hover:bg-[#9b8548] text-white p-2 rounded transition"
              onClick={() => setUrl(`${data.next}&lang=${locale}`)}
            >
              {tMain("Next")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyReservations;
