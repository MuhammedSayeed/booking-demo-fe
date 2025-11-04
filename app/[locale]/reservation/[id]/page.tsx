"use client"

import BASEURL from "@/context/handleAPIDomain";
import axios from "axios";
import { CreditCard, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface Guest {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
}

export interface Hotel {
    id: string;
    name: string;
    category: string;
    address: string;
    city: number | string;
}

export interface RoomType {
    id: string;
    name: string;
    description: string;
    max_occupancy: number;
    created_at: string;
    updated_at: string;
}

export interface RoomView {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Meal {
    id: string;
    name: string;
    description: string;
    created_at: string;
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

export interface RoomCount {
    room_type: RoomType;
    room_view: RoomView;
    meal_plan: MealPlan;
    num_rooms: number;
    total_price: string;
}

export interface Booking {
    id: string;
    reference_number: string;
    status: string;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    total_amount: string;
    deposit_amount: string;
    is_refunded: boolean;
    special_requests: string;
    created_at: string;
    guest: Guest;
    hotel: Hotel;
    room_counts: RoomCount[];
}

// --- Helper Components ---
const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";

    switch (status.toLowerCase()) {
        case "confirmed":
            bgColor = "bg-green-100";
            textColor = "text-green-800";
            break;
        case "pending":
            bgColor = "bg-yellow-100";
            textColor = "text-yellow-800";
            break;
        case "cancelled":
            bgColor = "bg-red-100";
            textColor = "text-red-800";
            break;
    }

    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${bgColor} ${textColor}`}>
            {status}
        </span>
    );
};

const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-md font-semibold text-gray-900">{value}</span>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-16 animate-spin text-primary" />
    </div>
);

// --- Main Page ---
const Page = () => {
    const t = useTranslations();
    const params = useParams();
    const id = params.id as string;
    const [access_token, setAccessToken] = useState<string | null>(null);
    const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData") || "null");
        setAccessToken(userData?.tokens?.access_token || null);
    }, []);

    useEffect(() => {
        if (!id || !access_token) {
            if (!access_token && !localStorage.getItem("userData")) {
                setError(t("notLoggedIn"));
                setIsLoading(false);
            }
            return;
        }

        const fetchBooking = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${BASEURL}/reservations/api/v1/${id}/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                setBookingDetails(response.data);
            } catch (error) {
                console.error("Error fetching booking:", error);
                setError(t("fetchBookingError"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooking();
    }, [id, access_token, t]);

    if (isLoading) return <LoadingSpinner />;
    if (error)
        return (
            <div className="flex justify-center items-center text-red-500 font-semibold">
                {error}
            </div>
        );
    if (!bookingDetails)
        return (
            <div className="flex justify-center items-center text-gray-500 font-semibold">
                {t("noBookingDetailsFound")}
            </div>
        );

    return (
        <div className="bg-gray-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-lg overflow-hidden">
                {/* --- Header --- */}
                <div className="p-6 bg-primary text-white">
                    <div className="flex flex-col md:flex-row justify-between md:items-center">
                        <h1 className="text-3xl font-bold">{t("bookingDetails")}</h1>
                        <span className="text-lg text-primary mt-2 md:mt-0">
                            {t("ref")}: #{bookingDetails.reference_number}
                        </span>
                    </div>
                </div>

                {/* --- Status & Key Details --- */}
                <div className="p-6 border-b grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <div className="col-span-2 md:col-span-1 space-x-2">
                            <span className="text-sm font-medium text-gray-500">{t("status")}</span>
                            <StatusBadge status={bookingDetails.status} />
                        </div>
                    </div>
                    <DetailItem
                        label={t("checkIn")}
                        value={new Date(bookingDetails.check_in).toLocaleDateString()}
                    />
                    <DetailItem
                        label={t("checkOut")}
                        value={new Date(bookingDetails.check_out).toLocaleDateString()}
                    />
                    <DetailItem
                        label={t("guestsCount")}
                        value={`${bookingDetails.adults} ${t("adultsCount")}${bookingDetails.children > 0
                                ? `, ${bookingDetails.children} ${t("childrenCount")}`
                                : ""
                            }`}
                    />
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Column: Rooms & Payment --- */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Hotel Details */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b">
                                {bookingDetails.hotel.name}
                            </h2>
                            <p className="text-gray-600">{bookingDetails.hotel.address}</p>
                            <p className="text-gray-600">{bookingDetails.hotel.city}</p>
                            <span className="text-sm font-medium text-primary">
                                {bookingDetails.hotel.category}
                            </span>
                        </section>

                        {/* Room Details */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                {t("roomAndRateDetails")}
                            </h2>
                            <div className="space-y-4">
                                {bookingDetails.room_counts.map((room, index) => (
                                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                                            <h3 className="text-lg font-semibold text-primary">
                                                {room.num_rooms} x {room.room_type.name}
                                            </h3>
                                            <span className="text-lg font-bold text-gray-900 mt-2 md:mt-0">
                                                {room.total_price}
                                            </span>
                                        </div>
                                        <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1 pl-2">
                                            <li>
                                                <span className="font-medium">{t("view")}:</span>{" "}
                                                {room.room_view.name}
                                            </li>
                                            <li>
                                                <span className="font-medium">{t("mealPlan")}:</span>{" "}
                                                {room?.meal_plan?.name ? room.meal_plan.name : "none"}
                                            </li>
                                            <li>
                                                <span className="font-medium">{t("maxOccupancy")}:</span>{" "}
                                                {room.room_type.max_occupancy} {t("guestsCount")}
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Special Requests */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                {t("specialRequests")}
                            </h2>
                            <p className="text-gray-700 p-4 bg-gray-50 rounded-lg italic">
                                {bookingDetails.special_requests || t("noneProvided")}
                            </p>
                        </section>

                        {bookingDetails.status === "pending" && (
                            <Link
                                href={`/payment/${id}`}
                                className="mt-4 sm:mt-0 flex items-center gap-4 justify-center bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                            >
                                <CreditCard />
                                {t("payNow")}
                            </Link>
                        )}
                    </div>

                    {/* --- Right Column: Guest & Payment --- */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Guest Details */}
                        <section className="bg-blue-50 p-4 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                                {t("guestInformation")}
                            </h2>
                            <div className="space-y-3">
                                <DetailItem
                                    label={t("Name")}
                                    value={`${bookingDetails.guest.first_name} ${bookingDetails.guest.last_name}`}
                                />
                                <DetailItem label={t("Email")} value={bookingDetails.guest.email} />
                                <DetailItem
                                    label={t("Phone")}
                                    value={bookingDetails.guest.phone || t("noneProvided")}
                                />
                            </div>
                        </section>

                        {/* Payment Details */}
                        <section className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                                {t("paymentSummary")}
                            </h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-md">
                                    <span className="text-gray-600">{t("depositAmount")}:</span>
                                    <span className="font-medium text-gray-800">
                                        {bookingDetails.deposit_amount}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-700 font-semibold">{t("totalAmount")}:</span>
                                    <span className="font-bold text-primary">
                                        {bookingDetails.total_amount}
                                    </span>
                                </div>
                                {bookingDetails.is_refunded && (
                                    <div className="flex justify-between text-md text-red-600 font-semibold pt-2 border-t mt-2">
                                        <span>{t("status")}:</span>
                                        <span>{t("statusRefunded")}</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* --- Footer --- */}
                <div className="p-4 bg-gray-50 border-t text-sm text-gray-500 text-center">
                    {t("bookedOn")}: {new Date(bookingDetails.created_at).toLocaleString()}
                </div>
            </div>
            <Link
                href={"/"}
                className="text-center block text-primary font-medium w-fit mx-auto mt-8 hover:underline text-xl"
            >
                {t("backToHome")}
            </Link>
        </div>
    );
};

export default Page;
