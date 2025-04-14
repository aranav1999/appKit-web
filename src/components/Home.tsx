"use client";

import Image from "next/image";

export default function Hero() {
    return (
      <section
        className="relative overflow-hidden flex items-center justify-center rounded-b-2xl"
        style={{
          background: "linear-gradient(to bottom, #131519, #1a2740)",
          minHeight: "calc(100vh - 64px)",
          height: "calc(100vh - 64px)",
        }}
      >
        {/* Left side SVG group */}
        <div className="absolute left-0 top-0 h-full w-1/3 pointer-events-none">
          <div className="relative w-full h-full">
            <Image
              src="/left_section/zigzag.svg"
              alt="Blue shape"
              width={384}
              height={529}
              className="absolute top-1/7 w-full h-auto max-w-[384px] -left-4"
            />
            <Image
              src="/left_section/setting.svg"
              alt="Blue shape"
              width={160}
              height={160}
              className="absolute top-[36%]"
            />
            <Image
              src="/left_section/Plus.svg"
              alt="Plus shape"
              width={120}
              height={120}
              className="absolute left-36 top-41"
            />
            <Image
              src="/left_section/Star-1.svg"
              alt="Star shape"
              width={60}
              height={60}
              className="absolute left-7 bottom-36"
            />
            <Image
              src="/left_section/Rectangle-1.svg"
              alt="Rectangle shape"
              width={90}
              height={90}
              className="absolute left-66 bottom-102"
            />
            <Image
              src="/left_section/Ellipse.svg"
              alt="Circle shape"
              width={125}
              height={125}
              className="absolute left-28 bottom-30"
            />
            <Image
              src="/left_section/Rectangle-2.svg"
              alt="Rectangle shape"
              width={30}
              height={30}
              className="absolute left-88 bottom-55"
            />
            <Image
              src="/left_section/boomerang.svg"
              alt="Boomerang shape"
              width={100}
              height={100}
              className="absolute left-61 bottom-58"
            />
          </div>
        </div>

        {/* Right side SVG group */}
        <div className="absolute right-0 top-0 h-full w-1/3 pointer-events-none">
          <div className="relative w-full h-full">
            <Image
              src="/right_section/Union.svg"
              alt="Shape"
              width={160}
              height={160}
              className="absolute right-20 top-1/4"
            />
            <Image
              src="/right_section/Union copy.svg"
              alt="Shape"
              width={120}
              height={120}
              className="absolute right-60 top-32"
            />
            <Image
              src="/right_section/Star 8.svg"
              alt="Star shape"
              width={60}
              height={60}
              className="absolute right-40 top-16"
            />
            <Image
              src="/right_section/Rectangle 29.svg"
              alt="Rectangle shape"
              width={80}
              height={80}
              className="absolute right-10 bottom-40"
            />
            <Image
              src="/right_section/Ellipse 3517.svg"
              alt="Circle shape"
              width={100}
              height={100}
              className="absolute right-40 bottom-60"
            />
          </div>
        </div>

        {/* Main content */}
        <div className="absolute z-10 inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-4">
            {/* Terminal display above heading */}
            <div className="mb-4 flex justify-center">
              <div className="bg-[#1A1E23] rounded-lg pl-4 pr-2 py-2 text-white font-mono text-sm shadow-xl border border-gray-800 flex items-center">
                <span>npx create solana-app</span>
                <button
                  className="ml-4 p-2 hover:opacity-70 transition-opacity"
                  onClick={() => {
                    navigator.clipboard.writeText("npx create solana-app");
                  }}
                  title="Copy to clipboard"
                >
                  <Image
                    src="/Copy_Icon.svg"
                    alt="Copy"
                    width={17}
                    height={16}
                  />
                </button>
              </div>
            </div>

            <h1
              className="text-[46px] font-[600] text-white mb-3 leading-[100%] tracking-[0%] text-center"
              style={{ fontFamily: "Franie, sans-serif" }}
            >
              Build Solana Apps Faster
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-4">
              In under 15 minutes and less than 50 lines of code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <a
                href="#"
                className="px-8 py-3 rounded-full bg-white text-black font-medium flex items-center justify-center gap-2"
              >
                Github
                <Image
                  src="/github-icon.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                />
              </a>
              <a
                href="#"
                className="px-8 py-3 rounded-full bg-[#2D3747] text-white font-medium"
              >
                Build on SAK
              </a>
            </div>
          </div>
        </div>
      </section>
    );
} 