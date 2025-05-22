"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    // Check if window width is less than 425px
    const handleResize = () => {
      setIsMobileWidth(window.innerWidth < 632);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`py-8 z-20 px-8 md:px-16 flex justify-between items-center relative ${
        isMobileWidth ? "bg-[#0C101A]" : "bg-[#131519]"
      }`}
    >
      <div className="flex items-end space-x-6">
        <Link href="/">
          <Image
            src="/Logo.svg"
            alt="AppKit Logo"
            width={160}
            height={36}
            priority
            className="mb-1"
          />
        </Link>
        <nav className="hidden md:flex space-x-6 pb-1">
          <a
            href="https://www.sendai.fun/"
            target="_blank"
            className="text-[#DAEEFE99] hover:text-white text-lg"
          >
            SendAI
          </a>
          <a
            href="https://sendarcade.fun/"
            target="_blank"
            className="text-[#DAEEFE99] hover:text-white text-lg"
          >
            Send Arcade
          </a>
          <a
            href="https://www.thesendcoin.com/"
            target="_blank"
            className="text-[#DAEEFE99] hover:text-white text-lg"
          >
            SEND
          </a>
        </nav>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <a
          href="https://x.com/solanaappkit"
          target="_blank"
          className="flex items-center justify-center w-9 h-9 bg-transparent hover:bg-white/10 rounded-md transition-colors"
        >
          <Image 
            src="/icons/twitter-x.svg" 
            alt="Twitter/X" 
            width={32} 
            height={32}
          />
        </a>
        <a
          href="https://docs.solanaappkit.com/"
          target="_blank"
          className="bg-white text-black rounded-full px-6 py-2 font-medium"
        >
          Docs
        </a>
      </div>
      <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
        <Image src="/burger.svg" alt="Menu" width={33} height={23} />
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0C101A] z-50 flex flex-col px-8 py-8">
          <div className="flex justify-between items-center">
            <Image src="/Logo.svg" alt="AppKit Logo" width={160} height={36} />
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <div className="text-white text-2xl">✕</div>
            </button>
          </div>

          <div className="flex flex-col space-y-4 mt-10">
            <a
              href="https://www.sendai.fun/"
              target="_blank"
              className="text-[#DAEEFE99] hover:text-white text-lg"
            >
              SendAI
            </a>
            <a
              href="https://sendarcade.fun/"
              target="_blank"
              className="text-[#DAEEFE99] hover:text-white text-lg"
            >
              Send Arcade
            </a>
          </div>

          <div className="mt-auto flex flex-col space-y-4">
            
            <div className="flex justify-left space-x-4 mb-4">
              <a
                href="https://x.com/solanaappkit"
                target="_blank"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 rounded-full"
              >
                <Image 
                  src="/icons/twitter-x.svg" 
                  alt="Twitter/X" 
                  width={20} 
                  height={20}
                />
                <span className="text-white">@solanaappkit</span>
              </a>
            </div>
            <button className="bg-white text-black rounded-full py-3 font-medium flex justify-center items-center gap-2">
              Github
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </button>
            <button className="bg-[#2D3138] text-white rounded-full py-3 font-medium">
              Build on SAK
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
