import BASEURL from "@/context/handleAPIDomain";
import { RootState } from "@/lib/store";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void;
  handelDeleteReview: () => Promise<void>;
  tMain: any;
  defReviewText: string;
  hotel_id: string;
  defRating: number;
}

export interface ReviewFormData {
  review_text: string;
  rating: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  handelDeleteReview,
  tMain,
  defReviewText,
  hotel_id,
  defRating,
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    review_text: defReviewText,
    rating: defRating,
  });
  //   // console.log(formData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ReviewFormData, string>>
  >({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.review_text.trim())
      newErrors.review_text = "Review text is required.";
    if (formData.rating < 1 || formData.rating > 5)
      newErrors.rating = "Rating must be between 1 and 5.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({
        review_text: "",
        rating: 0,
      });
      setErrors({});
    }
  };

  const [loading, setloading] = useState(true);
  const [nothaveReview, setnotHaveReview] = useState(false);
  const getReviewsByHotelId = async () => {
    // reviews/api/v1/retrieve/?hotel=5
    const access_token = JSON.parse(localStorage.getItem("userData") || "null")
      ?.tokens.access_token;

    await axios
      .get(`${BASEURL}/reviews/api/v1/retrieve/?hotel=${hotel_id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) =>
        setFormData({
          review_text: res.data.review_text,
          rating: res.data.rating,
        })
      )
      .catch((err) => {
        // // console.log("error get review data ", err);
        if (
          err.response.data?.error === "You haven't reviewed this hotel yet"
        ) {
          setnotHaveReview(true);

          return;
        }
      });
    setloading(false);
  };

  useEffect(() => {
    getReviewsByHotelId();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-transparent p-6 rounded-2xl shadow-lg border border-yellow-300 dark:border-yellow-600 text-gray-800 dark:text-gray-100"
    >
      <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-4">
        {tMain("Leave a Review")}
      </h2>

      {/* Review Text */}
      <div className="mb-4">
        <label className="block font-medium mb-1">{tMain("Review")}</label>
        <textarea
          name="review_text"
          value={formData.review_text}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
        ></textarea>
        {errors.review_text && (
          <p className="text-red-500 text-sm mt-1">{errors.review_text}</p>
        )}
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="block font-medium mb-1">
          {tMain("Rating")} (1 - 5)
        </label>
        <input
          type="number"
          name="rating"
          min={1}
          max={5}
          value={formData.rating}
          onChange={handleChange}
          className="w-20 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
        />
        {errors.rating && (
          <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        {tMain("Submit Review")}
      </button>
    </form>
  );
};

export default ReviewForm;
