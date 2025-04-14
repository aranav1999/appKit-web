"use client";

import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative overflow-hidden"
            style={{
                background: "linear-gradient(to bottom, #131519, #1a2740)",
                minHeight: "calc(100vh - 64px)"
            }}
        >
            {/* Left side SVG group */}
            <div className="absolute left-0 top-0 h-full w-1/3 pointer-events-none">
                <div className="relative w-full h-full">
                    <Image
                        src="/left_section/Union.svg"
                        alt="Blue shape"
                        width={180}
                        height={180}
                        className="absolute left-10 top-1/4"
                    />
                    <Image
                        src="/left_section/Plus.svg"
                        alt="Plus shape"
                        width={100}
                        height={100}
                        className="absolute left-40 top-20"
                    />
                    <Image
                        src="/left_section/Star 11.svg"
                        alt="Star shape"
                        width={60}
                        height={60}
                        className="absolute left-20 bottom-40"
                    />
                    <Image
                        src="/left_section/Rectangle 28.svg"
                        alt="Rectangle shape"
                        width={80}
                        height={80}
                        className="absolute left-60 bottom-60"
                    />
                    <Image
                        src="/left_section/Ellipse 3516.svg"
                        alt="Circle shape"
                        width={140}
                        height={140}
                        className="absolute left-30 bottom-20"
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
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 h-full">
                <div className="w-full max-w-4xl mx-auto">
                    {/* Terminal display above heading */}
                    <div className="mb-10 flex justify-center">
                        <div className="bg-[#1A1E23] rounded-lg pl-4 pr-2 py-2 text-white font-mono text-sm shadow-xl border border-gray-800 flex items-center">
                            <span>npx create solana-app</span>
                            <button
                                className="ml-4 p-2 hover:opacity-70 transition-opacity"
                                onClick={() => {
                                    navigator.clipboard.writeText('npx create solana-app');
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

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Build Solana Apps Faster
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 mb-8">
                        In under 15 minutes and less than 50 lines of code.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <a
                            href="#"
                            className="px-8 py-3 rounded-full bg-white text-black font-medium flex items-center justify-center gap-2"
                        >
                            Github
                            <Image src="/github-icon.svg" alt="GitHub" width={20} height={20} />
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