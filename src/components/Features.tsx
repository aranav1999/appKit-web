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

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left column - Tall Social card */}
                <div className="md:col-span-5 lg:col-span-4 h-full">
                    <div
                        className="w-full h-full aspect-[3/4] relative rounded-[24px] border-2 border-white/10 overflow-hidden"
                        style={{
                            background: 'linear-gradient(to bottom, #0B88F0, #0BB3F0)'
                        }}
                    >
                        {/* Background SVG */}
                        <div className="absolute inset-0 rounded-[22px] overflow-hidden">
                            <Image
                                src="/features/Social_bg.svg"
                                alt="Social Background"
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>

                        {/* Elements SVG */}
                        <div className="absolute inset-0 flex items-center justify-center -mt-16">
                            <Image
                                src="/features/Social_Elements.svg"
                                alt="Social Elements"
                                width={350}
                                height={350}
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>

                        {/* Text at the bottom */}
                        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                            <h3 className="text-xl font-semibold">
                                Profiles, chats, Interactive
                                <br />
                                and Tradeable Feed
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Right column - 2x2 grid */}
                <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Swap Card */}
                    <div className="w-full h-full">
                        <div
                            className="w-full aspect-[3/2] relative rounded-[24px] border-2 border-white/10 overflow-hidden"
                            style={{
                                background: 'linear-gradient(to right, #00C978, #00C9A7)',
                                padding: '42px 24px'
                            }}
                        >
                            {/* Background SVG */}
                            <div className="absolute inset-0 rounded-[22px] overflow-hidden">
                                <Image
                                    src="/features/Swap_bg.svg"
                                    alt="Swap Background"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                            </div>

                            {/* Elements SVG */}
                            <div className="absolute inset-0 flex items-center justify-end -mr-2">
                                <Image
                                    src="/features/Swap_Element.svg"
                                    alt="Swap Component"
                                    width={180}
                                    height={120}
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>

                            {/* Text at the bottom */}
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-xl font-semibold">
                                    Swap and
                                    <br />
                                    Copy Trade
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* NFT Card */}
                    <div className="w-full h-full">
                        <div
                            className="w-full aspect-[3/2] relative rounded-[24px] border-2 border-white/10 overflow-hidden"
                            style={{
                                background: 'linear-gradient(to right, #1C2027, #2C333F)',
                                padding: '42px 24px'
                            }}
                        >
                            {/* Background SVG */}
                            <div className="absolute inset-0 rounded-[22px] overflow-hidden">
                                <Image
                                    src="/features/nft_bg.svg"
                                    alt="NFT Background"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                            </div>

                            {/* Elements SVG */}
                            <div className="absolute inset-0 flex items-center justify-end -mr-2">
                                <Image
                                    src="/features/nft_components.svg"
                                    alt="NFT Components"
                                    width={180}
                                    height={120}
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>

                            {/* Text at the bottom */}
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-xl font-semibold">
                                    Mint and
                                    <br />
                                    Trade NFTs
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Graph Card */}
                    <div className="w-full h-full">
                        <div
                            className="w-full aspect-[3/2] relative rounded-[24px] border-2 border-white/10 overflow-hidden"
                            style={{
                                background: 'linear-gradient(to right, #FFBF44, #FFA844)',
                                padding: '42px 24px'
                            }}
                        >
                            {/* Background SVG */}
                            <div className="absolute inset-0 rounded-[22px] overflow-hidden">
                                <Image
                                    src="/features/Graph_bg.svg"
                                    alt="Graph Background"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                            </div>

                            {/* Elements SVG */}
                            <div className="absolute inset-0 flex items-center justify-end -mb-34 mr-20">
                                <Image
                                    src="/features/graph_component.svg"
                                    alt="Graph Component"
                                    width={180}
                                    height={120}
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>

                            {/* Text at the bottom */}
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-xl font-semibold">
                                    Configurable
                                    <br />
                                    Bonding Curves
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* DApp Card */}
                    <div className="w-full h-full">
                        <div
                            className="w-full aspect-[3/2] relative rounded-[24px] border-2 border-white/10 overflow-hidden"
                            style={{
                                background: 'linear-gradient(to right, #B5E5FF, #98D8FF)',
                                padding: '42px 24px'
                            }}
                        >
                            {/* Background SVG */}
                            <div className="absolute inset-0 rounded-[22px] overflow-hidden">
                                <Image
                                    src="/features/dApp_bg.svg"
                                    alt="DApp Background"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                            </div>

                            {/* Elements SVG */}
                            <div className="absolute inset-0 flex items-center justify-end -mr-2">
                                <Image
                                    src="/features/dApp_component.svg"
                                    alt="DApp Component"
                                    width={180}
                                    height={120}
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>

                            {/* Text at the bottom */}
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-xl font-semibold">
                                    Publish to Solana
                                    <br />
                                    Mobile dApp store
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom row - Login (full width) */}
                <div className="md:col-span-12 mt-2">
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