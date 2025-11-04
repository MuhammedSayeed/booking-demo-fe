import { useRouter } from "@/i18n/navigation";
import { Booking } from "@/interfaces";
import { Calendar, CreditCard, TicketSlash, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";


const ReservationCard = ({ reservation }: { reservation: Booking }) => {
   
    const t = useTranslations()
    const { id, status, hotel, check_in, check_out, adults, children, reference_number, total_amount } = reservation;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
        confirmed: "bg-green-100 text-green-800 border-green-300",
        canceled: "bg-red-100 text-red-800 border-red-300",
    };

    const statusStyle = (statusStyles as Record<string, string>)[status] || "bg-gray-100 text-gray-800";


    

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl flex flex-col">
            {/* Card Content */}
            <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                    {/* Card Header: Hotel Name & Status */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                        <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider">{hotel.category}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{hotel.name}</h3>
                        </div>
                        <span className={`mt-2 sm:mt-0 text-sm font-semibold px-3 py-1 rounded-full border ${statusStyle}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </div>

                    {/* Card Details: Dates, Guests, Ref */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
                        <div className="flex items-center space-x-3">
                            <Calendar />
                            <div>
                                <p className="text-sm font-medium text-gray-500">{t("checkIn")}</p>
                                <p className="font-semibold">{formatDate(check_in)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Calendar />
                            <div>
                                <p className="text-sm font-medium text-gray-500">{t("checkOut")}</p>
                                <p className="font-semibold">{formatDate(check_out)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Users />
                            <div>
                                <p className="text-sm font-medium text-gray-500">{t("guests")}</p>
                                <p className="font-semibold">{adults} {t("adult")}{adults > 1 ? t("adults") : ''}{children > 0 ? `, ${children} ${t("child")}${children > 1 ? t("children") : ''}` : ''}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <TicketSlash />
                            <div>
                                <p className="text-sm font-medium text-gray-500">{t("reference")}</p>
                                <p className="font-semibold">{reference_number}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Footer: Total & Actions */}
                <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center">
                    <div className="text-center sm:text-left">
                        <p className="text-sm font-medium text-gray-500">{t("totalAmount")}</p>
                        <p className="text-2xl font-bold text-gray-900">SAR {total_amount}</p>
                    </div>


                    <div className="flex items-center gap-4">
                        {status === 'pending' && (
                            <Link
                                href={`payment/${id}`}
                                className="mt-4 sm:mt-0 flex items-center gap-4 justify-center bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                            >
                                <CreditCard />
                                {t("payNow")}
                            </Link>
                        )}
                        <Link href={`/reservation/${id}`} className="mt-4 sm:mt-0 flex items-center gap-4 justify-center bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
                                {t("viewDetails")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationCard