"use client";

import { setChainSlice } from "@/lib/features/chain/chain";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const ClientInitializer = ({ chainData }: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setChainSlice(chainData));
    // console.log(chainData);

    // if (typeof window !== "undefined" && chainData) {
    //   localStorage.setItem("chainData", JSON.stringify(chainData));
    // }
  }, [chainData]);

  return null;
};

export default ClientInitializer;
