
import { createTheme, MantineProvider } from "@mantine/core";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// NCET design system (exact port) — fonts, buttons, header, footer, banners,
// home sections, animations, keyframes, responsive rules.
import "../styles/ncet/main.scss";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Preloader from "@/components/Preloader/Preloader";
import ScrollTop from "@/components/ScrollTop/ScrollTop";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const mantineTheme = createTheme({
  fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
});

export const metadata: Metadata = {
  title: "NCMS | Best Degree College in Karnataka",
  description:
    "Nagarjuna College of Management Studies (NCMS), affiliated to Bengaluru North University, offers UG programmes in Commerce, Management, Computer Application and Science, and an MBA. Admissions open for 2025-26.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <MantineProvider theme={mantineTheme}>

          <Preloader/>
          <main>
            <Header/>
            {children}
            <Footer/>
          </main>
          <ScrollTop/>


        </MantineProvider>
      </body>
    </html>
  );
}
