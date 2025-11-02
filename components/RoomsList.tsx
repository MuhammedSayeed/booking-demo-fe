"use client";
import {
  Room,
  RoomCombinationsResponse,
  RoomConfiguration,
  RoomReservationOption,
} from "@/interfaces/hotel";
import RoomCard from "./RoomCard";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setReservation } from "@/lib/features/reservation/reservationSlice";
import { useParams } from "next/navigation";
import { setSelectedRoom } from "@/lib/features/RoomsMealData/RoomsMealData";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/hooks";

export default function RoomsList({
  rooms,
  locale,
  id,
  hotelName,
  bookTranslation,
  view,
  MaxOccupancy,
  description,
}: {
  rooms: RoomCombinationsResponse[];
  locale: string;
  id: string;
  hotelName: string;
  bookTranslation: string;
  view: string;
  MaxOccupancy: string;
  description: string;
}) {
  const [roomSelected, setRoomSelected] = useState<
    RoomCombinationsResponse | number
  >(-1 as number); // Redux Toolkit
  // // console.log(roomSelected);
  const tMain = useTranslations();
  const dispatch = useDispatch();
  const reservation = useAppSelector((state) => state.reservation);
  const roomSelection = useAppSelector((state) => state.roomSelection);

  const handleReservation = (room: RoomCombinationsResponse) => {
    dispatch(setSelectedRoom(room));
    let roomConfigurations: RoomConfiguration[] = [];
    for (let i = 0; i < room.rooms.length; i++) {
      roomConfigurations.push({
        room_type_id: room.rooms[i].room_type.id,
        room_view_id: room.rooms[i].room_view.id,
        meal_plan_id: roomSelection.selectedMealPlan?.id ?? "",
        num_rooms: 1,
      });
    }
    dispatch(
      setReservation({
        hotel_id: id,
        room_configurations: roomConfigurations,
        from_date: "",
        to_date: "",
        adults: -1,
        children: -1,
        special_requests: "",
      })
    );
  };

  if (!Array.isArray(rooms) || rooms.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        {tMain("There are no available rooms currently available")}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room: RoomCombinationsResponse, index) => (
        <button
          onClick={() => {
            setRoomSelected(index);
            handleReservation(room);
            console.log(index, roomSelected);
          }}
          key={index}
          className={`${
            index === roomSelected
              ? "opacity-100"
              : roomSelected === -1
              ? "opacity-100"
              : "opacity-50"
          }  hover:opacity-100 focus:outline-none`}
        >
          <RoomCard
            key={index}
            room={room}
            locale={`${locale}`}
            id={`${id}`}
            hotelName={`${hotelName}`}
            bookTranslation={`${bookTranslation}`}
            view={`${view}`}
            MaxOccupancy={`${MaxOccupancy}`}
            description={`${description}`}
          />
        </button>
      ))}
    </div>
  );
}
