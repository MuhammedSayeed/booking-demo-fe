"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { User } from "@/interfaces/hotel";
import { useState } from "react";
import axios from "axios";
import BASEURL from "@/context/handleAPIDomain";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { passwordFormSchema, type PasswordFormValues } from "@/lib/validations/profile";

interface SecurityFormProps {
    user: User | null;
}

export default function SecurityForm({ user }: SecurityFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { locale } = useParams();
    const router = useRouter();
    const { logout } = useAuth();
    const t = useTranslations();

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: PasswordFormValues) {
        setIsLoading(true);

        try {
            await axios.post(`${BASEURL}/auth/api/v1/reset-password/?lang=${locale}`, {
                email: user?.email,
                new_password: data.newPassword,
            },{
              headers :{
                "ngrok-skip-browser-warning": "true"
              }
            });

            toast({
                title: t("Success"),
                description: t("Password updated successfully Please log in again"),
            });

            // Clear form
            form.reset();

            // Logout user and redirect to login
            logout();
            router.push("/auth/login");
        } catch (error: any) {
            console.error("Password update error:", error);

            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.error?.[0] ||
                t("Failed to update password Please try again");

            toast({
                title: t("Error"),
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
      <Card dir={locale === "ar" ? "rtl" : "ltr"}>
        <CardHeader>
          <CardTitle>{t("Security Settings")}</CardTitle>
          <CardDescription>
            {t("Manage your password and account security")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Email (readonly) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Email")}</label>
              <Input value={user?.email || ""} disabled />
            </div>

            {/* Password Update Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("New Password")} *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("Enter new password")}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Confirm New Password")} *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("Confirm new password")}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showConfirmPassword
                                ? "Hide password"
                                : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>{t("Password requirements")}:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>{t("At least 8 characters long")}</li>
                      <li>{t("Contains uppercase and lowercase letters")}</li>
                      <li>{t("Contains at least one number")}</li>
                      <li>{t("Contains at least one special character")}</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary  text-white"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("Update Password")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    );
} 