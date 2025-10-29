"use client";

import { toast } from "@/hooks/use-toast";
import { Booking } from "@/interfaces/hotel";
import { RootState } from "@/lib/store";

import axios from "axios";
import { useTranslations } from "next-intl";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import BASEURL from "@/context/handleAPIDomain";

// redirect after pay `/ar/payment/:reservation_id/?status=&tap_id=`

function ReservationId() {
  const { locale, reservationId, status } = useParams();
  const tMain = useTranslations();
  const router = useRouter();
  const [data, setData] = useState<Booking>();

  const [loading, setloading] = useState(true);
  const [url, setUrl] = useState<string>(
    `${BASEURL}/reservations/api/v1/${reservationId}/?lang=${locale}` // Adjust the URL as needed
  );

  const fetchReservations = async (url: string) => {
    if (typeof window !== "undefined") {
      setloading(true);
      const access_token = JSON.parse(
        localStorage.getItem("userData") || "null"
      )?.tokens.access_token;
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "ngrok-skip-browser-warning": "true"
          },
        })
        .then((res) => {
          setData(res.data);
          // console.log(res.data);
        })
        .catch((error) => {
          console.error("Error fetching reservations:", error);

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
        });

      setloading(false);
    }
  };

  const getComplete = async (tap_id: string) => {
    await axios
      .get(
        `${BASEURL}/payments/api/v1/complete/${reservationId}/?tap_id=${tap_id}&lang=${locale}`,
        {
          headers :{
            "ngrok-skip-browser-warning": "true"
          }
        }
      )
      .then((res) => {
        // console.log(res.data);
        if (
          ["Payment Failed", "cancelled", "failed"].includes(res.data.status)
        ) {
          toast({
            title: tMain("Status Reservation"),
            description: res.data.status,
            variant: "destructive",
          });
        } else {
          toast({
            title: tMain("Status Reservation"),
            description: res.data.status,
          });
        }
      })
      .catch((err) => {
        // console.log("error from get complete data ", err);
      });
  };

  useEffect(() => {
    // get query status
    // const status = new URLSearchParams(window.location.search).get("status");
    const tap_id = new URLSearchParams(window.location.search).get("tap_id");
    fetchReservations(url);
    if (tap_id) {
      getComplete(tap_id);
    }
  }, [url]);

  const user = useSelector((state: RootState) => state.user);

  const handleSuccessFormPay = async (id: string) => {
    // toast({
    //   title: tMain("Payment Successful"),
    //   description: tMain("Your payment has been processed successfully"),
    // });

    /*
  "amount": 255,
  "payment_token": "tok_TS64A57251623jcrg27by4x78",
  "reservation_id": "65",
  "payment_method": "credit_card"
*/
    setloading(true);
    const access_token = JSON.parse(localStorage.getItem("userData") || "null")
      ?.tokens.access_token;

    await axios
      .post(
        `${BASEURL}/payments/api/v1/?lang=${locale}&redirect_url=${window.location.href}`,
        {
          amount: +`${data?.total_amount}`,
          payment_token: id,
          reservation_id: data?.id,
          payment_method: "credit_card",
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
            "ngrok-skip-browser-warning": "true"
          },
        }
      )
      .then((res) => {
        setloading(false);
        // console.log(res.data);
        router.push(res.data.payment_url);
      })
      .catch((err) => {
        setloading(false);
        // console.log("err", err);
      });
  };

  // Refund Reservation
  const getRefundReservation = async (data: Booking) => {
    let selectedReason = "duplicate"; // القيمة الابتدائية
    const access_token = JSON.parse(localStorage.getItem("userData") || "null")
      ?.tokens.access_token;
    const { value: formValues } = await Swal.fire({
      title: tMain("We are interested in knowing the reason for the refund"),
      icon: "info",
      html: `
        <select id="refundReason" class="swal2-select" style="width: auto; padding: 0.5em;">
          <option value="duplicate">${tMain("Duplicate")}</option>
          <option value="fraudulent">${tMain("Fraudulent")}</option>
          <option value="requested_by_customer">${tMain(
            "Requested by Customer"
          )}</option>
          <option value="cancelled_service">${tMain(
            "Cancelled Service"
          )}</option>
          <option value="other">${tMain("Other")}</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: tMain("ok cancel reservation"),
      cancelButtonText: tMain("Don't cancel"),
      preConfirm: () => {
        const selectElement = document.getElementById(
          "refundReason"
        ) as HTMLSelectElement;
        return selectElement?.value || "duplicate"; // default fallback
      },
    });

    if (formValues) {
      selectedReason = formValues; // تم اختيار القيمة بنجاح

      Swal.fire("Saved!", "", "success");
      setloading(true);
      // console.log(access_token);

      try {
        await axios
          .post(
            `${BASEURL}/payments/api/v1/refunds/?lang=${locale}`,
            {
              reservation_id: data.id,
              amount: +data.total_amount,
              reason: selectedReason,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
                "ngrok-skip-browser-warning": "true"
              },
            }
          )
          .then(async (res) => {
            /**
             *{
    "status": "success",
    "refund_id": 2,
    "tap_refund_id": "re_TS04A2820251001Ml4u2905754",
    "amount_refunded": 690,
    "message": "Refund processed successfully"
} 
             * 
            
             */
            toast({
              title: `${res.data.message}, Amount Refunded ${res.data.amount_refunded}`,
            });
            await fetchReservations(url);
          })
          .catch((err) => {
            // console.log("refund error ", err);
            toast({
              title: err.response.data.detail || err.response.data.detail[0],
              variant: "destructive",
            });
          });
      } finally {
        setloading(false);
      }
    }
  };

  if (!data || loading)
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="container py-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{tMain("Loading")}...</h2>
        {/* <p className="text-muted-foreground mb-6">
          {tMain("Please wait while we fetch the hotel details")}.
        </p> */}
      </div>
    );
  return (
    <div className="container py-10">
      {/* Form Card */}
      {!["cancelled", "confirmed"].includes(data.status) && (
        <div>
          <form
            className="my-4"
            onSubmit={async (e) => {
              e.preventDefault();
              // tokenize();
              await handleSuccessFormPay(`${data.id}`);
            }}
          >
            {/* <TapCard
              publicKey={`${process.env.NEXT_PUBLIC_TAPPAY_TEST_TOKEN}`}
              transaction={{
                amount: Number(data?.total_amount) || 1,
                currency: Currencies.SAR,
              }}
              customer={{
                name: [
                  {
                    lang: Locale.EN,
                    first: "Ahmed",
                    last: "Sharkawy",
                    middle: "Mohamed",
                  },
                ],
                nameOnCard: "Ahmed Sharkawy",
                editable: true,
                contact: {
                  email: "ahmed@gmail.com",
                  phone: {
                    countryCode: "20",
                    number: "1000000000",
                  },
                },
              }}
              acceptance={{
                supportedBrands: ["AMEX", "VISA", "MASTERCARD", "MADA"],
                supportedCards: ["CREDIT", "DEBIT"],
              }}
              fields={{
                cardHolder: true,
              }}
              addons={{
                // submitButton: true,
                // submitButtonText: "Pay Now",
                loader: true,
                saveCard: false,
                displayPaymentBrands: true,
              }}
              interface={{
                locale: Locale.EN,
                theme: Theme.LIGHT,
                edges: Edges.CURVED,
                direction: Direction.LTR,
              }}
              onSuccess={(data) => {
                // console.log("✅ onSuccess called!", data.id);
                handleSuccessFormPay(data.id);
              }}
              onValidInput={() => {
                // console.log("✅ onValidInput called!");
                return;
              }}
              onReady={() => {
                // console.log("✅ onReady called!");
                return;
              }}
              onError={(error) => {
                console.error("❌ onError:", error);
              }}
            /> */}
            <button
              type="submit"
              className="bg-[#957428] hover:bg-[#9b8548] text-white px-4 py-2 rounded transition flex items-center gap-1 mx-auto text-center"
            >
              {tMain("Submit Payment")}
            </button>
          </form>
        </div>
      )}

      {/* Reservation data */}
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="border rounded-xl p-6 mb-6 shadow-lg bg-white dark:bg-[#050d22] space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#855d01]primary">
            {tMain("Reservation")} #{data.reference_number}
          </h2>
          <span
            className={`text-sm font-medium px-3 py-1  ${
              ["cancelled", "failed"].includes(data.status)
                ? "bg-[#ff00004f] text-white"
                : ["confirmed"].includes(data.status)
                ? "text-white bg-[#957428]"
                : "text-gray-700 bg-gray-100"
            }  rounded-full`}
          >
            {tMain("Status")}: {data.status}
          </span>
        </div>

        <div className="text-gray-700 space-y-1">
          <p>
            💰 <strong>{tMain("Total Amount")}:</strong> {data.total_amount}$ |
            <strong> {tMain("Deposit Amount")}:</strong> {data.deposit_amount}$
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-[#030409] p-4 rounded-lg shadow-inner space-y-2">
          <h3 className="text-lg font-semibold border-b pb-1">
            🏨 {tMain("Hotel Info")}
          </h3>
          <p className="dark:text-gray-200 text-gray-900">
            {data.hotel.name} ({data.hotel.category})
          </p>
          <p>{data.hotel.address}</p>
          <p>
            📞 {data.hotel.phone} | ✉️ {data.hotel.email}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-[#030409] p-4 rounded-lg shadow-inner space-y-2">
          <h3 className="text-lg font-semibold border-b pb-1">
            👤 {tMain("Guest Info")}
          </h3>
          <p>
            {data.guest.first_name} {data.guest.last_name}
          </p>
          <p>✉️ {data.guest.email}</p>
        </div>

        <div className="bg-gray-50 dark:bg-[#030409] p-4 rounded-lg shadow-inner space-y-4">
          <h3 className="text-lg font-semibold border-b pb-1">
            🛏️ {tMain("Rooms")}
          </h3>
          {data.room_counts.map((room, i) => (
            <div key={i} className="pl-4 border-l-4 border-primary space-y-1">
              <p>
                🛌 <strong>{tMain("Room Type")}:</strong> {room.room_type.name}
              </p>
              <p>
                🌄 <strong>{tMain("View")}:</strong> {room.room_view.name}
              </p>
              <p>
                🍽️ <strong>{tMain("Meal Plan")}:</strong> {room.meal_plan.name}
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
          🕓 {tMain("Created At")}: {data.created_at}
        </p>

        {/* Refund  */}
        {data.status === "confirmed" && (
          <button
            onClick={() => {
              getRefundReservation(data);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            {tMain("Refund Reservation")}
          </button>
        )}

        {/* Uncomment to activate buttons */}
        {/* <div className="flex flex-wrap gap-2 justify-end mt-4">
    <button
      onClick={() => handleCancelReservation(data.id, data)}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      {tMain("Cancel Reservation")}
    </button>
    <Link href={`/payment/${data.id}`}>
      <button className="bg-[#957428] hover:bg-[#9b8548] text-white px-4 py-2 rounded transition flex items-center gap-1">
        {tMain("Pay Reservation")}
        <span className="animate-bounce">{">"}</span>
      </button>
    </Link>
  </div> */}
      </div>
    </div>
  );
}

export default ReservationId;

// Old component

{
  /* Card form */
}
{
  /* <div>
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="container py-10">
          <Cards
            number={form.number}
            name={form.name}
            expiry={form.expiry}
            cvc={form.cvc}
            focused={`${form.focus}` as "number" | "name" | "expiry" | "cvc"}
          />
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 mt-6 justify-items-center"
          >
            <div
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="mx-2 my-3 flex gap-4"
            >
              <input
                dir={locale === "ar" ? "rtl" : "ltr"}
                type="tel"
                name="number"
                placeholder={tMain("Card Number")}
                maxLength={16}
                autoComplete="cc-number"
                value={form.number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="focus:outline-none focus:ring-2 focus:ring-[#9b8548] rounded-lg p-2 border border-gray-300 dark:border-gray-600"
                required
              />
              <input
                type="text"
                name="name"
                placeholder={tMain("Name")}
                maxLength={30}
                autoComplete="cc-name"
                value={form.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="focus:outline-none focus:ring-2 focus:ring-[#9b8548] rounded-lg p-2 border border-gray-300 dark:border-gray-600"
                required
              />
            </div>

            <div
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="mx-2 my-3 flex gap-4"
            >
              <input
                type="text"
                name="expiry"
                placeholder={"MM/YY"}
                value={form.expiry}
                maxLength={5}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="focus:outline-none focus:ring-2 focus:ring-[#9b8548] rounded-lg p-2 border border-gray-300 dark:border-gray-600"
                required
              />
              <input
                type="tel"
                name="cvc"
                placeholder="CVC"
                maxLength={3}
                value={form.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="focus:outline-none focus:ring-2 focus:ring-[#9b8548] rounded-lg p-2 border border-gray-300 dark:border-gray-600"
                required
              />
            </div>
            <button className="bg-[#957428] hover:bg-[#9b8548] text-white px-4 py-2 rounded transition flex items-center gap-1 mx-auto text-center">
              {tMain("Submit Payment")}
            </button>
          </form>
        </div>
      </div> */
}
