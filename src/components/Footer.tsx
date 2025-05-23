"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const fullAddress = "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa";
  const displayAddress = `SEND...pCxa`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-[#1C2027] py-10 px-6 md:px-12 m-4 rounded-xl">
      <div className="max-w-7xl mx-auto">
        {/* Top section with app details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left side with headline and buttons */}
          <div className="md:col-span-5">
            <h2 className="text-white text-3xl font-bold mb-6">
              Build Solana <br />
              Apps in Minutes.
            </h2>

            <Link
              target="_blank"
              href="https://docs.solanaappkit.com/"
              className="inline-block bg-white text-black font-semibold rounded-xl py-3 px-8 mb-4 w-64 text-center"
            >
              Documentation
            </Link>

            <div
              className="bg-[#2A2E36] text-white/70 font-mono rounded-xl py-3 px-6 mb-16 w-64 flex items-center justify-center cursor-pointer hover:bg-[#32363F] transition-colors group relative"
              onClick={copyToClipboard}
              title="Click to copy full address"
            >
              {displayAddress}
              {copied ? (
                <svg
                  className="ml-2 h-4 w-4 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {copied ? "Copied!" : "Click to copy"}
              </span>
            </div>
          </div>

          {/* Right side with navigation links */}
          <div className="md:col-span-7 md:flex md:justify-end">
            <div className="grid grid-cols-3 gap-10 md:gap-16">
              {/* Company column */}
              <div>
                <h3 className="text-white/50 font-medium text-sm mb-4">
                  Company
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="https://www.sendai.fun/"
                      target="_blank"
                      className="text-white hover:text-white"
                    >
                      SendAI
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://sendarcade.fun/"
                      target="_blank"
                      className="text-white hover:text-white"
                    >
                      SendArcade
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.thesendcoin.com/"
                      target="_blank"
                      className="text-white hover:text-white"
                    >
                      Send Coin
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources column */}
              <div>
                <h3 className="text-white/50 font-medium text-sm mb-4">
                  Resources
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="https://github.com/SendArcade/solana-app-kit"
                      target="_blank"
                      className="text-white hover:text-white"
                    >
                      Github
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://docs.solanaappkit.com/"
                      className="text-white hover:text-white"
                    >
                      Docs
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Connect column */}
              <div>
                <h3 className="text-white/50 font-medium text-sm mb-4">
                  X (Twitter)
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="https://x.com/sendarcadefun"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white"
                    >
                      Send Arcade
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://x.com/sendaifun"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white"
                    >
                      Send AI
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://x.com/thesendcoincom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white"
                    >
                      SEND Coin{" "}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row with logo and copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8">
          <div className="mb-4 md:mb-0">
            <Image
              src="/Logo.svg"
              alt="Solana app kit"
              width={120}
              height={33}
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          <div className="flex flex-col items-end text-xs text-white/40">
            <div className="text-white/50 text-sm text-center md:text-right">
              © Twenty'25, Built and Maintained By SendAI and Send Arcade
            </div>
            <div className="mt-2 flex flex-row gap-4 items-end text-xs text-white/40">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/tnc" className="hover:underline">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
