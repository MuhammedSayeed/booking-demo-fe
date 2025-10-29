"use client";

import { toast } from "@/hooks/use-toast";
import { User } from "@/interfaces/hotel";
import { clearUser, setUser } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import BASEURL from "./handleAPIDomain";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userData: Omit<User, "id"> & { password: string }
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { locale } = useParams();
  // @ts-ignore
  // const userisAuthenticated = useStore((state) => state.isAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUserData = localStorage.getItem("userData");
    const parsedUser = storedUserData ? JSON.parse(storedUserData) : null;

    if (!parsedUser) return;


    if (parsedUser) {

      const getData = async () => {
        await axios
          .get(`${BASEURL}/auth/api/v1/profile/?page=1&lang=${locale}`, {
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${parsedUser.tokens.access_token}`,
            },
          })
          .then((res) => {
            // // console.log(res);
            setUserState(res.data.results[0]);

            dispatch(setUser(res.data.results[0] as User));
            setIsAuthenticated(true);
            setIsLoading(false);
          })
          .catch(async (err) => {
            // // console.log(err);
            const pagesRedirect = location.pathname.split("/");
            console.log(err.response);

            const isTokenExpired =
              err.response.data.messages[0].message === "Token is expired";
            // console.log("isTokenExpired: ", isTokenExpired);

            if (isTokenExpired) {
              const refresh_token = parsedUser.tokens.refresh_token;
              // console.log("refresh_token: ", refresh_token);

              await axios
                .post(`${BASEURL}/auth/api/v1/refresh/?lang=${locale}`, {
                  refresh_token,
                }, {
                  headers: {
                    "ngrok-skip-browser-warning": "true"
                  }
                })
                .then((resRefreshToken) => {
                  // console.log("resRefreshToken: ", resRefreshToken);
                  setUserState(resRefreshToken.data.results[0]);

                  dispatch(setUser(resRefreshToken.data.results[0] as User));
                  setIsAuthenticated(true);
                  setIsLoading(false);
                })
                .catch((errorRefreshToken) => {
                  // console.log("errorRefreshToken: ", errorRefreshToken);

                  dispatch(clearUser());

                  const haveDate = errorRefreshToken.response?.data || null;
                  if (haveDate) {
                    toast({
                      title:
                        errorRefreshToken.response.data.detail ||
                        "خطأ في تسجيل الدخول",
                      variant: "destructive",
                    });
                  } else {
                    toast({
                      title:
                        errorRefreshToken.response.detail ||
                        "خطأ في تسجيل الدخول",
                      variant: "destructive",
                    });
                  }
                  localStorage.removeItem("userData");
                  setIsLoading(false);
                  if (
                    pagesRedirect.includes("profile") ||
                    pagesRedirect.includes("checkout") ||
                    pagesRedirect.includes("payment")
                  ) {
                    window.location.replace("/auth/login");
                  }
                });
              return;
            }
            // console.log(err.response.data);

            dispatch(clearUser());

            toast({
              title: err.response.data.detail || "خطأ في تسجيل الدخول",
              variant: "destructive",
            });
            localStorage.removeItem("userData");
            setIsLoading(false);
            if (
              pagesRedirect.includes("profile") ||
              pagesRedirect.includes("checkout") ||
              pagesRedirect.includes("payment")
            ) {
              window.location.replace("/auth/login");
            }
          });
      };
      getData();
    }
    // // // console.log(user);

    setIsLoading(false);
  }, []);

  const login = async () => {
    // setIsAuthenticated(true);
    // setIsLoading(true);
    // try {
    //   // Simulate API call
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   // For demo purposes, we'll accept any email/password
    //   // In a real app, this would validate credentials with a backend
    //   const mockUser: User = {
    //     id: "user-1",
    //     firstName: "John",
    //     lastName: "Doe",
    //     email: email,
    //     avatar: "/placeholder.svg?height=96&width=96",
    //   };
    //   setUser(mockUser);
    //   setIsAuthenticated(true);
    //   localStorage.setItem("user", JSON.stringify(mockUser));
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const register = async (
    userData: Omit<User, "id"> & { password: string }
  ) => {
  };

  const logout = () => {
    setUserState(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userData");
    dispatch(clearUser());
  };
  // // console.log("isAuthenticated", isAuthenticated);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
