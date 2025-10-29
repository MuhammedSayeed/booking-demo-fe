"use client";

import React, { useEffect } from "react";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {  Loader2, Menu, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/hooks";
import { usePreviousRoute } from "@/lib/PreviousRouteContext";
import { useThemeData } from "@/context/theme-context";

export function Header() {
  // const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, isLoading, logout } = useAuth();
  // const isAuth = useSelector(isAuthenticated);
  const userInfo = useAppSelector((state) => state.user);
  const isAuth = !!userInfo.id;
  // // console.log(isAuth);
  // console.log(userInfo);

  const { locale } = useParams();
  const tMain = useTranslations();
  // @ts-ignore
  //   const userisAuthenticated = useStore((state) => state.isAuthenticated);
  // // // console.log(userisAuthenticated);

  const pathName = usePathname();
  const previousRoute = usePreviousRoute();
  // console.log("previousRoute", previousRoute);
  const [rerender, setrerender] = useState(previousRoute);
  useEffect(() => {
    // // console.log(pathName);
  }, [pathName, isAuth, user, rerender]);



  const theme = useThemeData()

  return (
    <header className="sticky top-0 z-50 w-full border-b  dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-[#B8902F3b]">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6 w-full py-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>{theme.name}</SheetTitle>
                <SheetDescription>
                  {tMain("HomePage.hero.title1")}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4 justify-center">
                <Link
                  href="/hotels"
                  className="flex items-center gap-2 py-2 text-sm"
                >
                  {tMain("Hotels")}
                </Link>

                <Link
                  href="/hotels"
                  className="flex items-center gap-2 py-2 text-sm"
                >
                  {tMain("Rooms of Hotels")}
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 py-2 text-sm"
                >
                  {tMain("About Us")}
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 py-2 text-sm"
                >
                  {tMain("Contact Us")}
                </Link>
                <div className="border-t pt-4">
                  {isAuth ? (
                    <>
                      <Link
                        href="/auth/profile"
                        className="flex items-center gap-2 py-2 text-sm"
                      >
                        {tMain("My Profile")}
                      </Link>
                      <button
                        className="flex items-center gap-2 py-2 text-sm text-destructive"
                        onClick={() => logout()}
                      >
                        {tMain("Sign Out")}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="flex items-center gap-2 py-2 text-sm"
                      >
                        {tMain("Sign In")}
                      </Link>
                      <Link
                        href="/auth/register"
                        className="flex items-center gap-2 py-2 text-sm"
                      >
                        {tMain("Register")}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 ">
            <img src={theme.logo || ''} alt="travel" className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu
            className="hidden md:flex mx-auto"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/hotels" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {tMain("Hotels")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/hotels" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {tMain("Rooms of Hotels")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {tMain("About Us")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {tMain("Contact Us")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
        
          <button
            onClick={() => {
              const lang = locale !== "ar" ? "ar" : "en";
              const newLocale = locale !== "ar" ? "ar" : "en";
              const pathParts = window.location.pathname.split("/");
              if (pathParts[1] === "ar" || pathParts[1] === "en") {
                pathParts[1] = newLocale;
              } else {
                pathParts.splice(1, 0, newLocale);
              }
              window.location.pathname = pathParts.join("/");
            }}
          >
            {locale !== "ar" ? "العربية" : "English"}
          </button>


          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="User menu"
              >
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : isAuth && user ? (
                  <Avatar className="h-10 w-10">
                    {/* <AvatarImage
                        src={user.avatar || "/hero/hero-5.jpg?height=32&width=32"}
                        alt={user.last_name}
                      /> */}
                    <AvatarFallback>{`${user.first_name.charAt(
                      0
                    )}${user.last_name.charAt(0)}`}</AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuth ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/profile">{tMain("My Profile")}</Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link href="/reservations">{tMain("My Reservations")}</Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                    }}
                  >
                    {tMain("Sign Out")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login"> {tMain("Sign In")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register">{tMain("Register")}</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
