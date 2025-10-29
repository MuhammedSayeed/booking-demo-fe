"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";
import ProfileForm from "@/components/profile/profile-form";
import SecurityForm from "@/components/profile/security-form";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import MyReservations from "@/components/MyReservations";
import { Button } from "@/components/ui/button";
import { usePreviousRoute } from "@/lib/PreviousRouteContext";

export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("profile");
  // console.log(activeTab);
  const previous = usePreviousRoute();
  useEffect(() => {
    if (typeof window !== "undefined") {
      // console.log(previous, "previous route");

      if (`${previous}`.includes("checkout")) {
        // If coming from checkout, set active tab to reservations
        setActiveTab("reservations");
      }
    }
  }, []);

  // Use custom hook for profile data
  const { user, isLoading, error, refetch } = useProfile({
    locale: locale as string,
  });

  const handleLogout = () => {
    logout();
    toast({
      title: t("Logged out"),
      description: t("You have been successfully logged out"),
    });
    router.push("/");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleProfileUpdate = () => {
    // Refetch profile data after successful update
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("Loading")}...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive">
            {t("Error")}: {error}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            {t("Try Again")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="container py-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <ProfileSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">{t("Profile")}</TabsTrigger>
              <TabsTrigger value="security">{t("Security")}</TabsTrigger>
              <TabsTrigger value="reservations">
                {t("Reservations")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <ProfileForm user={user} onSuccess={handleProfileUpdate} />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <SecurityForm user={user} />
            </TabsContent>

            <TabsContent value="reservations" className="mt-6">
              <div dir={locale === "ar" ? "rtl" : "ltr"}>
                <MyReservations />
                <div className="text-center py-8">
                  <Button
                    className="mt-4 bg-primary  text-white"
                    asChild
                  >
                    <a href="/hotels">{t("Browse Hotels")}</a>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
