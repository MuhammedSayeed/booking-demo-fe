"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function VerifyOTPPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(3000);
  const [canResend, setCanResend] = useState(false);

  // Create refs for each OTP input
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Only allow one digit
    if (value.length > 1) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Focus the last input
      inputRefs[5].current?.focus();
    }
  };
  const tMain = useTranslations();
  const { locale } = useParams();

  const [errors, seterrors] = useState([""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");

    // Check if OTP is complete
    if (otpValue.length !== 6) {
      toast({
        title: "Incomplete OTP",
        description: "Please enter the complete 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }
    // get email from query params
    const email = new URLSearchParams(window.location.search).get("email");
    setIsLoading(true);

    // Simulate API call
    await await axios
      .post(
        `${BASEURL}/auth/api/v1/verify-verification-otp/?lang=${locale}`,
        {
          email,
          otp: otpValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true"
          },
        }
      )
      .then((response) => {
        // // // console.log(response);
        setIsLoading(false);

        toast({
          title: "تم التحقيق بنجاح",
          description: "تم التحقق من الحساب بنجاح",
        });

        // Redirect to login
        router.push("/auth/login");
      })
      .catch((error) => {
        setIsLoading(false);

        // // // console.log(error);
        const firstKey = Object.keys(error.response.data)[0];

        seterrors((priv) => [...priv, error.response.data[firstKey]]);
      });
  };

  // const handleResendOTP = async () => {
  //   setIsResending(true)

  //   try {
  //     // Simulate API call to resend OTP
  //     await new Promise((resolve) => setTimeout(resolve, 1500))

  //     // Reset countdown and disable resend button
  //     setCountdown(60)
  //     setCanResend(false)

  //     toast({
  //       title: "OTP Resent",
  //       description: "A new verification code has been sent to your email.",
  //     })
  //   } catch (error) {
  //     toast({
  //       title: "Failed to resend OTP",
  //       description: "There was an error sending a new verification code. Please try again.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsResending(false)
  //   }
  // }

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="container max-w-md py-12"
    >
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {tMain("Verify your account")}
          </CardTitle>
          <CardDescription className="text-center">
            {tMain("Enter the 6-digit code sent to your email address")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg !focus-visible:outline-primary border-primary"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  autoFocus={index === 0}
                  required
                />
              ))}
            </div>
            {errors.map((error) => (
              <p key={error} className="text-xs text-red-500">
                {error}
              </p>
            ))}
            <Button
              type="submit"
              className="w-full bg-primary "
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tMain("Verifying")}...
                </>
              ) : (
                tMain("Verify Account")
              )}
            </Button>
          </form>

          {/* <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              {canResend ? (
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={handleResendOTP}
                  disabled={isResending}
                >
                  {isResending ? "Resending..." : "Resend code"}
                </Button>
              ) : (
                <span className="text-muted-foreground">
                  Resend code in {countdown}s
                </span>
              )}
            </p>
          </div> */}
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
