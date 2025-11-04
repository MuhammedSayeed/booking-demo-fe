export interface Guest {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    country: string;
    date_of_birth: string | null;
    passport_number: string | null;
}
export interface Hotel {
    id: string;
    name: string;
    category: string;
    address: string;
    city: number;
    email: string;
    phone: string;
}
export interface Booking {
    id: string;
    reference_number: string;
    adults: number;
    children: number;
    check_in: string;
    check_out: string;
    created_at: string;
    updated_at: string;
    deposit_amount: string;
    total_amount: string;
    is_refunded: boolean;
    special_requests: string;
    status: "pending" | "confirmed" | "cancelled" | string;
    guest: Guest;
    hotel: Hotel;
}
