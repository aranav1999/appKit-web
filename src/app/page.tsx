"use client";

import { useEffect, useState } from "react";
import Demo from "@/components/Demo";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Home";
import MobileHero from "@/components/MobileHero";

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
    <div className="w-full flex flex-col flex-grow">
      {/* Main Content */}
      <main className="flex-grow">
        {isMobile ? <MobileHero /> : <Hero />}
        {/* Other sections will be added here */}
       <div className="m-4">
       <Demo />
       </div>
        <Features />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
