"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  //         localStorage.setItem("userData", JSON.stringify(response.data));

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "null");
    if (!isLoading && !userData) {
      const pagesRedirect = location.pathname.split("/");

      if (
        pagesRedirect.includes("profile") ||
        pagesRedirect.includes("checkout") ||
        pagesRedirect.includes("payment")
      ) {
        
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
        router.push("/auth/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
