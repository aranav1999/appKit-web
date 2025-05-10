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

    return (
        <div className="w-full mt-12">
            <h3 className="text-slate-500 text-center text-xs font-medium mb-2 opacity-90">
                PROTOCOLS INTEGRATED
            </h3>
            <div className="flex items-center justify-center gap-5 flex-wrap px-4">
                {isLoading ? (
                    // Loading skeleton placeholders
                    placeholderArray.map((_, index) => (
                        <div key={`placeholder-${index}`} className="flex-shrink-0">
                            <div className="w-10 h-10 bg-[#1C2027] rounded-full flex items-center justify-center p-1.5 opacity-30">
                                <div className="w-7 h-7 rounded-full bg-gray-700 animate-pulse"></div>
                            </div>
                        </div>
                    ))
                ) : error ? (
                    // Error state - quiet fallback
                    placeholderArray.slice(0, 6).map((_, index) => (
                        <div key={`error-placeholder-${index}`} className="flex-shrink-0">
                            <div className="w-10 h-10 bg-[#1C2027] rounded-full flex items-center justify-center p-1.5 opacity-30">
                                <div className="w-7 h-7 rounded-full bg-gray-700"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Actual content
                    protocols.slice(0, 12).map((protocol, index) => (
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
                                className="relative w-10 h-10 bg-[#1C2027] rounded-full flex items-center justify-center p-1 transition-all duration-200"
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
                                    width={30}
                                    height={30}
                                    className="object-contain rounded-full"
                                />
                            </motion.div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
} 