"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, Lock, CreditCard, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { User as UserInterface } from "@/interfaces/hotel";

interface ProfileSidebarProps {
  user: UserInterface | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function ProfileSidebar({
  user,
  activeTab,
  onTabChange,
  onLogout,
}: ProfileSidebarProps) {
  const t = useTranslations();

  const navigationItems = [
    {
      id: "profile",
      label: t("Profile"),
      icon: User,
    },
    {
      id: "security",
      label: t("Security"),
      icon: Lock,
    },
    {
      id: "reservations",
      label: t("Reservations"),
      icon: CreditCard,
    },
  ];

  return (
    <div className="w-full md:w-64">
      <Card>
        <CardContent className="p-6">
          {/* User Profile Header */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            {/* <div className="relative">
                <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src="/placeholder.svg?height=96&width=96"
                                    alt="Profile picture"
                                />
                                <AvatarFallback className="text-lg">
                                    {`${user?.first_name?.charAt(0) || ""}${user?.last_name?.charAt(0) || ""
                                        }`}
                                </AvatarFallback>
                            </Avatar>
                <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                            >
                                <Camera className="h-4 w-4" />
                                <span className="sr-only">Change profile picture</span>
                            </Button>
                
              </div> */}
            <div className={`bg-slate-300 rounded-full w-[50px] h-[36px] text-center`}>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-[#967425]">
                  {user?.first_name[0]} {user?.last_name[0]}
                </span>
              </span>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">
                {`${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
                  t("User")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("Member since")} 2023
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {/* {navigationItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={activeTab === item.id ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => onTabChange(item.id)}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        ))} */}

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("Sign Out")}
            </Button>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}
