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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "./StarRating";

import { FaStar } from "react-icons/fa";

// Define props interface

function HandelReviewCard({ hotel_id }: { hotel_id: string }) {
  // rating
  const [rating, setrating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  const handleClick = (value: number) => {
    setrating(value);
  };

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
  const [review_text, setreview_text] = useState("");

  const getReviewsByHotelId = async () => {
    setstatusForm((priv) => ({
      ...priv,
      loading: true,
    }));

    // reviews/api/v1/retrieve/?hotel=5
    await axios
      .get(url ,{
        headers:{
          "ngrok-skip-browser-warning": "true"
        }
      })
      .then((res) => {
        // // console.log(res.data);
        setallReviewOnSingleHote(res.data);
        setstatusForm((priv) => ({
          ...priv,
          loading: false,
        }));
      })
      .catch((err) => {
        // // console.log("error get review data ", err);
        setstatusForm((priv) => ({
          ...priv,
          error: true,
        }));
      });
  };

  const [myReviewOnSingleHote, setMyReviewOnSingleHote] =
    useState<HotelReview>();

  const [userNotLogin, setuserNotLogin] = useState(false);
  const [userHaveReview, setUserHaveReview] = useState(true);

  const getMyReviewsByHotelId = async () => {
    // reviews/api/v1/retrieve/?hotel=5
    const access_token = JSON.parse(localStorage.getItem("userData") || "null")
      ?.tokens.access_token;
    setstatusForm((priv) => ({
      ...priv,
      loading: true,
    }));
    // // console.log(access_token);
    // // console.log(!access_token);

    if (!access_token) {
      toast({
        title: tMain("Go to Login"),
        description: tMain("Go to Login to be able to make an assessment"),
      });
      setUserHaveReview(false);
      setuserNotLogin(true);
      return;
    }
    await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
          "ngrok-skip-browser-warning": "true"
        },
      })
      .then((res) => {
        setMyReviewOnSingleHote(res.data);
        // // console.log(res.data.results);

        const isHave = res.data.results.find(
          (item: HotelReview) => item.guest_email === user.email
        );

        setUserHaveReview(!!isHave);

        if (res.data.review_text) {
          setstatusForm((priv) => ({
            ...priv,
            loading: false,
          }));
        }
      })
      .catch((err) => {
        // // console.log("error get review data ", err);
        // // console.log(err.response.data?.error);
        setUserHaveReview(false);
        if (
          err.response.data?.error === "You haven't reviewed this hotel yet"
        ) {
          // setUserNotHaveReview(true);
          setstatusForm((priv) => ({
            ...priv,
            loading: false,
            error: true,
          }));
          toast({
            title: err.response.data?.error,
          });
          return;
        }
        setstatusForm((priv) => ({
          ...priv,
          error: true,
        }));
      });
  };
  useEffect(() => {
    getReviewsByHotelId();
    getMyReviewsByHotelId();
  }, [url]);
  const user = useSelector((state: RootState) => state.user);
  // // console.log("is loading ", statusForm.loading);

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
  // @ts-ignore
  if (userNotLogin && allReviewOnSingleHote?.results?.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-muted-foreground">{tMain("Not Found Reviews")}</p>
      </div>
    );
  }
  // // console.log("userHaveReview", userHaveReview);
  // // console.log("userNotLogin", userNotLogin);

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      {!userHaveReview && !userNotLogin ? (
        <div className="my-5" dir={locale === "ar" ? "rtl" : "ltr"}>
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
                  title: tMain(
                    "Review text must be at least 2 characters long"
                  ),
                  variant: "destructive",
                });
                return;
              }
              setstatusForm((priv) => ({
                ...priv,
                loading: true,
              }));
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
                .then(async (res) => {
                  await setUserHaveReview(true);
                  await getReviewsByHotelId();
                  setstatusForm((priv) => ({
                    ...priv,
                    loading: false,
                  }));
                });
            }}
          >
            <div className="flex gap-2 my-2">
              <textarea
                name="review_text"
                onChange={(e) => {
                  setreview_text(e.target.value);
                }}
                rows={4}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:focus-visible:outline-none focus-visible:outline-none text-black dark:text-white"
              ></textarea>
              {/* <input
              type="number"
              name="rating"
              min={1}
              max={5}
              onChange={(e) => {
                setrating(+e.target.value);
              }}
              className="w-20 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
            /> */}
              <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => handleClick(ratingValue)}
                        className="hidden"
                      />
                      <FaStar
                        className={`cursor-pointer text-2xl transition-colors duration-200 ${
                          ratingValue <= (hover || rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mx-3 px-4 py-2 rounded-lg transition-colors"
            >
              {tMain("Submit Review")}
            </button>
          </form>
        </div>
      ) : (
        <></>
      )}
      <>
        {" "}
        {/* My Review (Form) */}
        <div dir={locale === "ar" ? "rtl" : "ltr"}>
          {allReviewOnSingleHote?.results
            .filter((review) => user?.email === review.guest_email)
            .map((review) => (
              <div
                dir={locale === "ar" ? "rtl" : "ltr"}
                key={review.id}
                className="shadow-lg rounded-2xl p-6 border border-yellow-300 dark:border-yellow-600"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold ">{review.guest_email}</h2>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => handleClick(ratingValue)}
                            className="hidden"
                          />
                          <FaStar
                            className={`cursor-pointer text-2xl transition-colors duration-200 ${
                              ratingValue <= (hover || rating || review.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                          />
                        </label>
                      );
                    })}
                  </div>
                  {/* <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </div> */}
                </div>
                <textarea
                  name="review_text"
                  defaultValue={review.review_text}
                  onChange={(e) => {
                    setreview_text(e.target.value);
                  }}
                  rows={4}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:focus-visible:outline-none focus-visible:outline-none text-black dark:text-white"
                ></textarea>
                {/* {user?.email !== review.guest_email && (
                  <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                    {review.review_text}
                  </p>
                )} */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {/* <input
                    type="number"
                    name="rating"
                    min={1}
                    max={5}
                    defaultValue={review.rating}
                    onChange={(e) => {
                      setrating(+e.target.value);
                    }}
                    className="w-20 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
                  /> */}
                </div>
                {user.email === review.guest_email && (
                  <div className="flex gap-5 my-3">
                    <button
                      type="button"
                      onClick={async () => {
                        setstatusForm((priv) => ({
                          ...priv,
                          loading: true,
                        }));
                        if (user?.email === review.guest_email) {
                          const access_token = JSON.parse(
                            localStorage.getItem("userData") || "null"
                          )?.tokens.access_token;
                          setstatusForm((priv) => ({
                            ...priv,
                            loading: true,
                          }));
                          await axios
                            .put(
                              `${BASEURL}/reviews/api/v1/${review.id}/?lang=${locale}`,
                              {
                                hotel: hotel_id,
                                rating: rating === 0 ? review.rating : rating,
                                review_text:
                                  review_text === ""
                                    ? review.review_text
                                    : review_text,
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
                            .then(async (res) => {
                              await getReviewsByHotelId();
                              await getMyReviewsByHotelId();
                              toast({
                                title: tMain("Success"),
                                description:
                                  tMain(
                                    "Rating has been successfully modified"
                                  ) + ".",
                              });
                              setstatusForm((priv) => ({
                                ...priv,
                                loading: false,
                              }));
                            });
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {tMain("Submit Review")}
                    </button>
                    <button
                      onClick={async () => {
                        setrating(0);
                        if (user?.email === review.guest_email) {
                          const access_token = JSON.parse(
                            localStorage.getItem("userData") || "null"
                          )?.tokens.access_token;
                          setstatusForm((priv) => ({
                            ...priv,
                            loading: true,
                          }));
                          await axios
                            .delete(
                              `${BASEURL}/reviews/api/v1/${review.id}/?lang=${locale}`,
                              {
                                headers: {
                                  "Content-Type": "application/json",
                                  Accept: "application/json",
                                  Authorization: `Bearer ${access_token}`,
                                  "ngrok-skip-browser-warning": "true"
                                },
                              }
                            )
                            .then(async (res) => {
                              await getReviewsByHotelId();
                              await getMyReviewsByHotelId();
                              toast({
                                title: tMain("Success"),
                                description:
                                  tMain(
                                    "The review has been successfully deleted"
                                  ) + ".",
                              });
                              setstatusForm((priv) => ({
                                ...priv,
                                loading: false,
                              }));
                            });
                        }
                      }}
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {tMain("Delete Review")}
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
        {/* All Reviews */}
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="grid gap-5 mt-4">
          <h2>
            {tMain("Reviews")} ({allReviewOnSingleHote?.results.length})
          </h2>
          {allReviewOnSingleHote?.results
            .filter((review) => user?.email !== review.guest_email)
            .map((review) => (
              <div
                dir={locale === "ar" ? "rtl" : "ltr"}
                key={review.id}
                style={{ border: "none", borderBottom: "1px solid" }}
                className="shadow-lg rounded-2xl p-6 border border-yellow-300 dark:border-yellow-600"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold ">{review.guest_email}</h2>
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
                {/* (
              <textarea
                name="review_text"
                defaultValue={review.review_text}
                onChange={(e) => {
                  setreview_text(e.target.value);
                }}
                rows={4}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
              ></textarea>
              ) */}
                {user?.email !== review.guest_email && (
                  <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                    {review.review_text}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* {user?.email === review.guest_email ? (
                    <input
                      type="number"
                      name="rating"
                      min={1}
                      max={5}
                      defaultValue={review.rating}
                      onChange={(e) => {
                        setrating(+e.target.value);
                      }}
                      className="w-20 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                  ) : (
                    
                  )} */}
                </div>
                {user.email === review.guest_email && (
                  <div className="flex gap-5 my-3">
                    <button
                      type="button"
                      onClick={async () => {
                        setstatusForm((priv) => ({
                          ...priv,
                          loading: true,
                        }));
                        if (user?.email === review.guest_email) {
                          const access_token = JSON.parse(
                            localStorage.getItem("userData") || "null"
                          )?.tokens.access_token;
                          setstatusForm((priv) => ({
                            ...priv,
                            loading: true,
                          }));
                          await axios
                            .put(
                              `${BASEURL}/reviews/api/v1/${review.id}/?lang=${locale}`,
                              {
                                hotel: hotel_id,
                                rating: rating === 0 ? review.rating : rating,
                                review_text:
                                  review_text === ""
                                    ? review.review_text
                                    : review_text,
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
                            .then(async (res) => {
                              await getReviewsByHotelId();
                              await getMyReviewsByHotelId();
                              setstatusForm((priv) => ({
                                ...priv,
                                loading: false,
                              }));
                            });
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {tMain("Submit Review")}
                    </button>
                    <button
                      onClick={async () => {
                        setrating(0);
                        if (user?.email === review.guest_email) {
                          const access_token = JSON.parse(
                            localStorage.getItem("userData") || "null"
                          )?.tokens.access_token;
                          setstatusForm((priv) => ({
                            ...priv,
                            loading: true,
                          }));
                          await axios
                            .delete(
                              `${BASEURL}/reviews/api/v1/${review.id}/?lang=${locale}`,
                              {
                                headers: {
                                  "Content-Type": "application/json",
                                  Accept: "application/json",
                                  Authorization: `Bearer ${access_token}`,
                                  "ngrok-skip-browser-warning": "true"
                                },
                              }
                            )
                            .then(async (res) => {
                              await getReviewsByHotelId();
                              await getMyReviewsByHotelId();
                              setstatusForm((priv) => ({
                                ...priv,
                                loading: false,
                              }));
                            });
                        }
                      }}
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {tMain("Delete Review")}
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
        {!statusForm.loading && (
          <div style={{ marginTop: "20px" }}>
            {allReviewOnSingleHote?.previous && (
              <button
                onClick={() => {
                  setUrl(`${allReviewOnSingleHote.previous}`);
                  statusForm.loading = true;
                }}
                className="mr-2 bg-[#957428] hover:bg-[#9b8548] text-white p-2 rounded transition"
              >
                {tMain("Previous")}
              </button>
            )}
            {allReviewOnSingleHote?.next && (
              <button
                className="mr-2 bg-[#957428] hover:bg-[#9b8548] text-white p-2 rounded transition"
                onClick={() => {
                  setUrl(`${allReviewOnSingleHote.next}`);
                  statusForm.loading = true;
                }}
              >
                {tMain("Next")}
              </button>
            )}
          </div>
        )}
      </>
    </div>
  );
}

export default HandelReviewCard;
