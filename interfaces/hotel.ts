export interface Country {
  id: number;
  name: string;
  code: string;
  phone_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: string;
  name: string;
  country: Country;
  state_province: string;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
}
export interface CityOfRoomes {
  id: string;
  name: string;
  country: {
    id: string;
    name: string;
    code: string;
    phone_code: string;
    is_active: boolean;
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
  };
  state_province: string;
  latitude: string; // Stored as string, could be number if parsed
  longitude: string; // Stored as string, could be number if parsed
  is_active: boolean;
  timezone: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

export interface HotelImage {
  id: number;
  image: string;
  caption: string;
  image_type: string;
  is_primary: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  hotel: number;
}

export interface AmenityDetail {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  id: number;
  hotel: number;
  amenity: AmenityDetail;
  is_available: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Hotel {
  id: string;
  chain: {
    id: string;
    name: string;
    description: string;
    headquarters: string;
    website: string | null;
    facebook: string | null;
    instagram: string | null;
    mobile_number: string | null;
    phone_number: string | null;
    whatsapp_number: string | null;
    email: string;
    logo: string;
  };
  name: string;
  category: string;
  description: string;
  address: string;
  city: City;
  country: Country;
  timezone: string;
  postal_code: string;
  phone: string;
  email: string;
  website: string;
  check_in_time: string;
  check_out_time: string;
  is_active: boolean;
  external_system_id: string | null;
  images: HotelImage[];
  amenities: Amenity[];
  created_at: string;
  updated_at: string;
}
export interface HotelAfterUpdate {
  hotel_id: string; // Encoded hotel ID
  hotel_name: string; // Name of the hotel
  hotel_address: string; // Address of the hotel
  hotel_category: string; // (Translated) category of the hotel
  images: {
    id: string;
    image: string; // Image URL or path
    caption: string;
    image_type: string;
    is_primary: boolean;
    order: number;
  }[];
  total_price: string; // Total price for the stay (decimal as string)
}

interface RoomType {
  id: number;
  name: string;
  description: string;
  max_occupancy: number;
  external_system_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface RoomView {
  id: number;
  name: string;
  description: string;
  external_system_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface RoomReservationOption {
  room_type: {
    id: string;
    name: string;
    description: string;
    max_occupancy: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
  };
  room_view: {
    id: string;
    name: string;
    description: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
  };
  capacity: number;
  total_price: string;
}
// price_per_night: string; // e.g. "100.00"
// total_price: string;     // e.g. "200.00"
// rooms_needed: number;
// nights: number;
// max_occupancy: number;

// Reservation
export interface RoomConfiguration {
  room_type_id: string;
  room_view_id: string;
  meal_plan_id: string;
  num_rooms: number;
}
export interface RoomCombinationsResponse {
  rooms: {
    room_type: {
      id: string;
      name: string;
      description: string;
      max_occupancy: number;
      created_at: string;
      updated_at: string;
    };
    room_view: {
      id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
    capacity: number;
    total_price: string; // Decimal as string
  }[];
  total_cost: string; // Decimal as string
  total_rooms: number;
}

export interface Room {
  id: number;
  room_type: RoomType;
  room_view: RoomView;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  today_price: number;
}

interface Meal {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface MealPlan {
  id: number;
  name: string;
  description: string;
  external_system_id: string;
  meals: Meal[];
  created_at: string;
  updated_at: string;
}

export interface MealPlanOption {
  id: number;
  meal_plan: MealPlan;
  created_at: string;
  updated_at: string;
  today_price: number;
}

// chains
export interface HotelChain {
  id: number;
  name: string;
  description: string;
  headquarters: string;
  website: string;
  logo: string;
  external_system_id: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// user
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  country_details: {
    id: number;
    name: string;
    code: string;
    phone_code: string;
    nationality: string;
  };
  passport_number: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

// Room /rooms/api/v1/:hotel_id
export interface Room {
  id: number;
  room_type: {
    id: number;
    name: string;
    description: string;
    max_occupancy: number;
    external_system_id: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
  };
  room_view: {
    id: number;
    name: string;
    description: string;
    external_system_id: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
  };
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  today_price: number;
}

// meals plan /rooms/api/v1/meals/:hotel?page=<integer>
export interface HotelMeal {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface MealPlanDetail {
  id: string;
  name: string;
  description: string;
  external_system_id: string;
  meals: Meal[];
  created_at: string;
  updated_at: string;
}

export interface RoomMealPlan {
  id: string;
  meal_plan: MealPlanDetail;
  created_at: string;
  updated_at: string;
  today_price: number;
}

export interface ReservationState {
  hotel_id: string;
  room_configurations: RoomConfiguration[];
  from_date: string;
  to_date: string;
  adults: number;
  children: number;
  special_requests: string;
}

// Booking /reservations/api/v1/
export interface Booking {
  id: number;
  reference_number: string;
  hotel: {
    id: number;
    name: string;
    category: string;
    address: string;
    city: number;
    phone: string;
    email: string;
  };
  guest: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    country: string | null;
    passport_number: string | null;
    date_of_birth: string | null;
  };
  adults: number;
  children: number;
  check_in: string; // ISO Date string
  check_out: string; // ISO Date string
  status: string;
  total_amount: string; // might be better as number
  deposit_amount: string; // might be better as number
  is_refunded: boolean;
  special_requests: string;
  room_counts: RoomCount[];
  created_at: string;
  updated_at: string;
}

interface RoomCount {
  room_type: {
    id: number;
    name: string;
    description: string;
    max_occupancy: number;
    external_system_id: string;
    created_at: string;
    updated_at: string;
  };
  room_view: {
    id: number;
    name: string;
    description: string;
    external_system_id: string;
    created_at: string;
    updated_at: string;
  };
  meal_plan: {
    id: number;
    name: string;
    description: string;
    meals: Meal[];
  };
  count: number;
  room_numbers: string[];
}

// review on single hotel

export interface HotelReview {
  id: number;
  hotel: number;
  hotel_name: string;
  guest: number;
  guest_email: string;
  review_text: string;
  rating: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// country
export interface CountryInterface {
  id: number;
  name: string;
  code: string;
  phone_code: string;
  nationality: string;
}

// Chain
export interface CompanyChain {
  id: number;
  name: string;
  description: string;
  headquarters: string;
  website: string;
  facebook: string;
  instagram: string;
  mobile_number: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  logo: string;
  external_system_id: string | null;
  created_at: string;
  updated_at: string;
}
