"use client";
import Link from "next/link";
import { Bed, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useThemeData } from "@/context/theme-context";

export function Footer() {
  const tMain = useTranslations();
  const { locale } = useParams();

  const theme = useThemeData();
  return (
    <footer dir={locale === "ar" ? "rtl" : "ltr"} className="bg-muted mt-8">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src={theme.logo || ''} className="h-10" />
            </Link>
            
            <div className="flex space-x-4">
              {theme.facebook && (
                <Link
                  href={theme.facebook}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">{tMain("Facebook")}</span>
                </Link>
              )}
              
              {theme.instagram && (
                <Link
                  href={theme.instagram}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">{tMain("Instagram")}</span>
                </Link>
              )}
              
            </div>
          </div>


          <div>
            <h3 className="font-semibold text-lg mb-4">
              {tMain("Contact Info")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/contact`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {tMain("Contact Us")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/contact`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {tMain("About")}
                </Link>
              </li>
              {theme.email && (
                <li>
                  <a
                    href={`mailto:${theme.email}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {theme.email}
                  </a>
                </li>
              )}
              {theme.phone_number && (
                <li>
                  <a
                    href={`tel:${theme.phone_number}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {tMain("Phone")}: {theme.phone_number}
                  </a>
                </li>
              )}
              {theme.mobile_number && (
                <li>
                  <a
                    href={`tel:${theme.mobile_number}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {tMain("Mobile")}: {theme.mobile_number}
                  </a>
                </li>
              )}
              {theme.whatsapp_number && (
                <li>
                  <a
                    href={`https://wa.me/${theme.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    {tMain("WhatsApp")}
                  </a>
                </li>
              )}
              {theme.website && (
                <li>
                  <a
                    href={theme.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    {tMain("Website")}
                  </a>
                </li>
              )}
              {theme.facebook && (
                <li>
                  <a
                    href={theme.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Facebook
                  </a>
                </li>
              )}
              {theme.instagram && (
                <li>
                  <a
                    href={theme.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {tMain("Important Links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/hotels`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {tMain("Hotels")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/login`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {tMain("Login")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/register`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {tMain("Register")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="border-y border-solid border-dark/10">
            <div className="container mx-auto flex items-center justify-center gap-8 px-6 py-2 lg:px-10">
              <img
                alt="mada"
                src="https://www.wosolgroup.com/images/mada.svg"
                width="70"
                height="34"
                decoding="async"
                className="object-cover"
                loading="lazy"
                style={{ color: "transparent" }}
              />
              <img
                alt="mastercard"
                src="https://joodbooing.blob.core.windows.net/joodbooking/joodbooking_b2c_media/askant/mastercard_e8t3g7.svg"
                srcSet="https://joodbooing.blob.core.windows.net/joodbooking/joodbooking_b2c_media/askant/mastercard_e8t3g7.svg 1x, https://joodbooing.blob.core.windows.net/joodbooking/joodbooking_b2c_media/askant/mastercard_e8t3g7.svg 2x"
                width="51"
                height="34"
                decoding="async"
                className="object-cover"
                loading="lazy"
                style={{ color: "transparent" }}
              />
              <img
                alt="visa"
                src="https://joodbooing.blob.core.windows.net/joodbooking/joodbooking_b2c_media/askant/visa_auc57a.svg"
                srcSet="https://joodbooing.blob.core.windows.net/joodbooking/joodbooking_b2c_media/askant/visa_auc57a.svg 1x, https://joodbooing.blob.core.windows.net/joodbooking/joodbooking_b2c_media/askant/visa_auc57a.svg 2x"
                width="51"
                height="34"
                decoding="async"
                className="object-cover"
                loading="lazy"
                style={{ color: "transparent" }}
              />
              <img
                alt="apple pay"
                src="https://www.wosolgroup.com/_next/image/?url=%2Fimages%2Fapple-pay.png&w=64&q=75"
                width="51"
                height="34"
                decoding="async"
                className="object-cover"
                loading="lazy"
                style={{ color: "transparent" }}
              />
            </div>
          </div>

        </div>
      </div>
      <div>
        <div className="container mx-auto text-center text-sm text-muted-foreground py-4">
          <p>
            {tMain("Powered by")}{" "}
            <Link
              href={theme.website || "/"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {theme.name}
            </Link>
            {` © ${new Date().getFullYear()}. `}
            {tMain("All rights reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
