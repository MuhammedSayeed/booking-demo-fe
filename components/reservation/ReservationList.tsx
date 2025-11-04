import { Booking } from "@/interfaces";
import LoadingSpinner from "./LoadingSpinner";
import ReservationCard from "./ReservationCard";
import { useTranslations } from "next-intl";

interface IProps {
    reservations: Booking[],
    isLoading: boolean,
    error: string | null,
    activeTab: string,
}

const ReservationList = ({ reservations, isLoading, error, activeTab }: IProps) => {
    const t = useTranslations();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600 font-medium">{error}</div>;
    }

    if (reservations.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
                <p className="text-lg text-gray-500">{t(`noReservationsFound`, { activeTab })}</p>
                <p className="text-sm text-gray-400 mt-2">{t("noReservationsDesc")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {reservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
        </div>
    );
};

export default ReservationList
