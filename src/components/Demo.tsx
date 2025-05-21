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
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const phoneVariants = {
    hidden: (custom: number) => ({
      opacity: 0,
      y: 30,
      rotate: custom,
    }),
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      rotate: custom,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
        duration: 0.7,
      },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 90,
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  // Featured app screenshots (for the larger top display)
  const featuredScreenshots = [
    "/screenshots/For You.png",
    "/screenshots/Add NFT.png",
    "/screenshots/User_Profile.png",
  ];

  // Array of app screenshots
  const appScreenshots = [
    {
      name: "SendAI Mobile",
      description: "Mobile MCP client, Powered by GOD Mode",
      images: [
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/sendaiMobile1.png",
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/sendaiMobile2.png",
      ],
    },
    {
      name: "Sendshot",
      description: "Mobile-native Launchpad Aggregator",
      images: [
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/sendshot1.png",
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/sendshot2.png",
      ],
    },
    {
      name: "Neptune Wallet",
      description: "Just a fun wallet!",
      images: [
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/wallet1.png",
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/wallet2.png",
      ],
    },
    {
      name: "Send Guys",
      description: "Multiplayer game on $SOL and $SEND",
      images: [
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/sendguys1.png",
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/sendguys2.png",
      ],
      isLandscape: true,
    },
    {
      name: "Social Trading App",
      description: "Click and Copy Trade from Social Feeds",
      images: [
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/socialapp1.png",
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/socialapp2.png",
      ],
    },
  ];

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
        className="flex flex-col md:flex-row justify-between items-center mb-10"
      >
        <motion.div
          variants={itemVariants}
          className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-0 text-center md:text-left max-w-s md:self-center"
        >
          <div className="md:hidden">
            Send
            <br />
            SuperApp
            {/* and feel the magic! */}
          </div>
          <div className="hidden md:block">
            Send
            <br />
            SuperApp
            {/* and feel the magic! */}
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center md:items-end"
        >
          <motion.div
            variants={itemVariants}
            className="text-white/70 text-lg md:text-lg mb-4 text-center md:text-left max-w-full md:max-w-[300px]"
          >
            An All in One <br className="md:hidden" />
            Solana SuperApp.
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
                duration: 0.15,
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
                duration: 0.15,
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
              {/* All app screenshots for mobile carousel */}
              {appScreenshots.flatMap((app, appIndex) =>
                app.images.map((image, imageIndex) => (
                  <div
                    key={`mobile-app-${appIndex}-image-${imageIndex}`}
                    className="w-full flex-shrink-0 flex justify-center pt-4"
                  >
                    <motion.div
                      custom={imageIndex % 2 === 0 ? -3 : 3}
                      variants={phoneVariants}
                      className={`rounded-3xl overflow-hidden relative flex justify-center transform-gpu ${
                        imageIndex % 2 === 0 ? "-rotate-3" : "rotate-3"
                      }`}
                      style={{
                        background:
                          "linear-gradient(to bottom, #333A4A 40%, #1c2127 80%)",
                        padding: "20px",
                        width: "240px",
                        height: "440px",
                      }}
                    >
                      <div className="relative w-full h-full overflow-hidden rounded-[32px] border-5 border-black">
                        <Image
                          src={image}
                          alt={`${app.name} Screenshot ${imageIndex + 1}`}
                          fill
                          className="object-cover rounded-[24px]"
                          priority
                        />
                        {imageIndex === 0 && (
                          <div className="absolute bottom-4 left-0 right-0 bg-black/70 p-2 text-center">
                            <div className="text-white text-sm font-medium">{app.name}</div>
                            <div className="text-white/80 text-xs">{app.description}</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Carousel Indicator Dots */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-full">
              {Array.from({ length: appScreenshots.length * 2 }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ease-out ${
                      currentSlide === index
                        ? "w-8 bg-slate-400"
                        : "w-2 bg-slate-600"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                )
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-center items-center mt-10 space-y-12"
        >
          {/* Featured App - 3 bigger screens without card background */}
          <motion.div
            variants={cardVariants}
            className="flex justify-center items-center w-full mb-4"
          >
            <div className="flex justify-center items-center w-full max-w-6xl gap-4 md:gap-10">
              {featuredScreenshots.map((screenshot, index) => {
                // Calculate rotation for each phone: left, center, right
                const rotation = index === 0 ? -8 : index === 2 ? 8 : 0;
                // Center phone slightly larger & different gradient
                const isCenter = index === 1;

                return (
                  <motion.div
                    key={`featured-${index}`}
                    custom={rotation}
                    variants={phoneVariants}
                    whileHover={{
                      y: -8,
                      transition: {
                        type: "tween",
                        ease: "easeOut",
                        duration: 0.2,
                      },
                    }}
                    className={`rounded-3xl overflow-hidden relative flex justify-center transform-gpu ${
                      isCenter ? "z-10" : "z-0"
                    }`}
                    style={{
                      background: isCenter
                        ? "linear-gradient(to top, #333A4A 40%, #1c2127 80%)"
                        : "linear-gradient(to bottom, #333A4A 40%, #1c2127 80%)",
                      padding: isCenter ? "24px" : "20px",
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: "center center",
                      filter: isInView ? "blur(0px)" : "blur(4px)",
                      transition:
                        "filter 0.8s ease-out, transform 0.2s ease-out, box-shadow 0.2s ease-out",
                      willChange: "transform, filter",
                      width: isCenter ? "260px" : "220px",
                    }}
                  >
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[32px] border-8 border-[#292D36]">
                      <Image
                        src={screenshot}
                        alt={`Featured Screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={isCenter}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Vibe Apps Header */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-7xl my-8 mb-16"
          >
            <h2 className="text-white text-2xl md:text-4xl font-bold text-left">
              Vibe Apps
            </h2>
          </motion.div>

          {/* First row: 3 apps */}
          <motion.div
            variants={cardVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-7xl"
          >
            {appScreenshots.slice(0, 3).map((app, appIndex) => (
              <motion.div
                key={`desktop-app-row1-${appIndex}`}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`rounded-2xl p-6 shadow-lg ${
                  app.name === "SendAI Mobile" 
                    ? "bg-gradient-to-r from-[#13161B] to-[#1C2840]" 
                    : app.name === "Neptune Wallet"
                    ? "bg-gradient-to-r from-[#151519] to-[#3E1B1C]"
                    : app.name === "Sendshot" 
                    ? "bg-gradient-to-r from-[#15161C] to-[#231D3D]"
                    : "bg-[#262A33]"
                }`}
              >
                <div className="mb-1 text-white font-medium text-lg">
                  {app.name}
                </div>
                <div className="mb-3 text-white/70 text-sm">
                  {app.description}
                </div>
                <div className="flex justify-between gap-4">
                  {app.images.map((image, imageIndex) => (
                    <motion.div
                      key={`desktop-app-row1-${appIndex}-image-${imageIndex}`}
                      custom={imageIndex === 0 ? -3 : 3}
                      variants={phoneVariants}
                      className="rounded-xl overflow-hidden relative flex justify-center transform-gpu"
                      style={{
                        background: `linear-gradient(to ${
                          imageIndex === 0 ? "bottom" : "top"
                        }, #333A4A 40%, #1c2127 80%)`,
                        padding: "8px",
                        transform: `rotate(${imageIndex === 0 ? -5 : 5}deg)`,
                        transformOrigin: "center center",
                        width: "45%",
                      }}
                    >
                      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl border-4 border-[#292D36]">
                        <Image
                          src={image}
                          alt={`${app.name} Screenshot ${imageIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second row: 2 apps */}
          <motion.div
            variants={cardVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-7xl"
          >
            {appScreenshots.slice(3, 5).map((app, appIndex) => (
              <motion.div
                key={`desktop-app-row2-${appIndex}`}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`rounded-2xl p-6 shadow-lg ${
                  app.name === "Send Guys" 
                    ? "bg-gradient-to-r from-[#13171A] to-[#1C3D33]" 
                    : app.name === "Social Trading App"
                    ? "bg-gradient-to-r from-[#15161B] to-[#3D1F3D]"
                    : "bg-[#262A33]"
                }`}
              >
                <div className="mb-1 text-white font-medium text-lg">
                  {app.name}
                </div>
                <div className="mb-3 text-white/70 text-sm">
                  {app.description}
                </div>
                {app.isLandscape ? (
                  // Landscape mode for App 4
                  <div className="flex flex-col gap-4 items-center">
                    {app.images.map((image, imageIndex) => (
                      <motion.div
                        key={`desktop-app-row2-${appIndex}-image-${imageIndex}`}
                        custom={imageIndex === 0 ? -2 : 2}
                        variants={phoneVariants}
                        className="rounded-xl overflow-hidden relative flex justify-center transform-gpu"
                        style={{
                          background: `linear-gradient(to ${
                            imageIndex === 0 ? "right" : "left"
                          }, #333A4A 40%, #1c2127 80%)`,
                          padding: "8px",
                          transform: `rotate(${imageIndex === 0 ? -2 : 2}deg)`,
                          transformOrigin: "center center",
                          width: "85%",
                        }}
                      >
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border-4 border-[#292D36]">
                          <Image
                            src={image}
                            alt={`${app.name} Screenshot ${imageIndex + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Portrait mode (default)
                  <div className={`flex ${app.name === "Social Trading App" ? "justify-center" : "justify-between"} gap-4`}>
                    {app.images.map((image, imageIndex) => (
                      <motion.div
                        key={`desktop-app-row2-${appIndex}-image-${imageIndex}`}
                        custom={imageIndex === 0 ? -3 : 3}
                        variants={phoneVariants}
                        className="rounded-xl overflow-hidden relative flex justify-center transform-gpu"
                        style={{
                          background: `linear-gradient(to ${
                            imageIndex === 0 ? "bottom" : "top"
                          }, #333A4A 40%, #1c2127 80%)`,
                          padding: "8px",
                          transform: `rotate(${imageIndex === 0 ? -5 : 5}deg)`,
                          transformOrigin: "center center",
                          width: "45%",
                        }}
                      >
                        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl border-4 border-[#292D36]">
                          <Image
                            src={image}
                            alt={`${app.name} Screenshot ${imageIndex + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
