"use client";

import type React from "react";

import { useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTranslations } from "next-intl";
import axios from "axios";
import BASEURL from "@/context/handleAPIDomain";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

// Define Zod schema for form validation
const registerSchema = z.object({
  firstName: z
    .string()
    .min(3, "First Name should be at least 3 characters")
    .max(50, "First Name should not exceed 50 characters"),
  lastName: z
    .string()
    .min(3, "Last Name should be at least 3 characters")
    .max(50, "Last Name should not exceed 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter Valid Email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password should not exceed 100 characters")
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password must contain at least one number",
    })
    .refine((password) => /[^A-Za-z0-9]/.test(password), {
      message: "Password must contain at least one special character (!@#$%^&*)",
    })
    .refine((password) => !/\s/.test(password), {
      message: "Password cannot contain spaces",
    })
    .refine((password) => {
      // Check against common weak passwords
      const commonPasswords = [
        "password", "123456", "123456789", "12345678", "12345", "1234567",
        "password123", "admin", "qwerty", "abc123", "letmein", "welcome",
        "monkey", "1234567890", "dragon", "111111", "123123", "password1",
        "qwerty123", "123321", "654321", "superman", "1qaz2wsx", "master",
        "hello", "freedom", "whatever", "qazwsx", "trustno1", "jordan23",
      ];
      return !commonPasswords.includes(password.toLowerCase());
    }, {
      message: "Password is too common. Please choose a stronger password",
    })
    .refine((password) => {
      // Check for repeated characters (like aaa, 111)
      return !/(.)\1{2,}/.test(password);
    }, {
      message: "Password cannot contain more than 2 repeated characters in a row",
    }),
  agreeTerms: z.boolean().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Password strength utility function
const getPasswordStrength = (password: string) => {
  const checks = [
    { test: password.length >= 8, label: "At least 8 characters" },
    { test: /[A-Z]/.test(password), label: "One uppercase letter" },
    { test: /[a-z]/.test(password), label: "One lowercase letter" },
    { test: /[0-9]/.test(password), label: "One number" },
    { test: /[^A-Za-z0-9]/.test(password), label: "One special character" },
  ];

  const passedChecks = checks.filter(check => check.test).length;
  const strength = Math.round((passedChecks / checks.length) * 100);

  return {
    strength,
    checks,
    level: passedChecks < 2 ? "weak" : passedChecks < 4 ? "medium" : "strong"
  };
};

// Password Strength Indicator Component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const { strength, checks, level } = getPasswordStrength(password);

  const getStrengthColor = () => {
    if (level === "weak") return "bg-red-500";
    if (level === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (level === "weak") return "Weak";
    if (level === "medium") return "Medium";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${level === "weak" ? "text-red-600" :
          level === "medium" ? "text-yellow-600" : "text-green-600"
          }`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${check.test ? "bg-green-500" : "bg-gray-300"
              }`} />
            <span className={`text-xs ${check.test ? "text-green-600" : "text-gray-500"
              }`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Server Error Display Component
const ServerErrorAlert = ({ errors }: { errors: string[] }) => {
  if (!errors.length) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Registration Failed
          </h3>
          <div className="space-y-1">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-700">
                • {error}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const tMain = useTranslations();
  const { locale } = useParams();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      agreeTerms: false,
    },
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    // If already authenticated, redirect to profile
    if (userData) {
      const pagesRedirect = location.pathname.split("/");

      if (
        pagesRedirect.includes("profile") ||
        pagesRedirect.includes("checkout") ||
        pagesRedirect.includes("payment")
      ) {
        router.push("/auth/profile");
      }
    }
  }, [router]);

  // If already authenticated, redirect to profile
  if (isAuthenticated) {
    router.push("/auth/profile");
    return null;
  }

  const onSubmit = async (data: RegisterFormData) => {
    setServerErrors([]);

    try {
      await axios.post(
        `${BASEURL}/auth/api/v1/register/?lang=${locale}`,
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          is_verified: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      toast({
        title: tMain("Successfully registered"),
        description: tMain(
          "Registration successful Please check your email"
        ),
      });

      // Redirect to profile page
      router.push("/auth/verify-otp?email=" + data.email);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const firstKey = Object.keys(error.response.data.errors)[0];
        const errorMessages = error.response.data.errors[firstKey];

        if (Array.isArray(errorMessages)) {
          setServerErrors(errorMessages);
        } else {
          setServerErrors([errorMessages]);
        }

        // Set field-specific errors if they match form fields
        if (firstKey === "email") {
          form.setError("email", { message: errorMessages[0] || errorMessages });
        } else if (firstKey === "password") {
          form.setError("password", { message: errorMessages[0] || errorMessages });
        } else if (firstKey === "first_name") {
          form.setError("firstName", { message: errorMessages[0] || errorMessages });
        } else if (firstKey === "last_name") {
          form.setError("lastName", { message: errorMessages[0] || errorMessages });
        }
      } else {
        toast({
          title: tMain("Registration failed"),
          description: tMain(
            "There was an error creating your account Please try again"
          ),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="container max-w-md py-12"
    >
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {tMain("Create an account")}
          </CardTitle>
          <CardDescription className="text-center">
            {tMain("Enter your information to create an account")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tMain("First Name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={locale === "ar" ? "اسم الاول" : "first name"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tMain("Last Name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={locale === "ar" ? "اسم الاخير" : "last name"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tMain("Email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tMain("Password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={`absolute ${locale === "ar" ? "left" : "right"
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
                    </FormControl>
                    <PasswordStrengthIndicator password={field.value || ""} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ServerErrorAlert errors={serverErrors} />

              <Button
                type="submit"
                className="w-full bg-primary  text-white"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tMain("Create account")}...
                  </>
                ) : (
                  tMain("Create account")
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-4 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-2 text-xs text-muted-foreground">
              {tMain("OR")}
            </span>
            <Separator className="flex-1" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            {tMain("Already have an account?")}{" "}
            <Link href="/auth/login" className="hover:underline text-primary">
              {tMain("Sign In")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
