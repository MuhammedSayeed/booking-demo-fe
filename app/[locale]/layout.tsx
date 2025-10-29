import type React from "react";
import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/toaster";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { NextIntlClientProvider } from "next-intl";
import StoreProvider from "./StoreProvider";
import { PreviousRouteProvider } from "@/lib/PreviousRouteContext";

import "leaflet/dist/leaflet.css";
import { getThemeData } from "@/lib/theme";
import { hexToHsl } from "@/lib/utils";
import { WebsiteThemeProvider } from "@/context/theme-context";

const inter = Inter({ subsets: ["latin"] });
const rubik = Rubik({ subsets: ["arabic"] });



export async function generateMetadata(): Promise<Metadata> {
  const theme = await getThemeData();

  return {
    title: theme.name ?? 'Maysan Group',
    description: `Welcome to ${theme.name ?? 'Our Site'}`,
    icons: {
      icon: theme.logo ?? '/favicon.ico',
      apple: theme.logo ?? '/apple-touch-icon.png',
    },
    openGraph: {
      title: theme.name ?? 'Your Website Title',
      images: theme.logo ? [theme.logo] : [],
    }
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const theme = await getThemeData();

  const primaryHsl = hexToHsl(theme.primary_color);
  const secondaryHsl = hexToHsl(theme.secondary_color);
  const backgroundHsl = hexToHsl(theme.background_color);

  const dynamicThemeCss = `
    :root {
      --background: ${backgroundHsl};
      --primary: ${primaryHsl};
      --secondary: ${secondaryHsl};
      --ring: ${primaryHsl}; /* Set ring color to primary */
    }

    .dark {
      /* Keep primary and ring colors consistent in dark mode */
      --primary: ${primaryHsl};
      --ring: ${primaryHsl};
      
      /* Note: The other dark mode variables (like --background, --secondary)
        from your globals.css will still apply automatically.
      */
    }
  `;


  return (
    <html lang={locale} suppressHydrationWarning>

      <head>
        <style dangerouslySetInnerHTML={{ __html: dynamicThemeCss }} />
      </head>
      <body className={locale === "ar" ? rubik.className : inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <WebsiteThemeProvider data={theme}>
              <StoreProvider>
                <AuthProvider>
                  <PreviousRouteProvider>
                    {/* <ClientInitializer chainData={chainData} /> */}
                    <div className="flex min-h-screen flex-col">
                      <Header />
                      {children}
                      <Footer />
                    </div>
                  </PreviousRouteProvider>
                  <Toaster />
                </AuthProvider>
              </StoreProvider>
            </WebsiteThemeProvider>

          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
