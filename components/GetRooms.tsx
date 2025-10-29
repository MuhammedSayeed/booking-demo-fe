"use client";
import React from "react";
import { useEffect, useState, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useParams } from "next/navigation";
import { Room } from "@/interfaces/hotel";
import axios from "axios";
import { useTranslations } from "next-intl";
import BASEURL from "@/context/handleAPIDomain";

function GetRooms({
  handleRoomError,
}: {
  handleRoomError: (error: any) => void;
}) {
  const params = useParams();
  const [rooms, setrooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorRooms, setErorrRooms] = useState("");
  const { locale } = useParams();
  const tMain = useTranslations();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${BASEURL}/rooms/api/v1/${params.id}?lang=${locale}`,{
            headers :{
              "ngrok-skip-browser-warning": "true"
            }
          }
        );
        if (isMounted) setrooms(response.data);
      } catch (error) {
        if (isMounted) handleRoomError(error);
      }

      if (isMounted) setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  if (loading) {
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="container py-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{tMain("Loading")}...</h2>
        <p className="text-muted-foreground mb-6">
          {tMain("Please wait while we fetch the hotel details")}.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{tMain("Available Rooms")}</h2>
      {rooms.map((room: Room) => (
        <Card key={room.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <CardContent className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {room.room_type.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {room.room_type.description}
                  </p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {room.room_type.max_occupancy} {tMain("Guests")}
                </Badge>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
      {errorRooms && <span className="text-red-500">{errorRooms}</span>}
    </div>
  );
}

export default memo(GetRooms); // Memoizing to prevent unnecessary re-renders
