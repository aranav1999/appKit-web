"use client";

import { useEffect, useState } from "react";
import Demo from "@/components/Demo";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Home";
import MobileHero from "@/components/MobileHero";
import Protocols from "@/components/Protocols";
import ProtocolLogos from "@/components/ProtocolLogos";
import Header from "@/components/Header";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handle initial check and window resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 632); // Standard breakpoint for mobile
    };

    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div>
      <Header />
    <div className="w-full flex flex-col flex-grow">
      {/* Main Content */}
      <main className="flex-grow">
        {isMobile ? <MobileHero /> : <Hero />}
        {/* Protocols section */}
        {/* Demo section */}
        <div className="m-4">
          {/* <ProtocolLogos/> */}
          <Demo />
        </div>
        <Features />
        <Protocols />

      </main>

      {/* Footer */}
      <Footer />
    </div>
    </div>
  );
}
