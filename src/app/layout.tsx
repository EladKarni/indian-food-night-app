import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { MenuProvider } from "@/contexts/MenuContext";
import "./globals.css";
import Header from "@/ui/Header";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" data-theme="dim" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <MenuProvider>
            <Header />
            {children}
          </MenuProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
