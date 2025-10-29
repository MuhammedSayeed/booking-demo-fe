"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Loader2, Camera, User, Lock, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { CountryInterface, User as UserInterFace } from "@/interfaces/hotel";
import { useTranslations } from "next-intl";
import { countrysData } from "@/context/countrys-data";
import BASEURL from "@/context/handleAPIDomain";
function FormProfile({ user }: { user: UserInterFace | null }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const { locale } = useParams();
  const tMain = useTranslations();

  const [profileData, setProfileData] = useState<UserInterFace>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    country_details: {
      code: user?.country_details?.code || "",
      id: user?.country_details?.id || -1,
      name: user?.country_details?.name || "",
      nationality: user?.country_details?.nationality || "",
      phone_code: user?.country_details?.phone_code || "",
    },
    created_at: user?.created_at || "",
    date_of_birth: user?.date_of_birth || "",
    id: user?.id || -1,
    passport_number: user?.passport_number || "",
    updated_at: user?.updated_at || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [phone, setPhone] = useState(
    `${user?.phone === null ? "" : user?.phone}`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const {
      address,
      country_details,
      date_of_birth,
      email,
      first_name,
      last_name,
      id,
      passport_number,
    } = profileData;
    const access_token = JSON.parse(localStorage.getItem("userData") || "null")
      ?.tokens.access_token;
    // console.log("befor submit ", country_details);

    try {
      // Simulate API call
      const res = await axios.put(
        `${BASEURL}/auth/api/v1/profile/${id}/?lang=${locale}`,
        {
          address,
          country: +`${country_details.id}`,
          date_of_birth,
          email,
          first_name,
          last_name,
          id,
          passport_number,
          phone: phone ? `+${phone}` : "",
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "ngrok-skip-browser-warning": "true"
          },
        }
      );
      // // console.log(res);

      toast({
        title: tMain("Profile updated"),
        description:
          tMain("Your profile information has been updated successfully") + ".",
      });
    } catch (error) {
      toast({
        title: tMain("Update failed"),
        description:
          tMain("There was an error updating your profile Please try again") +
          ".",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">{tMain("First Name")}</Label>
          <Input
            id="first_name"
            name="first_name"
            value={`${
              profileData?.first_name === null ? "" : profileData?.first_name
            }`}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">{tMain("Last Name")}</Label>
          <Input
            id="last_name"
            name="last_name"
            value={`${
              profileData?.last_name === null ? "" : profileData?.last_name
            }`}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{tMain("Email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={profileData?.email}
          onChange={handleChange}
          disabled
        />
        <p className="text-xs text-muted-foreground">
          {tMain("Enter your email and password to access your account")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{tMain("Phone Number")}</Label>
        <div dir="ltr">
          <PhoneInput
            country={"sa"} // السعودية كقيمة مبدئية
            value={phone}
            onChange={(phone) => setPhone(phone.slice(0, 12))}
            enableSearch
            inputStyle={{ width: "100%" }}
            localization={{ sa: "السعودية" }}
            inputClass="dark:!bg-transparent !border-1 !border-[#1e293b] !outline-none dark:!text-white "
          />
          {/* <Input
            id="phone"
            name="phone"
            value={`${profileData?.phone === null ? "" : profileData?.phone}`}
            onChange={handleChange}
          /> */}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{tMain("Address")}</Label>
        <Input
          id="address"
          name="address"
          value={`${profileData?.address === null ? "" : profileData?.address}`}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">{tMain("Country")}</Label>
        <Select
          onValueChange={(e) => {
            // @ts-ignore
            const countrySelected: CountryInterface = countrysData.find(
              (country) => country.id === +e
            );
            // console.log("countrySelected", countrySelected);

            setProfileData((prev) => ({
              ...prev,
              ["country_details"]: countrySelected,
            }));
          }}
          name="country"
          defaultValue={`${
            profileData?.country_details.id === null
              ? ""
              : countrysData.find(
                  (country) => country.id === profileData?.country_details.id
                )?.id
          }`}
        >
          <SelectTrigger className="dark:text-white">
            <SelectValue placeholder={tMain("Number of guests")} />
          </SelectTrigger>
          <SelectContent>
            {countrysData.map((country: CountryInterface) => (
              <SelectItem key={country.id} value={`${country.id}`}>
                {country.name} ({country.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* <Input
          id="country"
          name="country"
          value={`${profileData?.country === null ? "" : profileData?.country}`}
          onChange={handleChange}
        /> */}
      </div>
      <div className="space-y-2">
        <Label htmlFor="passport_number">{tMain("Passport Number")}</Label>
        <Input
          id="passport_number"
          name="passport_number"
          value={`${
            profileData?.passport_number === null
              ? ""
              : profileData?.passport_number
          }`}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date_of_birth">{tMain("Date of birth")}</Label>
        <Input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          value={`${
            profileData?.date_of_birth === null
              ? ""
              : profileData?.date_of_birth
          }`}
          onChange={handleChange}
        />
      </div>

      {/* <div className="space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        name="bio"
        value={user.bio}
        onChange={handleChange}
        rows={4}
      />
    </div> */}

      <Button
        type="submit"
        className="bg-primary  text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {tMain("Saving changes")}...
          </>
        ) : (
          tMain("Save Changes")
        )}
      </Button>
    </form>
  );
}

export default FormProfile;
