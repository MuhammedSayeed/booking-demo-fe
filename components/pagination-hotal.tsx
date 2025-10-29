"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Hotel } from "@/interfaces/hotel";

function PaginationHotal({
  loading,
  data,
  query,
}: {
  loading: boolean;
  data: {
    count: number;
    next: number | null;
    previous: number | null;
    results: Hotel[];
  };
  query: {
    destination: string;
    checkin: string;
    checkout: string;
    guests: string;
  };
}) {
  const { count, next, previous, results } = data;
  const [page, setpage] = useState("1");
  return (
    <form
      action={`/hotels?destination=${query.destination}&page=${page}`}
      method="GET"
    >
      <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-1">
          {data.previous && (
            <Button
              onClick={() => {
                setpage(String(Number(page) - 1));
              }}
              variant="outline"
              size="icon"
              disabled
            >
              <span className="sr-only">Previous page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
          )}

          {data.next && (
            <Button
              onClick={() => {
                setpage(String(Number(page) + 1));
              }}
              variant="outline"
              size="icon"
            >
              <span className="sr-only">Next page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          )}
        </nav>
      </div>
    </form>
  );
}

export default PaginationHotal;

/**
 next: 2
 previous: 1
 
 */
