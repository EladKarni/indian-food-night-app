import type { Metadata } from "next";
import { Instrument_Serif, Geist, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/contexts/ThemeContext";
import QueryProvider from "@/components/QueryProvider";
import "./globals.css";
import Header from "@/ui/Header";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ifn-ui",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-ifn-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ifn-mono",
});

export const metadata: Metadata = {
  title: "Indian Food Night",
  description: "An app to organize Indian food nights with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`scroll-smooth ${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className={geist.className}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <MenuProvider>
                <Header />
                {children}
              </MenuProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
