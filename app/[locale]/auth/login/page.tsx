"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearUser, setUser } from "@/lib/features/user/userSlice";
import BASEURL from "@/context/handleAPIDomain";
import { usePreviousRoute } from "@/lib/PreviousRouteContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const previousRoute = usePreviousRoute();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "null");
    // // // console.log("userData", userData);
    // // // console.log(!!userData);

    // If already authenticated, redirect to profile
    if (userData) {
      router.push("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, seterrors] = useState([""]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seterrors([""]);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  const dispatch = useAppDispatch();

  const tMain = useTranslations();
  const { locale } = useParams();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    if (email.length < 3 || password.length < 7) {
      seterrors([
        `${tMain("Enter Valid Email")}`,
        `${tMain("Enter Valid Password")}`,
      ]);
      return;
    }
    setIsLoading(true);
    // console.log("BASEURL", BASEURL);

    await axios
      .post(
        `${BASEURL}/auth/api/v1/login/?lang=${locale}`,
        {
          email: formData.email,
          password: formData.password, //formData.password
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        // // // console.log(response);
        setIsLoading(false);
        dispatch(setUser(response.data));
        localStorage.setItem("userData", JSON.stringify(response.data));
        toast({
          title: tMain("Login successful"),
          description: "",
        });
        // 'https://the-maysane.vercel.app/en/hotels/5x475s'.split('/').includes('the-maysane.vercel.app') => true
        // Redirect to profile page

        // if (document.referrer.split("/").includes(window.location.host)) {

        // router.push(previousRoute as string);
        if (previousRoute === null || previousRoute === "null") {
          window.location.href = "/";
          return;
        }
        window.location.href = previousRoute as string;
        // } else {
        //   router.push("/");
        // }
        // window.location.reload();
      })
      .catch((error) => {
        const firstKey = Object.keys(error.response.data)[0];

        // // // console.log(error);
        seterrors((priv) => [...priv, error.response.data[firstKey]]);
      });
    setIsLoading(false);
  };

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="container max-w-md py-12"
    >
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {tMain("Sign in to your account")}
          </CardTitle>
          <CardDescription className="text-center">
            {tMain("Enter your email and password to access your account")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{tMain("Email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{tMain("Password")}</Label>
                <Link
                  href="/auth/request-reset-password"
                  className="text-sm text-primary hover:underline"
                >
                  {tMain("Forgot password?")}
                </Link>
              </div>
              <div className="relative">
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
                  className={`absolute ${
                    locale === "ar" ? "left" : "right"
                  }-0 top-0 h-full px-3`}
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
            </div>
            {/* <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me for 30 days
              </Label>
            </div> */}
            {errors.map((error) => (
              <p
                key={`${Math.random()}+${error}`}
                className="text-xs text-red-500"
              >
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
                  {tMain("Sign in")}...
                </>
              ) : (
                tMain("Sign in")
              )}
            </Button>
          </form>

          <div className="mt-4 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-2 text-xs text-muted-foreground">
              {tMain("OR")}
            </span>
            <Separator className="flex-1" />
          </div>

          {/* <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              Facebook
            </Button>
          </div> */}
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            {tMain("Dont have an account?")}{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              {tMain("Sign up")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
