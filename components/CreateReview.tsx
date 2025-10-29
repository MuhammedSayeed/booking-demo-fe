"use client";

import { HotelReview } from "@/interfaces/hotel";
import axios from "axios";
import { Loader2, Router } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewForm, { ReviewFormData } from "./ReviewFormProps";
import { toast } from "@/hooks/use-toast";
function CreateReview({
  hotel_id,
  statusForm,
  locale,
  tMain,
  userNotLogin,
  handleReviewSubmit,
  handelDeleteReview,
  formData,
}: {
  hotel_id: string;
  statusForm: { loading: boolean; error: boolean };
  locale: string;
  tMain: any;
  userNotLogin: any;
  handleReviewSubmit: any;
  handelDeleteReview: any;
  formData: any;
}) {
  if (statusForm.loading) {
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="flex flex-col items-center gap-2"
      >
        <p className="text-muted-foreground">{tMain("Loading")}...</p>
      </div>
    );
  }
  if (userNotLogin) {
    return;
  }

  return (
    <div>
      <div className="my-2">
        <ReviewForm
          onSubmit={handleReviewSubmit}
          handelDeleteReview={handelDeleteReview}
          defReviewText={formData.review_text}
          hotel_id={`${hotel_id}`}
          defRating={formData.rating}
          tMain={tMain}
        />
      </div>
    </div>
  );
}

export default CreateReview;
