"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

interface Protocol {
    name: string;
    imageUrl: string;
    link: string;
}

// Card hover variants
const cardVariants = {
    initial: {
        y: 0,
        scale: 1,
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", // Keep a subtle initial shadow
    },
    hover: {
        y: -8, // Elevate card
        scale: 1.05, // Slightly increase scale on hover for elevation feel
        transition: { type: "spring", stiffness: 300, damping: 20 }
    }
};

const imageVariants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.18, // Make image slightly bigger on hover
        transition: { type: "spring", stiffness: 300, damping: 20 }
    }
};

const MOBILE_BREAKPOINT = 768;
const DEFAULT_SPEED_FACTOR = 40; // Default speed
const DESKTOP_SPEED_FACTOR = 90; // Faster speed for desktop

// Helper function to manage individual carousel animation
function useCarouselAnimation(
    items: Protocol[],
    wrapperRef: React.RefObject<HTMLDivElement | null>,
    direction: 'ltr' | 'rtl' = 'ltr',
    isLoading: boolean,
    speedFactor: number = DEFAULT_SPEED_FACTOR // Added speedFactor parameter
) {
    const animationControls = useAnimation();

    useEffect(() => {
        if (isLoading || items.length === 0 || !wrapperRef.current) {
            animationControls.stop();
            animationControls.set({ x: 0 });
            return;
        }

        const carouselContentElement = wrapperRef.current.firstChild as HTMLDivElement;
        if (!carouselContentElement) return;

        const timer = setTimeout(() => {
            const contentWidth = carouselContentElement.scrollWidth / 2; // True width of one set of items
            const wrapperWidth = wrapperRef.current?.offsetWidth || 0;

            if (contentWidth > wrapperWidth && wrapperWidth > 0) {
                const scrollDistance = contentWidth;
                const duration = scrollDistance / speedFactor; // Use speedFactor here

                let xKeyframes = [0, -scrollDistance];
                if (direction === 'rtl') {
                    xKeyframes = [-scrollDistance, 0];
                }

                animationControls.start({
                    x: xKeyframes,
                    transition: {
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: duration,
                            ease: "linear",
                        },
                    },
                });
            } else {
                animationControls.stop();
                animationControls.set({ x: 0 });
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [isLoading, items, animationControls, wrapperRef, direction, speedFactor]); // Added speedFactor to dependencies

    return animationControls;
}

export default function Protocols() {
    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        async function fetchProtocols() {
            try {
                const response = await fetch('/api/excel-data');
                if (!response.ok) throw new Error('Failed to fetch protocols');
                const data = await response.json();
                setProtocols(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        }
        fetchProtocols();

        const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Desktop Carousel Refs and Controls - Pass DESKTOP_SPEED_FACTOR
    const desktopCarouselWrapperRef = useRef<HTMLDivElement>(null);
    const desktopAnimationControls = useCarouselAnimation(
        protocols,
        desktopCarouselWrapperRef,
        'ltr',
        isLoading,
        DESKTOP_SPEED_FACTOR // Pass the faster speed factor for desktop
    );

    // Mobile Carousel Refs and Controls - Uses DEFAULT_SPEED_FACTOR
    const mobileCarouselWrapperRef1 = useRef<HTMLDivElement>(null);
    const mobileCarouselWrapperRef2 = useRef<HTMLDivElement>(null);
    const mobileCarouselWrapperRef3 = useRef<HTMLDivElement>(null);

    const third = Math.ceil(protocols.length / 3);
    const row1Protocols = protocols.slice(0, third);
    const row2Protocols = protocols.slice(third, 2 * third);
    const row3Protocols = protocols.slice(2 * third);

    const mobileAnimationControls1 = useCarouselAnimation(row1Protocols, mobileCarouselWrapperRef1, 'ltr', isLoading); // Default speed
    const mobileAnimationControls2 = useCarouselAnimation(row2Protocols, mobileCarouselWrapperRef2, 'rtl', isLoading); // Default speed
    const mobileAnimationControls3 = useCarouselAnimation(row3Protocols, mobileCarouselWrapperRef3, 'ltr', isLoading); // Default speed

    const renderCarouselRow = (items: Protocol[], controls: any, ref: React.RefObject<HTMLDivElement | null>, keyPrefix: string) => (
        <div
            className="overflow-hidden select-none mb-4"
            ref={ref}
            style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
        >
            <motion.div
                className="flex gap-6 py-2"
                animate={controls}
            >
                {items.length > 0 && [...items, ...items].map((protocol, index) => (
                    <ProtocolCard key={`${keyPrefix}-${protocol.name}-${index}`} protocol={protocol} />
                ))}
            </motion.div>
        </div>
    );

    if (isLoading) return (
        <div className="w-full py-16 flex flex-col items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading protocols...</div>
        </div>
    );

    if (error) return (
        <div className="w-full py-16 flex flex-col items-center justify-center">
            <div className="text-red-500">Error: {error}</div>
        </div>
    );

    const headingSection = (
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-4xl font-bold tracking-wider text-white mb-2">
                PROTOCOLS INTEGRATED
            </h2>
            <p className="text-gray-400 text-lg">
                Explore the leading protocols integrated with Solana App Kit
            </p>
        </div>
    );

    return (
        <section className="w-full py-2 my-10 rounded-3xl">
            <div className="container mx-auto px-4">
                {headingSection}

                {isMobile ? (
                    <div className="mobile-carousel-container">
                        {renderCarouselRow(row1Protocols, mobileAnimationControls1, mobileCarouselWrapperRef1, "m-r1")}
                        {renderCarouselRow(row2Protocols, mobileAnimationControls2, mobileCarouselWrapperRef2, "m-r2")}
                        {renderCarouselRow(row3Protocols, mobileAnimationControls3, mobileCarouselWrapperRef3, "m-r3")}
                    </div>
                ) : (
                    renderCarouselRow(protocols, desktopAnimationControls, desktopCarouselWrapperRef, "d-r1")
                )}
            </div>
        </section>
    );
}

function ProtocolCard({ protocol }: { protocol: Protocol }) {
    const getDomainFromUrl = (url: string) => {
        try { return new URL(url).hostname; }
        catch (e) { return url; }
    };

    return (
        <motion.a
            href={protocol.link}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[260px] h-[80px] p-4 bg-[#1C2027] rounded-xl flex items-center cursor-pointer gap-4"
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            style={{ willChange: 'transform' }}
        >
            <motion.div
                className="relative w-12 h-12 flex-shrink-0"
                variants={imageVariants}
                style={{ willChange: 'transform' }}
            >
                <Image
                    src={protocol.imageUrl}
                    alt={`${protocol.name} logo`}
                    fill
                    className="object-contain rounded-md"
                    sizes="(max-width: 768px) 8vw, 48px"
                />
            </motion.div>
            <div className="flex flex-col justify-center overflow-hidden">
                <h3 className="text-white font-semibold text-md truncate">{protocol.name}</h3>
                <p className="text-xs text-gray-400 truncate">{getDomainFromUrl(protocol.link)}</p>
            </div>
        </motion.a>
    );
} 