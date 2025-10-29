"use client";

import { HotelReview } from "@/interfaces/hotel";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateReview from "./CreateReview";
import { ReviewFormData } from "./ReviewFormProps";
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import BASEURL from "@/context/handleAPIDomain";
function FormReview({ hotel_id }: { hotel_id: string }) {
      const tMain = useTranslations();
      const { locale } = useParams();
      const [allReviewOnSingleHote, setallReviewOnSingleHote] = useState<{
        count: number;
        next: string;
        previous: string;
        results: [HotelReview];
      }>();
      const [url, setUrl] = useState<string>(
        `${BASEURL}/reviews/api/v1/?hotel=${hotel_id}&lang=${locale}`
      );
    
      const [statusForm, setstatusForm] = useState({
        loading: true,
        error: false,
      });
      const [rating, setrating] = useState(0);
    const [review_text, setreview_text] = useState("");
    

  return (
    <div>
      <div dir={locale === "ar" ? "rtl" : "ltr"}>
        <form
          onSubmit={async (e) => {
            const access_token = JSON.parse(
              localStorage.getItem("userData") || "null"
            )?.tokens.access_token;
            e.preventDefault();
            if (rating < 1 || rating > 5) {
              toast({
                title: tMain("Rating must be between 1 and 5"),
                variant: "destructive",
              });
              return;
            }
            if (review_text.length < 2) {
              toast({
                title: tMain("Review text must be at least 2 characters long"),
                variant: "destructive",
              });
              return;
            }
            await axios
              .post(
                `${BASEURL}/reviews/api/v1/?lang=${locale}`,
                {
                  hotel: hotel_id,
                  rating: rating,
                  review_text: review_text,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${access_token}`,
                    "ngrok-skip-browser-warning": "true"
                  },
                }
              )
              
          }}
        >
          <textarea
            name="review_text"
            onChange={(e) => {
              setreview_text(e.target.value);
            }}
            rows={4}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
          ></textarea>
          <input
            type="number"
            name="rating"
            min={1}
            max={5}
            onChange={(e) => {
              setrating(+e.target.value);
            }}
            className="w-20 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {tMain("Submit Review")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormReview;
