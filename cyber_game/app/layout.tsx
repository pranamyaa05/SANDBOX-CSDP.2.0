import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "@/components/Navbarwrapper";

export const metadata: Metadata = {
  title: "Cyber Defender",
  description: "Cybersecurity Awareness Game",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#020c02", minHeight: "100vh" }}>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}