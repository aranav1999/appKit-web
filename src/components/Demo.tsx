"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Demo() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.8,
                staggerChildren: 0.15
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };
    
    const phoneVariants = {
        hidden: (custom: number) => ({ 
            opacity: 0,
            y: 30,
            rotate: custom
        }),
        visible: (custom: number) => ({ 
            opacity: 1,
            y: 0,
            rotate: custom,
            transition: { 
                type: "spring",
                damping: 15,
                stiffness: 80,
                duration: 0.7
            }
        })
    };

    return (
        <motion.div 
            ref={sectionRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="bg-[#1C2027] py-10 px-4 md:px-8 m-4 rounded-xl"
        >
            <motion.div 
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
            >
                <motion.div 
                    variants={itemVariants}
                    className="text-white text-3xl md:text-4xl font-bold mb-4 md:mb-0 max-w-md"
                >
                    Try a Social Trading App and feel the magic!
                </motion.div>
                <motion.div 
                    variants={itemVariants}
                    className="flex flex-col items-start md:items-end"
                >
                    <motion.div 
                        variants={itemVariants}
                        className="text-white/70 text-lg mb-4 md:text-right"
                    >
                        A fully open-source application for users and developers.
                    </motion.div>
                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-wrap gap-3"
                    >
                        <motion.a
                            href="#"
                            className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full"
                            whileHover={{ 
                                scale: 1.03, 
                                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{
                                type: "tween",
                                ease: "easeOut",
                                duration: 0.15
                            }}
                        >
                            <Image
                                src="/AppleLogo.svg"
                                alt="Apple Logo"
                                width={20}
                                height={20}
                            />
                            Download on iOS
                        </motion.a>
                        <motion.a
                            href="#"
                            className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full"
                            whileHover={{ 
                                scale: 1.03, 
                                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{
                                type: "tween",
                                ease: "easeOut",
                                duration: 0.15
                            }}
                        >
                            <Image
                                src="/PlayStore.svg"
                                alt="Play Store Logo"
                                width={20}
                                height={20}
                            />
                            Get it on Google Play
                        </motion.a>
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="flex justify-center items-center mt-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-20 w-full max-w-6xl">
                    {/* First app screenshot - top to bottom gradient, tilted left */}
                    <motion.div 
                        custom={-5}
                        variants={phoneVariants}
                        whileHover={{ 
                            y: -5,
                            transition: { 
                                type: "tween", 
                                ease: "easeOut", 
                                duration: 0.2 
                            }
                        }}
                        className="rounded-3xl overflow-hidden relative flex justify-center transform-gpu" 
                        style={{
                            background: "linear-gradient(to bottom, #333A4A, #1C2027)",
                            padding: "20px 0 0",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                            transform: "rotate(-5deg)",
                            transformOrigin: "center center",
                            zIndex: "1",
                            filter: isInView ? "blur(0px)" : "blur(4px)",
                            transition: "filter 0.6s ease-out, transform 0.2s ease-out, box-shadow 0.2s ease-out",
                            willChange: "transform, filter"
                        }}
                    >
                        <div className="relative aspect-[9/16] w-full max-w-[260px] overflow-hidden rounded-t-[32px] border-t-8 border-l-8 border-r-8 border-[#292D36]">
                            <Image
                                src="/screenshots/Simulator Screenshot - iPhone 16 Pro - 2025-03-31 at 23.32.50.png"
                                alt="Social Trading App Screenshot"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Second app screenshot - bottom to top gradient */}
                    <motion.div 
                        custom={0}
                        variants={phoneVariants}
                        whileHover={{ 
                            y: -5,
                            boxShadow: "0 22px 35px rgba(0,0,0,0.25)",
                            transition: { 
                                type: "tween", 
                                ease: "easeOut", 
                                duration: 0.2 
                            }
                        }}
                        className="rounded-3xl overflow-hidden flex justify-center transform-gpu" 
                        style={{
                            background: "linear-gradient(to top, #333A4A, #1C2027)",
                            padding: "20px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                            filter: isInView ? "blur(0px)" : "blur(4px)",
                            transition: "filter 0.8s ease-out, transform 0.2s ease-out, box-shadow 0.2s ease-out",
                            willChange: "transform, filter"
                        }}
                    >
                        <div className="relative aspect-[9/16] w-full max-w-[260px] overflow-hidden rounded-[32px] border-8 border-[#292D36]">
                            <Image
                                src="/screenshots/Simulator Screenshot - iPhone 16 Pro - 2025-04-11 at 21.03.08.png"
                                alt="Social Trading App Screenshot"
                                fill
                                className="object-cover rounded-[24px]"
                            />
                        </div>
                    </motion.div>

                    {/* Third app screenshot - top to bottom gradient, tilted right */}
                    <motion.div 
                        custom={5}
                        variants={phoneVariants}
                        whileHover={{ 
                            y: -5,
                            transition: { 
                                type: "tween", 
                                ease: "easeOut", 
                                duration: 0.2 
                            }
                        }}
                        className="rounded-3xl overflow-hidden relative flex justify-center transform-gpu" 
                        style={{
                            background: "linear-gradient(to bottom, #333A4A, #1C2027)",
                            padding: "20px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                            transform: "rotate(5deg)",
                            transformOrigin: "center center",
                            zIndex: "1",
                            filter: isInView ? "blur(0px)" : "blur(4px)",
                            transition: "filter 1s ease-out, transform 0.2s ease-out, box-shadow 0.2s ease-out",
                            willChange: "transform, filter"
                        }}
                    >
                        <div className="relative aspect-[9/16] w-full max-w-[260px] overflow-hidden rounded-[32px] border-8 border-[#292D36]">
                            <Image
                                src="/screenshots/Simulator Screenshot - iPhone 16 Pro - 2025-04-13 at 17.34.24.png"
                                alt="Social Trading App Screenshot"
                                fill
                                className="object-cover rounded-[24px]"
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
} 