"use client";

import Image from "next/image";

export default function Features() {
    return (
        <div className="bg-[#1C2027] py-10 px-4 md:px-8 m-4 rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <div className="text-white text-3xl md:text-4xl font-bold mb-4 md:mb-0 max-w-md">
                    Everything you need in one app
                </div>
                <div className="text-white/70 text-lg md:text-right max-w-md">
                    A powerful platform with features designed to make trading social and simple
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left column - Tall Social card */}
                <div className="md:col-span-5">
                    <Image
                        src="/features/Social.svg"
                        alt="Social Trading Feature"
                        width={400}
                        height={600}
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                {/* Right column - 2x2 grid */}
                <div className="md:col-span-7 grid grid-cols-2 gap-4 h-full">
                    <div>
                        <Image
                            src="/features/Swap.svg"
                            alt="Swap Feature"
                            width={400}
                            height={200}
                            className="w-full h-auto rounded-xl"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div>
                        <Image
                            src="/features/NFT.svg"
                            alt="NFT Feature"
                            width={400}
                            height={200}
                            className="w-full h-auto rounded-xl"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div>
                        <Image
                            src="/features/Graph.svg"
                            alt="Graph Feature"
                            width={400}
                            height={200}
                            className="w-full h-auto rounded-xl"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div>
                        <Image
                            src="/features/DApp.svg"
                            alt="DApp Feature"
                            width={400}
                            height={200}
                            className="w-full h-auto rounded-xl"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>

                {/* Bottom row - Login (full width) */}
                <div className="md:col-span-12">
                    <Image
                        src="/features/Login.svg"
                        alt="Login Feature"
                        width={1200}
                        height={300}
                        className="w-full h-auto rounded-xl"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            </div>
        </div>
    );
} 