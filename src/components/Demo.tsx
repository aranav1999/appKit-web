"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Demo() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    const [isMobile, setIsMobile] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Monitor window resize to detect mobile view
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkIsMobile();

        // Add event listener
        window.addEventListener('resize', checkIsMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

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

    // Function to handle carousel navigation
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <motion.div
            ref={sectionRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="container mx-auto bg-[#1C2027] py-10 px-4 md:px-8 m-4 rounded-3xl"
        >
            <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10"
            >
                <motion.div
                    variants={itemVariants}
                    className="text-white text-2xl md:text-2xl font-bold mb-4 md:mb-0 text-center md:text-left max-w-xs"
                >
                    <div className="md:hidden">
                        Try a Social Trading App<br />
                        and feel the magic!
                    </div>
                    <div className="hidden md:block">
                        Try a Social Trading App<br />
                        and feel the magic!
                    </div>
                </motion.div>
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center md:items-end"
                >
                    <motion.div
                        variants={itemVariants}
                        className="text-white/70 text-lg md:text-lg mb-4 text-center md:text-right max-w-full md:max-w-[300px]"
                    >
                        A fully open-source application <br className="md:hidden" />
                        for users and developers.
                    </motion.div>
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col md:flex-row gap-3"
                    >
                        <motion.a
                            href="#"
                            className="flex items-center justify-center gap-2 bg-white text-black px-5 py-3 md:px-3 md:py-3 rounded-full font-medium md:font-medium w-full md:w-auto text-xs md:text-xs whitespace-nowrap"
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
                                width={16}
                                height={16}
                            />
                            Download on iOS
                        </motion.a>
                        <motion.a
                            href="#"
                            className="flex items-center justify-center gap-2 bg-white text-black px-5 py-2 md:px-3 md:py-1 rounded-full font-medium md:font-medium w-full md:w-auto text-xs md:text-xs whitespace-nowrap"
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
                                width={16}
                                height={16}
                            />
                            Get it on Google Play
                        </motion.a>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Mobile Carousel */}
            {isMobile ? (
                <motion.div
                    variants={itemVariants}
                    className="mt-10 relative flex flex-col items-center"
                >
                    <div className="w-full max-w-[280px] overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {/* First Phone in Carousel */}
                            <div className="w-full flex-shrink-0 flex justify-center pt-4">
                                <motion.div
                                    custom={0}
                                    variants={phoneVariants}
                                    className="rounded-3xl overflow-hidden relative flex justify-center transform-gpu -rotate-3"
                                    style={{
                                        background: "linear-gradient(to bottom, #333A4A, #1C2027)",
                                        padding: "20px",
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                                        width: "240px",
                                        height: "440px"
                                    }}
                                >
                                    <div className="relative w-full h-full overflow-hidden rounded-t-[32px] border-t-5 border-l-5 border-r-5 border-black">
                                        <Image
                                            src="/screenshots/For You.png"
                                            alt="Social Trading App Screenshot"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Second Phone in Carousel */}
                            <div className="w-full flex-shrink-0 flex justify-center">
                                <motion.div
                                    custom={0}
                                    variants={phoneVariants}
                                    className="rounded-3xl overflow-hidden flex justify-center transform-gpu"
                                    style={{
                                        background: "linear-gradient(to top, #333A4A, #1C2027)",
                                        padding: "20px",
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                                        width: "240px",
                                        height: "440px"
                                    }}
                                >
                                    <div className="relative w-full h-full overflow-hidden rounded-[32px] border-5 border-black">
                                        <Image
                                            src="/screenshots/Add NFT.png"
                                            alt="Social Trading App Screenshot"
                                            fill
                                            className="object-cover rounded-[24px]"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Third Phone in Carousel */}
                            <div className="w-full flex-shrink-0 flex justify-center pt-4">
                                <motion.div
                                    custom={0}
                                    variants={phoneVariants}
                                    className="rounded-3xl overflow-hidden relative flex justify-center transform-gpu rotate-3"
                                    style={{
                                        background: "linear-gradient(to bottom, #333A4A, #1C2027)",
                                        padding: "20px",
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                                        width: "240px",
                                        height: "440px"
                                    }}
                                >
                                    <div className="relative w-full h-full overflow-hidden rounded-[32px] border-5 border-black">
                                        <Image
                                            src="/screenshots/User_Profile.png"
                                            alt="Social Trading App Screenshot"
                                            fill
                                            className="object-cover rounded-[24px]"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Indicator Dots */}
                    <div className="flex justify-center mt-6">
                        <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-full">
                            {[0, 1, 2].map((index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ease-out ${currentSlide === index ? 'w-8 bg-slate-400' : 'w-2 bg-slate-600'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            ) : (
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
                                    src="/screenshots/For You.png"
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
                                    src="/screenshots/Add NFT.png"
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
                                    src="/screenshots/User Profile - posts.png"
                                    alt="Social Trading App Screenshot"
                                    fill
                                    className="object-cover rounded-[24px]"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
} 