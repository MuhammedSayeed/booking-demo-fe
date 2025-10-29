import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/interfaces/hotel";
import BASEURL from "@/context/handleAPIDomain";

interface UseProfileOptions {
    locale: string;
}

interface UseProfileReturn {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useProfile({ locale }: UseProfileOptions): UseProfileReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const storedUser = localStorage.getItem("userData");
            if (!storedUser) {
                throw new Error("User not authenticated");
            }

            const parsedUser = JSON.parse(storedUser);

            const response = await axios.get(
                `${BASEURL}/auth/api/v1/profile/?page=1&lang=${locale}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${parsedUser.tokens.access_token}`,
                        "ngrok-skip-browser-warning": "true"
                    },
                }
            );

            if (response.data?.results?.[0]) {
                setUser(response.data.results[0]);
            } else {
                throw new Error("No profile data found");
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch profile");

            // Remove invalid user data if authentication fails
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                localStorage.removeItem("userData");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            fetchProfile();
        } else {
            setIsLoading(false);
            setError("User not authenticated");
        }
    }, [locale]);

    return {
        user,
        isLoading,
        error,
        refetch: fetchProfile,
    };
} 