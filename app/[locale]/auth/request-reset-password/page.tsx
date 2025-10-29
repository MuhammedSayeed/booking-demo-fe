"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import axios from "axios";
import BASEURL from "@/context/handleAPIDomain";

export default function RequestResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const tMain = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.length <= 0) {
      toast({
        title: tMain("Request failed"),
        description: tMain("Please enter your email") + ".",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      // Simulate API call to /auth/api/v1/request-reset-password/
      await axios
        .post(`${BASEURL}/auth/api/v1/request-reset/?lang=${locale}`, { email } , {
          headers :{
            "ngrok-skip-browser-warning": "true"
          }
        })
        .then((res) => {
          toast({
            title: tMain("Reset OTP Code Sent"),
            description: tMain(
              "Check your email for a OTP code to reset your password"
            ),
          });

          // Redirect to reset password confirm page
          router.push("/auth/reset-password-confirm?email=" + email);
        })
        .catch((err) => {
          toast({
            title: err.response.data.error,
            description: tMain("Go to register page to create a new account"),
            variant: "destructive",
          });

          // Redirect to reset password confirm page
          router.push("/auth/register");
        });
      // Simulate successful request
    }  finally {
      setIsLoading(false);
    }
  };
  const { locale } = useParams();
  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="container max-w-md py-12"
    >
      <Card dir={locale === "ar" ? "rtl" : "ltr"}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {tMain("Reset your password")}
          </CardTitle>
          <CardDescription className="text-center">
            {tMain("Enter your email to receive a link to reset your password")}
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{tMain("Email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary  text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tMain("Sending reset link")}...
                </>
              ) : (
                tMain("Send code link")
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="text-primary hover:underline">
              {tMain("Back to login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
