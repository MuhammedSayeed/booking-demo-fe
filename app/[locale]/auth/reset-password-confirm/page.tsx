"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import axios from "axios";
import BASEURL from "@/context/handleAPIDomain";

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tMain = useTranslations();

  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const { locale } = useParams();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.otp.length !== 6) {
      toast({
        title: tMain("Please enter a valid OTP"),
        description: tMain("Please enter a valid OTP from your email") + ".",
        variant: "destructive",
      });
      return;
    }
    if (formData.password.length < 8) {
      toast({
        title: tMain("Please enter a valid password"),
        description: tMain("Password must be greater than 8 characters") + ".",
        variant: "destructive",
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: tMain("Passwords don't match"),
        description: tMain("Please make sure your passwords match") + ".",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const email = new URLSearchParams(window.location.search).get("email");

    try {
      // Simulate API call to /auth/api/v1/verify-reset-password-otp/
      await axios
        .post(
          `${BASEURL}/auth/api/v1/verify-reset-password-otp/?lang=${locale}`,
          { email, otp: formData.otp },{
            headers :{
              "ngrok-skip-browser-warning": "true"
            }
          }
        )
        .then(async (res) => {
          // the otp is correct and the new password is correct // auth/api/v1/reset-password
          await axios
            .post(`${BASEURL}/auth/api/v1/reset-password/?lang=${locale}`, {
              email,
              new_password: formData.password,
            },{
              headers:{
                "ngrok-skip-browser-warning": "true"
              }
            })
            .then((resUpdatePassword) => {
              // console.log("resUpdatePassword", resUpdatePassword);

              // Message saccess update password
              toast({
                title: resUpdatePassword.data.message,
              });
              router.push("/auth/login");
            })
            .catch((errUpdatePassword) => {
              // check is this err.response.data.error[0] array or not

              toast({
                title:
                  errUpdatePassword.response.data.error ||
                  errUpdatePassword.response.data.error[0],
                variant: "destructive",
              });
              setFormData({
                otp: "",
                password: "",
                confirmPassword: "",
              });
            });

          // Redirect to reset password confirm page
        })
        .catch((err) => {
          // check is this err.response.data.error[0] array or not

          toast({
            title: err.response.data.error || err.response.data.error[0],
            variant: "destructive",
          });
          setFormData({
            otp: "",
            password: "",
            confirmPassword: "",
          });
        });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    // console.log(email);

    if (!email) {
      toast({
        title: tMain("Please Enter Your Email"),
        variant: "destructive",
      });
      router.push("/auth/request-reset-password");
    }
  }, []);

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="container max-w-md py-12"
    >
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {tMain("Create new password")}
          </CardTitle>
          <CardDescription className="text-center">
            {tMain(
              "Enter the OTP sent to your email and create a new password"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">{tMain("Verification Code (OTP)")}</Label>
              <Input
                id="otp"
                name="otp"
                placeholder={tMain("Enter 6-digit code")}
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{tMain("New Password")}</Label>
              <div dir={locale !== "ar" ? "rtl" : "ltr"} className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {tMain(
                  "Password must be at least 8 characters long and include a mix of letters, numbers, and symbols"
                )}
                .
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {tMain("Confirm New Password")}
              </Label>
              <div dir={locale !== "ar" ? "rtl" : "ltr"} className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary  text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tMain("Resetting password")}...
                </>
              ) : (
                tMain("Reset Password")
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
