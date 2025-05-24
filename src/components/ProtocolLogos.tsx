"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Protocol {
    name: string;
    imageUrl: string;
    link: string;
}

export default function ProtocolLogos() {
    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }, []);

    const handleProtocolClick = (link: string) => {
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    // Create placeholder array for skeleton loading
    const placeholderArray = Array(12).fill(null);

    // Split protocols into two rows
    const splitInHalf = (array: any[]) => {
        const half = Math.ceil(array.length / 2);
        return [array.slice(0, half), array.slice(half)];
    };

    const renderProtocolLogo = (protocol: Protocol, index: number) => (
        <motion.div
            key={`${protocol.name}-${index}`}
            onClick={() => handleProtocolClick(protocol.link)}
            className="flex-shrink-0 cursor-pointer perspective-500"
            title={protocol.name}
            whileHover={{
                scale: 1.15,
                translateY: -5,
                rotateX: 10,
                rotateY: 10,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="relative w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-[#1C2027] rounded-full flex items-center justify-center p-0.5 md:p-1 transition-all duration-200"
                style={{
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}
                whileHover={{
                    boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
                    transition: { duration: 0.2 }
                }}
            >
                <Image
                    src={protocol.imageUrl}
                    alt={`${protocol.name} logo`}
                    width={24}
                    height={24}
                    className="object-contain rounded-full w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                />
            </motion.div>
        </motion.div>
    );

    const renderLoadingSkeleton = (key: string) => (
        <div key={key} className="flex-shrink-0">
            <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-[#1C2027] rounded-full flex items-center justify-center p-1 md:p-1.5 opacity-30">
                <div className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full bg-gray-700 animate-pulse"></div>
            </div>
        </div>
    );

    const renderErrorPlaceholder = (key: string) => (
        <div key={key} className="flex-shrink-0">
            <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-[#1C2027] rounded-full flex items-center justify-center p-1 md:p-1.5 opacity-30">
                <div className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full bg-gray-700"></div>
            </div>
        </div>
    );

    let content;
    if (isLoading) {
        // Split placeholders into two rows
        const [firstRow, secondRow] = splitInHalf(placeholderArray);
        content = (
            <>
                <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-5 mb-3 md:mb-4">
                    {firstRow.map((_, index) => renderLoadingSkeleton(`placeholder-row1-${index}`))}
                </div>
                <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-5">
                    {secondRow.map((_, index) => renderLoadingSkeleton(`placeholder-row2-${index}`))}
                </div>
            </>
        );
    } else if (error) {
        // Show reduced number of placeholders in error state
        const errorPlaceholders = placeholderArray.slice(0, 6);
        const [firstRow, secondRow] = splitInHalf(errorPlaceholders);
        content = (
            <>
                <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-5 mb-3 md:mb-4">
                    {firstRow.map((_, index) => renderErrorPlaceholder(`error-row1-${index}`))}
                </div>
                <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-5">
                    {secondRow.map((_, index) => renderErrorPlaceholder(`error-row2-${index}`))}
                </div>
            </>
        );
    } else {
        // Split protocols into two rows
        const [firstRow, secondRow] = splitInHalf(protocols);
        content = (
            <>
                <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-5 mb-3 md:mb-4">
                    {firstRow.map((protocol, index) => renderProtocolLogo(protocol, index))}
                </div>
                <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-5">
                    {secondRow.map((protocol, index) => renderProtocolLogo(protocol, index + firstRow.length))}
                </div>
            </>
        );
    }

    return (
        <div className="w-full mt-12">
            <h3 className="text-slate-500 text-center text-xs font-medium mb-2 opacity-90">
               PARTNER PROTOCOLS INTEGRATED
            </h3>
            <div className="px-2 md:px-4">
                {content}
            </div>
        </div>
    );
} 