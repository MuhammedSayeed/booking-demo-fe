"use client";
import { Room, RoomCombinationsResponse } from "@/interfaces/hotel";
import { useTranslations } from "next-intl";

export default function RoomCard({
  room,
  locale,
  id,
  hotelName,
  bookTranslation,
  view,
  MaxOccupancy,
  description,
}: {
  room: RoomCombinationsResponse;
  locale: string;
  id: string;
  hotelName: string;
  bookTranslation: string;
  view: string;
  MaxOccupancy: string;
  description: string;
}) {
  const tMain = useTranslations();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800">
      <div className="p-5 space-y-3">
        {room.rooms.map((room, index) => (
          <div key={index}>
            <h2 className="text-xl font-bold text-primary ">
              {room.room_type.name}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {view}: <span className="font-medium">{room.room_view.name}</span>
            </p>

            {/* {room.max_occupancy && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {MaxOccupancy}:{" "}
            <span className="font-medium">{room.max_occupancy}</span>
          </p>
        )} */}
            {room.capacity && (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {MaxOccupancy}:{" "}
                <span className="font-medium">{room.capacity}</span>
              </p>
            )}

            {room.room_type.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {description}:{" "}
                <span className="font-medium">
                  {room.room_type.description}
                </span>
              </p>
            )}
            <hr />
          </div>
        ))}

        

        <p className="text-gray-900 dark:text-white text-lg font-semibold">
          {tMain("Total Price")}: SAR {parseFloat(room.total_cost).toFixed(2)}
        </p>

     
      </div>
    </div>
  );
}
