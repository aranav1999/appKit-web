"use client";

import Image from "next/image";
import { motion, useAnimationControls, AnimationControls } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import confetti from 'canvas-confetti';

export default function Demo() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);
  const countAnimationControls = useAnimationControls();
  const [milestoneReached, setMilestoneReached] = useState(false);
  const milestoneTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [appClicks, setAppClicks] = useState<{[key: string]: number}>({});
  const [showingAppClick, setShowingAppClick] = useState<{[key: string]: boolean}>({});
  // New state for waitlist modal
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Pre-initialize animation controls for each app
  // Create individual controls for each app we know about
  const sendAIMobileControls = useAnimationControls();
  const sendshotControls = useAnimationControls();
  const neptuneWalletControls = useAnimationControls();
  const sendGuysControls = useAnimationControls();
  const socialTradingControls = useAnimationControls();
  
  // Map app names to their respective controls with proper typing
  const controlsMap = useRef<{[key: string]: AnimationControls}>({
    "SendAI Mobile": sendAIMobileControls,
    "Sendshot": sendshotControls,
    "Neptune Wallet": neptuneWalletControls,
    "Send Guys": sendGuysControls,
    "Social Trading App": socialTradingControls
  });

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

  // Fetch initial click count from the API
  useEffect(() => {
    const fetchClickCount = async () => {
      try {
        const response = await fetch('/api/clicks');
        if (response.ok) {
          const data = await response.json();
          setClickCount(data.count);
          
          // Initialize all app-specific counters with the global count
          const appClickData: {[key: string]: number} = {};
          appScreenshots.forEach(app => {
            appClickData[app.name] = data.count;
          });
          setAppClicks(appClickData);
        }
      } catch (error) {
        console.error('Failed to fetch click count:', error);
      }
    };

    fetchClickCount();
  }, []);

  // Set initial animation state on component mount
  useEffect(() => {
    countAnimationControls.start({ opacity: 1, scale: 1 });
  }, []);

  // Add utility function for haptic feedback
  const triggerHapticFeedback = () => {
    // Check if the device supports vibration
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20); // Short vibration (20ms)
    }
  };

  // Function to trigger confetti for milestone
  const triggerMilestoneConfetti = () => {
    // Set the milestone state for button text change
    setMilestoneReached(true);
    
    // First confetti burst - center
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
    
    // Second confetti burst - from left
    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 }
      });
    }, 200);
    
    // Third confetti burst - from right
    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 }
      });
    }, 400);
    
    // Reset milestone state after a few seconds
    if (milestoneTimeoutRef.current) {
      clearTimeout(milestoneTimeoutRef.current);
    }
    
    milestoneTimeoutRef.current = setTimeout(() => {
      setMilestoneReached(false);
    }, 4000);
  };
  
  // Check if count is a milestone (multiple of 25)
  const checkAndCelebrateMilestone = (count: number) => {
    if (count > 0 && count % 25 === 0) {
      triggerMilestoneConfetti();
    }
  };

  // Handle button hold logic
  const startHoldingCounter = async () => {
    setIsHolding(true);
    isHoldingRef.current = true;
    
    // Function to update counter during hold
    const updateCounterDuringHold = async () => {
      if (!isHoldingRef.current) return;
      
      // Optimistically update local count for better UX
      setClickCount(prevCount => {
        const newCount = prevCount + 1;
        // Check for milestone
        checkAndCelebrateMilestone(newCount);
        return newCount;
      });
      
      // Trigger haptic feedback
      triggerHapticFeedback();
      // Animate the counter
      countAnimationControls.start({
        scale: [1, 1.2, 1],
        rotateX: [0, 15, 0],
        transition: { duration: 0.2 } // Faster animation
      });
      
      try {
        const response = await fetch('/api/clicks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          // Get the real count from the server
          const data = await response.json();
          setClickCount(data.count);
          // Check for milestone with server count
          checkAndCelebrateMilestone(data.count);
        } else {
          // If server request fails, revert the count
          setClickCount(prevCount => prevCount - 1);
          console.error('Failed to update click count');
        }
      } catch (error) {
        // If there's an error, revert the count
        setClickCount(prevCount => prevCount - 1);
        console.error('Error updating click count:', error);
      }
      
      // Schedule next update if still holding - faster updates (200ms instead of 300ms)
      if (isHoldingRef.current) {
        holdTimerRef.current = setTimeout(updateCounterDuringHold, 180);
      }
    };
    
    // Start the hold update cycle
    updateCounterDuringHold();
  };
  
  const stopHoldingCounter = () => {
    setIsHolding(false);
    isHoldingRef.current = false;
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };
  
  // Clean up any timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
      if (milestoneTimeoutRef.current) {
        clearTimeout(milestoneTimeoutRef.current);
      }
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, []);

  const handleComingSoonClick = async () => {
    // Prevent multiple rapid clicks
    if (isLoading) return;
    
    setIsLoading(true);
    // Optimistically update local count for better UX
    const newCount = clickCount + 1;
    setClickCount(newCount);
    // Check for milestone
    checkAndCelebrateMilestone(newCount);
    // Trigger haptic feedback
    triggerHapticFeedback();
    // Animate the counter
    countAnimationControls.start({
      scale: [1, 1.2, 1],
      rotateX: [0, 15, 0],
      transition: { duration: 0.2 } // Faster animation
    });
    
    try {
      const response = await fetch('/api/clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Get the real count from the server
        const data = await response.json();
        setClickCount(data.count);
        // Check for milestone with server count
        checkAndCelebrateMilestone(data.count);
      } else {
        // If server request fails, revert the count
        setClickCount(prevCount => prevCount - 1);
        console.error('Failed to update click count');
      }
    } catch (error) {
      // If there's an error, revert the count
      setClickCount(prevCount => prevCount - 1);
      console.error('Error updating click count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function for vibe app button clicks
  const handleAppButtonClick = async (appName: string) => {
    // Update local state to show animation
    setShowingAppClick(prev => ({...prev, [appName]: true}));
    
    // Get current global click count
    const currentGlobalCount = clickCount;
    const newCount = currentGlobalCount + 1;
    
    // Update global click count (optimistic update)
    setClickCount(newCount);
    
    // Also update the app-specific display counters to match the global count
    setAppClicks(prev => {
      const updated = {...prev};
      appScreenshots.forEach(app => {
        updated[app.name] = newCount;
      });
      return updated;
    });
    
    // Check for milestone with global count - only show confetti on multiples of 25
    checkAndCelebrateMilestone(newCount);
    
    // Animate the counter with premium effects
    if (controlsMap.current[appName]) {
      controlsMap.current[appName].start({
        opacity: [0, 1, 1, 0],
        y: [20, -10, -15, -30],
        scale: [0.5, 1.3, 1.2, 0.8],
        rotateX: [30, 0, 0, 15],
        filter: ["blur(4px)", "blur(0px)", "blur(0px)", "blur(3px)"],
        transition: { 
          duration: 1.5, 
          times: [0, 0.2, 0.7, 1],
          ease: "easeOut" 
        }
      });
    }
    
    // Also animate the global counter
    countAnimationControls.start({
      scale: [1, 1.2, 1],
      rotateX: [0, 15, 0],
      transition: { duration: 0.2 }
    });
    
    // Trigger haptic feedback
    triggerHapticFeedback();
    
    // Hide the number after animation completes
    setTimeout(() => {
      setShowingAppClick(prev => ({...prev, [appName]: false}));
    }, 1500);
    
    try {
      // Update global click count in database (no appName parameter)
      const response = await fetch('/api/clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Get the real count from the server
        const data = await response.json();
        
        // Update both the global counter and all app-specific counters
        setClickCount(data.count);
        setAppClicks(prev => {
          const updated = {...prev};
          appScreenshots.forEach(app => {
            updated[app.name] = data.count;
          });
          return updated;
        });
        
        // Check for milestone with server count
        checkAndCelebrateMilestone(data.count);
      } else {
        console.error('Failed to update click count');
      }
    } catch (error) {
      console.error('Error updating click count:', error);
    }
  };

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
    "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/superapp1.png",
    "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/superapp2.png",
    "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/superapp3.png",
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
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/sendguys1.png?updatedAt=1747925330519",
        "https://ik.imagekit.io/scriptscrypt/Solana%20App%20Kit/sendguys2.png?updatedAt=1747925330022",
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

  // Auto-scrolling for mobile carousel
  useEffect(() => {
    if (!isMobile || isPaused) return;
    
    const startAutoScroll = () => {
      autoScrollTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          // Calculate total number of slides
          const totalSlides = appScreenshots.length * 2;
          return (prev + 1) % totalSlides;
        });
      }, 2000); // Change slide every 2 seconds (faster than before)
    };
    
    startAutoScroll();
    
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [isMobile, isPaused, appScreenshots.length]);

  // Pause auto-scrolling when user interacts with carousel
  const pauseAutoScroll = () => {
    setIsPaused(true);
    // Resume auto-scrolling after 5 seconds of inactivity
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }
    
    setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  // Function to handle carousel navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    pauseAutoScroll();
  };

  // New function to handle waitlist signup
  const handleOpenWaitlistModal = () => {
    setIsWaitlistModalOpen(true);
  };

  const handleCloseWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
    // Reset form state when closing
    setWaitlistEmail('');
    setSubmitStatus('idle');
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!waitlistEmail || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: waitlistEmail }),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        // Clear email field after successful submission
        setWaitlistEmail('');
        // Trigger confetti for successful signup
        triggerMilestoneConfetti();
        
        // Close modal after a delay
        setTimeout(() => {
          handleCloseWaitlistModal();
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* SuperApp section with background color */}
      <motion.div
        variants={containerVariants}
        className="container mx-auto bg-[#1C2027] py-10 px-4 md:px-8 m-4 rounded-3xl relative overflow-hidden"
      >
        {/* Hexagon pattern background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <svg 
            className="absolute top-0 right-0 w-full h-full opacity-2"
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="superAppHexagonPattern" width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(1.8) rotate(15)">
                <path d="M5,0 L10,8.66 L5,17.32 L0,8.66Z" fill="none" stroke="#64C6FF" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#superAppHexagonPattern)" />
          </svg>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-0 text-center md:text-left max-w-s md:self-center"
          >
            <div className="md:hidden">
              Solana SuperApp
              {/* and feel the magic! */}
            </div>
            <div className="hidden md:block">
              Solana
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
              An All in One Solana SuperApp.
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row gap-3"
            >
              {/* App store download buttons commented out
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
              */}
              
              {/* Waitlist button with click counter */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Count badge on the left */}
                {/* <motion.div 
                  className="flex items-center justify-center bg-white/20 text-white px-4 py-2 rounded-full text-base font-semibold min-w-[40px] h-[40px] perspective-[500px]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={countAnimationControls}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {clickCount}
                </motion.div> */}
                
                <motion.button
                  onClick={handleOpenWaitlistModal}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-white/90 to-white/80 text-black px-6 py-3 rounded-full font-medium w-full md:w-auto text-sm whitespace-nowrap relative overflow-hidden"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.15,
                  }}
                >
                  Get Early Access
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mobile Carousel */}
        {isMobile ? (
          <motion.div
            variants={itemVariants}
            className="mt-10 relative flex flex-col items-center"
          >
            {/* Current App Name Header */}
            <motion.div
              variants={itemVariants}
              className="mb-4 bg-black/50 px-6 py-2 rounded-full"
            >
              <h3 className="text-white font-medium text-base text-center">
                {appScreenshots[Math.floor(currentSlide / 2)].name}
              </h3>
              <p className="text-white/70 text-xs text-center">
                {appScreenshots[Math.floor(currentSlide / 2)].description}
              </p>
            </motion.div>
            
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
                      onTouchStart={pauseAutoScroll}
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
                          width: app.isLandscape ? "280px" : "240px",
                          height: app.isLandscape ? "170px" : "440px",
                        }}
                      >
                        <div className={`relative w-full h-full overflow-hidden rounded-[32px] border-5 border-black`}>
                          <Image
                            src={image}
                            alt={`${app.name} Screenshot ${imageIndex + 1}`}
                            fill
                            className={`object-cover rounded-[24px]`}
                            priority
                          />
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
          </motion.div>
        )}
      </motion.div>

      {/* Vibe Apps section without background */}
      <motion.div 
        variants={containerVariants}
        className="container mx-auto py-10 px-4 md:px-8 m-4"
      >
        {!isMobile && (
          <>
            {/* Vibe Apps Header */}
            <motion.div 
              variants={itemVariants}
              className="w-full max-w-7xl mx-auto my-8 mb-16 text-center"
            >
              <h2 className="text-white text-2xl md:text-4xl font-bold">
                Vibe Apps
              </h2>
            </motion.div>

            {/* First row: 3 apps */}
            <motion.div
              variants={cardVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-7xl mx-auto"
            >
              {appScreenshots.slice(0, 3).map((app, appIndex) => (
                <motion.div
                  key={`desktop-app-row1-${appIndex}`}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`rounded-2xl p-6 shadow-lg relative overflow-hidden group ${
                    app.name === "SendAI Mobile" 
                      ? "bg-gradient-to-r from-[#0BA8F0] to-[#0C91F1]" 
                      : app.name === "Neptune Wallet"
                      ? "bg-gradient-to-r from-[#1C2027] to-[#2C333F]"
                      : app.name === "Sendshot" 
                      ? "bg-gradient-to-r from-[#FFA844] to-[#FFBF44]"
                      : "bg-gradient-to-r from-[#9089FF] to-[#AAA6FD]"
                  }`}
                >
                  {/* Hexagon pattern background */}
                  <div className="absolute inset-0 z-0 overflow-hidden transition-opacity duration-300">
                    <svg 
                      className="absolute top-0 right-0 w-full h-full opacity-[0.02] group-hover:opacity-10"
                      viewBox="0 0 100 100" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern id={`hexagonPattern-${appIndex}`} width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(1.2) rotate(15)">
                          <path d="M5,0 L10,8.66 L5,17.32 L0,8.66Z" fill="none" stroke="#FFFFFF" strokeWidth="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#hexagonPattern-${appIndex})`} />
                    </svg>
                  </div>
                  <div className="flex justify-between items-start mb-1 relative z-10">
                    <div className="text-white font-medium text-lg">
                      {app.name}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Only show counter when clicked */}
                      {showingAppClick[app.name] && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 0 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 0 }}
                          className="bg-white/20 backdrop-blur-sm text-white font-medium px-2 py-0.5 rounded-full text-xs"
                        >
                          {clickCount}
                        </motion.div>
                      )}
                      
                      {/* Interactive button with hover effect */}
                      <motion.button
                        data-app-button={app.name}
                        className="group text-xs bg-white/20 text-white px-3 py-1.5 rounded-full relative overflow-hidden backdrop-blur-sm min-w-[85px]"
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAppButtonClick(app.name)}
                      >
                        <div className="relative">
                          <span className="block transition-opacity duration-200 group-hover:opacity-0">
                            Coming Soon
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
                            SEND it
                          </span>
                        </div>
                      </motion.button>
                    </div>
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-7xl mx-auto mt-8"
            >
              {appScreenshots.slice(3, 5).map((app, appIndex) => (
                <motion.div
                  key={`desktop-app-row2-${appIndex}`}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`rounded-2xl p-6 shadow-lg relative overflow-hidden group ${
                    app.name === "Send Guys" 
                      ? "bg-gradient-to-r from-[#00C978] to-[#00C9A7]" 
                      : app.name === "Social Trading App"
                      ? "bg-gradient-to-r from-[#9089FF] to-[#AAA6FD]"
                      : "bg-[#262A33]"
                  }`}
                >
                  {/* Hexagon pattern background */}
                  <div className="absolute inset-0 z-0 overflow-hidden transition-opacity duration-300">
                    <svg 
                      className="absolute top-0 right-0 w-full h-full opacity-[0.02] group-hover:opacity-10"
                      viewBox="0 0 100 100" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern id={`hexagonPattern-row2-${appIndex}`} width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(1.2) rotate(15)">
                          <path d="M5,0 L10,8.66 L5,17.32 L0,8.66Z" fill="none" stroke="#FFFFFF" strokeWidth="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#hexagonPattern-row2-${appIndex})`} />
                    </svg>
                  </div>
                  <div className="flex justify-between items-start mb-1 relative z-10">
                    <div className="text-white font-medium text-lg">
                      {app.name}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Only show counter when clicked */}
                      {showingAppClick[app.name] && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 0 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 0 }}
                          className="bg-white/20 backdrop-blur-sm text-white font-medium px-2 py-0.5 rounded-full text-xs"
                        >
                          {clickCount}
                        </motion.div>
                      )}
                      
                      {/* Interactive button with hover effect */}
                      <motion.button
                        data-app-button={app.name}
                        className="group text-xs bg-white/20 text-white px-3 py-1.5 rounded-full relative overflow-hidden backdrop-blur-sm min-w-[85px]"
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAppButtonClick(app.name)}
                      >
                        <div className="relative">
                          <span className="block transition-opacity duration-200 group-hover:opacity-0">
                            Coming Soon
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
                            SEND it
                          </span>
                        </div>
                      </motion.button>
                    </div>
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
          </>
        )}
      </motion.div>

      {/* Waitlist Modal */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-[#1C2027] rounded-2xl p-6 md:p-8 w-full max-w-md border border-white/10 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-bold">Join Solana SuperApp Testflight</h3>
              <button 
                onClick={handleCloseWaitlistModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {submitStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="text-green-400 text-6xl mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-white text-xl font-medium mb-2">You're on the list!</h4>
                <p className="text-white/70">Thank you for joining our waitlist. We'll keep you updated on the latest testflight updates.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {submitStatus === 'error' && (
                  <div className="text-red-400 text-sm font-medium">
                    Something went wrong. Please try again.
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || !waitlistEmail}
                  className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0BA8F0] to-[#0C91F1] text-white px-6 py-3 rounded-lg font-medium text-sm ${
                    isSubmitting || !waitlistEmail ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
                
                <p className="text-white/50 text-xs text-center mt-4">
                  We'll keep you updated on the latest testflight updates and add you to the testing list.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
