"use client";

import Image from "next/image";

export default function Demo() {
    return (
        <div className="bg-[#1C2027] py-10 px-4 md:px-8 m-4 rounded-3xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-25">
                <div className="text-white text-3xl md:text-4xl font-bold mb-4 md:mb-0 max-w-md">
                    Try a Social Trading App and feel the magic!
                </div>
                <div className="flex flex-col items-start md:items-end">
                    <div className="text-white/70 text-lg mb-4 md:text-right">
                        A fully open-source application for users and developers.
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="#"
                            className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-semibold"
                        >
                            <Image
                                src="/AppleLogo.svg"
                                alt="Apple Logo"
                                width={20}
                                height={20}
                            />
                            Download on iOS
                        </a>
                        <a
                            href="#"
                            className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-semibold"
                        >
                            <Image
                                src="/PlayStore.svg"
                                alt="Play Store Logo"
                                width={20}
                                height={20}
                            />
                            Get it on Google Play
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
                {/* First app screenshot - top to bottom gradient, tilted left */}
                <div className="rounded-3xl overflow-hidden relative" style={{
                    background: "linear-gradient(to bottom, #333A4A, #1C2027)",
                    padding: "20px 0 0",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    transform: "rotate(-5deg)",
                    transformOrigin: "center center",
                    zIndex: "1",
                    maxWidth: "350px"
                }}>
                    <div className="relative aspect-[9/16] w-full max-w-[260px] mx-auto overflow-hidden rounded-t-[32px] border-t-8 border-l-8 border-r-8 border-[#292D36]">
                        <Image
                            src="/screenshots/Simulator Screenshot - iPhone 16 Pro - 2025-03-31 at 23.32.50.png"
                            alt="Social Trading App Screenshot"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Second app screenshot - bottom to top gradient */}
                <div className="rounded-3xl overflow-hidden" style={{
                    background: "linear-gradient(to top, #333A4A, #1C2027)",
                    padding: "20px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    maxWidth: "350px"

                }}>
                    <div className="relative aspect-[9/16] w-full max-w-[260px] mx-auto overflow-hidden rounded-[32px] border-8 border-[#292D36]">
                        <Image
                            src="/screenshots/Simulator Screenshot - iPhone 16 Pro - 2025-04-11 at 21.03.08.png"
                            alt="Social Trading App Screenshot"
                            fill
                            className="object-cover rounded-[24px]"
                        />
                    </div>
                </div>

                {/* Third app screenshot - top to bottom gradient, tilted right */}
                <div className="rounded-3xl overflow-hidden relative" style={{
                    background: "linear-gradient(to bottom, #333A4A, #1C2027)",
                    padding: "20px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    transform: "rotate(5deg)",
                    transformOrigin: "center center",
                    zIndex: "1",
                    maxWidth: "350px"

                }}>
                    <div className="relative aspect-[9/16] w-full max-w-[260px] mx-auto overflow-hidden rounded-[32px] border-8 border-[#292D36]">
                        <Image
                            src="/screenshots/Simulator Screenshot - iPhone 16 Pro - 2025-04-13 at 17.34.24.png"
                            alt="Social Trading App Screenshot"
                            fill
                            className="object-cover rounded-[24px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 