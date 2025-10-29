"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { User } from "@/interfaces/hotel";
import { useState } from "react";
import axios from "axios";
import BASEURL from "@/context/handleAPIDomain";
import { useParams } from "next/navigation";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "@/lib/validations/profile";

interface ProfileFormProps {
  user: User | null;
  onSuccess?: () => void;
}

export default function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useParams();
  const t = useTranslations();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      passport_number: user?.passport_number || "",
      date_of_birth: user?.date_of_birth || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) {
        throw new Error("User not authenticated");
      }

      const parsedUser = JSON.parse(storedUser);

      await axios.put(
        `${BASEURL}/auth/api/v1/profile/${user?.id}/?lang=${locale}`,
        {
          ...data,
          email: user?.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${parsedUser.tokens.access_token}`,
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      toast({
        title: t("Success"),
        description: t("Profile updated successfully"),
      });

      onSuccess?.();
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: t("Error"),
        description: t("Failed to update profile, Please try again"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card dir={locale === "ar" ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle>{t("Profile Information")}</CardTitle>
        <CardDescription>
          {t("Update your personal information and preferences")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("First Name")} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter first name")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Last Name")} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter last name")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Phone Number")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter phone number")}
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Address")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("Enter your address")}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="passport_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Passport Number")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Enter passport number")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Date of Birth")}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={
                          new Date(
                            new Date().setFullYear(
                              new Date().getFullYear() - 18
                            )
                          )
                            .toISOString()
                            .split("T")[0]
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary  text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("Update Profile")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
