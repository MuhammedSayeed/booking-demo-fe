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
const activeSelected =
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm";

const inactiveSelected =
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm";

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

  const [allReservations, setAllReservations] = useState(resrevation); // fake data=> just test
  const [loading, setloading] = useState(true);
  const [url, setUrl] = useState<string>(
    `${BASEURL}/reservations/api/v1/reservations/?lang=${locale}` // Adjust the URL as needed
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
        // console.log(res.data.results.length);
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

  const handleCancelReservation = async (
    reservationId: number,
    reservation: Booking
  ) => {
    setloading(true);
    const access_token = JSON.parse(localStorage.getItem("userData") || "null")
      ?.tokens.access_token;

    const cloneReservation: Booking = {
      ...reservation,
      created_at: handleDate(reservation.created_at),
      updated_at: handleDate(reservation.updated_at),
    };
    // console.log(cloneReservation);
    // console.log(JSON.stringify(cloneReservation));

    await axios
      .put(
        `${BASEURL}/reservations/api/v1/${reservationId}/cancel/?lang=${locale}`,
        cloneReservation,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(async (res) => {
        // console.log(res);
        toast({
          title: tMain("Reservation canceled successfully"),
          description: tMain("Your reservation has been canceled"),
        });
        // await fetchReservations(url);
        setrerenderComponent(!rerenderComponent);
      })
      .catch((error) => {
        console.error("Error canceling reservation:", error);
        // console.log(error);
        setloading(false);
      });
  };

  const [refundInfo, setrefundInfo] = useState<RefundInfo>();

  const getRefundReservation = async (reservation: any) => {
    setloading(true);
    await axios
      .get(
        `${BASEURL}/policy/api/v1/${reservation.id}/evaluate/?lang=${locale}`,
        {
          headers :{
            "ngrok-skip-browser-warning": "true"
          }
        }
      )
      .then((res) => {
        setloading(false);
        // console.log(res);
        setrefundInfo(res.data);
        Swal.fire({
          title: `(${res.data?.refund_type}) ${res.data?.message}`,
          html: `
            <p>${tMain("Refund amount")}: ${
            res.data?.allowed_refund_amount
          } SAR</p>
            <p>${tMain("Refund percentage")}: ${
            res.data?.refund_percentage
          }%</p>
          `,
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: tMain("ok cancel reservation"),
          denyButtonText: tMain("Don't cancel"),
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
            handleCancelReservation(reservation.id, reservation);
          }
        });
      });
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

        {data.results.map((reservation) => (
          <div
            key={reservation.id}
            dir={locale === "ar" ? "rtl" : "ltr"}
            className={`border rounded-xl p-6 mb-6 shadow-lg bg-white dark:bg-[#050d22] space-y-6 ${
              typeView.includes(reservation.status) ? "" : "hidden"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#855d01]">
                {tMain("Reservation")} #{reservation.reference_number}
              </h2>
              <span
                className={`text-sm font-medium px-3 py-1  ${
                  ["cancelled", "failed"].includes(reservation.status)
                    ? "bg-[#ff00004f] text-white"
                    : ["confirmed"].includes(reservation.status)
                    ? "text-white bg-[#957428]"
                    : "text-gray-700 bg-gray-100"
                }  rounded-full`}
              >
                {tMain("Status")}: {reservation.status}
              </span>
            </div>

            <div className="text-gray-700 space-y-1">
              <p>
                💰 <strong>{tMain("Total Amount")}:</strong>{" "}
                {reservation.total_amount}$ |
                <strong> {tMain("Deposit Amount")}:</strong>{" "}
                {reservation.deposit_amount}$
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-[#030409] p-4 rounded-lg shadow-inner space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">
                🏨 {tMain("Hotel Info")}
              </h3>
              <p className="dark:text-gray-200 text-gray-900">
                {reservation.hotel.name} ({reservation.hotel.category})
              </p>
              <p>{reservation.hotel.address}</p>
              <p>
                📞 {reservation.hotel.phone} | ✉️ {reservation.hotel.email}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-[#030409] p-4 rounded-lg shadow-inner space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">
                👤 {tMain("Guest Info")}
              </h3>
              <p>
                {reservation.guest.first_name} {reservation.guest.last_name}
              </p>
              <p>✉️ {reservation.guest.email}</p>
            </div>

            <div className="bg-gray-50 dark:bg-[#030409] p-4 rounded-lg shadow-inner space-y-4">
              <h3 className="text-lg font-semibold border-b pb-1">
                🛏️ {tMain("Rooms")}
              </h3>
              {reservation.room_counts.map((room, i) => (
                <div
                  key={i}
                  className="pl-4 border-l-4 border-primary space-y-1"
                >
                  <p>
                    🛌 <strong>{tMain("Room Type")}:</strong>{" "}
                    {room.room_type.name}
                  </p>
                  <p>
                    🌄 <strong>{tMain("View")}:</strong> {room.room_view.name}
                  </p>
                  <p>
                    🍽️ <strong>{tMain("Meal Plan")}:</strong>{" "}
                    {room.meal_plan.name}
                  </p>
                  <p>
                    🍱 <strong>{tMain("Meals")}:</strong>{" "}
                    {room.meal_plan.meals.map((meal) => (
                      <span
                        key={meal.id}
                        className="inline-block mr-1 bg-gray-200 text-black px-2 py-0.5 rounded-full text-sm"
                      >
                        {meal.name}
                      </span>
                    ))}
                  </p>
                  <p>
                    🔢 <strong>{tMain("Room Numbers")}:</strong>{" "}
                    {room.room_numbers.join(", ")}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              🕓 {tMain("Created At")}: {reservation.created_at}
            </p>

            {/* Uncomment to activate buttons */}
            <div className="flex flex-wrap gap-2 justify-end mt-4">
              {reservation.status === "pending" && (
                <button
                  onClick={() => {
                    getRefundReservation(reservation);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  {tMain("Cancel Reservation")}
                </button>
              )}
              {/* هل ينفع يروح يدفع الاوردر المتكنسل؟ */}
              {!["cancelled"].includes(reservation.status) && (
                <Link href={`/payment/${reservation.id}`}>
                  <button className="bg-[#957428] hover:bg-[#9b8548] text-white px-4 py-2 rounded transition flex items-center gap-1">
                    {tMain("Reservation Details")}
                    {/* <span className="animate-bounce">{">"}</span> */}
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
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
