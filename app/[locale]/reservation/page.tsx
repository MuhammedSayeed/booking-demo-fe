"use client"

import ReservationList from "@/components/reservation/ReservationList";
import TabButton from "@/components/reservation/TabButton";
import BASEURL from "@/context/handleAPIDomain";
import { Booking } from "@/interfaces";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const ReservationPage = () => {
    const t = useTranslations();
    const tabs: ('pending' | 'confirmed' | 'canceled')[] = ['pending', 'confirmed', 'canceled'];
    const [reservations, setReservations] = useState<Booking[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'canceled'>('pending');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const reservations = async () => {
            setIsLoading(true);
            setError(null);
            const access_token = JSON.parse(
                localStorage.getItem("userData") || "null"
            )?.tokens.access_token;
            try {
                const { data } = await axios.get(`${BASEURL}/reservations/api/v1/reservations/`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                setReservations(data);

            } catch {

            } finally {
                setIsLoading(false);
            }
        }
        reservations()
    }, [])

    useEffect(() => {
        const filtered = reservations.filter(r => r.status === activeTab);
        setFilteredReservations(filtered);
    }, [reservations, activeTab]);

    const getCount = (status: ('pending' | 'confirmed' | 'canceled')) => {
        return reservations.filter(r => r.status === status).length;
    };


    return (
        <div className="min-h-screen bg-gray-100 font-inter">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">{t("myReservations")}</h1>
                    <p className="mt-2 text-lg text-muted-foreground">{t("myReservationsDesc")}</p>
                </header>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="flex space-x-1 sm:space-x-4 border-b border-gray-200">
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab}
                                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                                isActive={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                                count={getCount(tab)}
                            />
                        ))}
                    </div>
                </div>
                <main>
                    <ReservationList
                        reservations={filteredReservations}
                        isLoading={isLoading}
                        error={error}
                        activeTab={activeTab}
                    />
                </main>
            </div>
        </div>
    )
};

export default ReservationPage;