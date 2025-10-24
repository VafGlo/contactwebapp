import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "@/context/authContext";
import { ContactsProvider } from "@/context/contactsContext";

export const metadata: Metadata = {
  title: "WebUI Project",
  description: "App para gestionar contactos en Next.js",
};

export default function RootLayout({ 
  children,
}: { children: React.ReactNode; 
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ContactsProvider>
            <Navbar />
            <main style={{ padding: "20px" }}>{children}</main>
          </ContactsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}




