"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Global, IPhone, Smartphone, Copy, ArrowRight } from "@solar-icons/react";
import Image from "next/image";
import { fetchApps, fetchCategories } from "@/lib/api-client";
import { App, Category } from "@/lib/db/schema";
import Link from "next/link";

const mockApps = [
  {
    id: 1,
    name: "SolanaSwap",
    description: "A fast and secure DEX for Solana. Trade tokens instantly.",
    tags: ["DeFi", "Trading"],
    banner: "https://picsum.photos/seed/solanaswap/400/200",
    website: "https://solanaswap.app",
    android: "#",
    ios: "#",
  },
  {
    id: 2,
    name: "DePIN Connect",
    description: "Connect to decentralized physical infrastructure networks.",
    tags: ["DePIN", "SocialFi"],
    banner: "https://picsum.photos/seed/depinnet/400/200",
    website: "https://depinnet.app",
    android: "#",
    ios: "#",
  },
  {
    id: 3,
    name: "MemeFi",
    description: "The ultimate memecoin launchpad and trading platform.",
    tags: ["Memecoins", "DeFi"],
    banner: "https://picsum.photos/seed/memefi/400/200",
    website: "https://memefi.app",
    android: "#",
    ios: "#",
  },
  {
    id: 4,
    name: "NFT Gallery",
    description: "Showcase and trade your NFTs with ease.",
    tags: ["NFTs", "SocialFi"],
    banner: "https://picsum.photos/seed/nftgallery/400/200",
    website: "https://nftgallery.app",
    android: "#",
    ios: "#",
  },
  {
    id: 5,
    name: "Solana Wallet",
    description:
      "Secure and user-friendly wallet for managing your Solana assets.",
    tags: ["Wallet", "Security"],
    banner: "https://picsum.photos/seed/solanawallet/400/200",
    website: "https://solanawallet.app",
    android: "#",
    ios: "#",
  },
  {
    id: 6,
    name: "GameFi Hub",
    description: "Play-to-earn games built on Solana with instant rewards.",
    tags: ["GameFi", "P2E"],
    banner: "https://picsum.photos/seed/gamefi/400/200",
    website: "https://gamefi.app",
    android: "#",
    ios: "#",
  },
  {
    id: 7,
    name: "SolPay",
    description:
      "Lightning-fast payment solution for Solana merchants and users.",
    tags: ["Payments", "Retail"],
    banner: "https://picsum.photos/seed/solpay/400/200",
    website: "https://solpay.app",
    android: "#",
    ios: "#",
  },
  {
    id: 8,
    name: "DAO Maker",
    description:
      "Create and manage decentralized autonomous organizations on Solana.",
    tags: ["DAO", "Governance"],
    banner: "https://picsum.photos/seed/daomaker/400/200",
    website: "https://daomaker.app",
    android: "#",
    ios: "#",
  },
  {
    id: 9,
    name: "SolStake",
    description: "Simplified staking solution with competitive APY rates.",
    tags: ["Staking", "Yield"],
    banner: "https://picsum.photos/seed/solstake/400/200",
    website: "https://solstake.app",
    android: "#",
    ios: "#",
  },
];

const spring = { type: "spring", mass: 1, damping: 10, stiffness: 100 };

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: spring },
  hover: {
    scale: 1.015,
    transition: spring,
  },
};

// Animation variants for background elements
const settingsIconVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const circleVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 0.8, 0.6],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Replace 3D tilt with subtle hover animations
const cardHoverVariants = {
  initial: {
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    scale: 1,
  },
  hover: {
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// Helper to shorten CA
function shortenCA(ca: string) {
  if (ca.length <= 10) return ca;
  return ca.slice(0, 5) + "...." + ca.slice(-4);
}

// Example CA and market cap for all cards (could be per-app in real data)
const CA = "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa";
const marketCap = "$30M";
const dexscreenerUrl =
  "https://dexscreener.com/solana/esr8sbvggbmrcgcddfl9x8dwpgldatgllkkgx3uukoaq";

// Helper to generate sparkline points for SVG - now using deterministic values
function getRandomSparklinePoints(seedId = 0) {
  // Use deterministic points based on seedId to avoid hydration errors
  const predefinedPoints = [
    "0,10 5,2 10,5 15,9 20,6 25,6 30,7 35,11 40,7", // 0
    "0,10 5,9 10,10 15,9 20,3 25,11 30,11 35,4 40,5", // 1
    "0,2 5,10 10,9 15,9 20,8 25,5 30,5 35,9 40,8", // 2
    "0,7 5,5 10,8 15,12 20,11 25,10 30,5 35,5 40,4", // 3
    "0,9 5,7 10,6 15,10 20,7 25,3 30,10 35,3 40,7", // 4
    "0,12 5,8 10,4 15,8 20,12 25,9 30,7 35,10 40,2", // 5
    "0,6 5,7 10,11 15,11 20,11 25,12 30,8 35,13 40,11", // 6
    "0,12 5,8 10,12 15,6 20,2 25,9 30,9 35,10 40,10", // 7
    "0,9 5,4 10,3 15,10 20,5 25,7 30,4 35,5 40,8", // 8
  ];

  // Use seedId to select a point pattern, or fallback to the first pattern
  const pointIndex = seedId % predefinedPoints.length;
  return predefinedPoints[pointIndex];
}

// Replace AppCard component
function AppCard({ app, index }: { app: App; index: number }) {
  const sparklinePoints = getRandomSparklinePoints(app.id || index);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      whileHover="hover"
      className="relative"
    >
      <motion.div
        initial="initial"
        whileHover="hover"
        variants={cardHoverVariants}
        className="bg-[#23262B]/50 backdrop-blur-sm border border-[#2D3138] rounded-[18px] overflow-hidden shadow-lg transition-all"
      >
        {/* Card Banner */}
        <div className="relative h-40 w-full overflow-hidden bg-gradient-to-r from-[#1a1d22] to-[#1a2029]">
          {app.featureBannerUrl ? (
            <Image
              src={app.featureBannerUrl}
              alt={app.name || "App banner"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400 text-sm">No image available</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* App Icon */}
            <div className="flex-shrink-0 w-16 h-16 bg-[#181A20] rounded-2xl shadow overflow-hidden border border-[#2D3138] relative">
              {app.iconUrl ? (
                <Image
                  src={app.iconUrl}
                  alt={app.name || "App icon"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400 text-xs">No logo</span>
                </div>
              )}
            </div>

            {/* App Info */}
            <div className="flex-1 overflow-hidden">
              <h3 className="text-lg font-semibold text-white mb-1 truncate">
                {app.name}
              </h3>
              <p className="text-[13px] text-gray-400 line-clamp-2">
                {app.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {Array.isArray(app.tags) &&
                  app.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] font-medium bg-[#1B1D22] rounded-full text-[#64C6FF] border border-[#2D3138]"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* X (Twitter) link */}
          <div className="flex mt-2">
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#181A20] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium border border-[#23262B] hover:bg-[#23262B] transition"
            >
              <Image
                src="/icons/twitter-x.svg"
                alt="X"
                width={18}
                height={14}
                className="inline-block"
              />
              <span>{app.projectTwitter?.replace("https://x.com/", "")}</span>
            </a>
          </div>

          {/* Links section with border above */}
          <div className="flex gap-1 mt-3 pt-2 border-t border-[#23262B]">
            {app.websiteUrl && (
              <a
                href={app.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-neutral-200"
              >
                <Global size={13} weight="Bold" /> <span>Website</span>
              </a>
            )}
            {app.androidUrl && (
              <a
                href={app.androidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]"
              >
                <Smartphone size={13} weight="Bold" /> <span>Android</span>
              </a>
            )}
            {app.iosUrl && (
              <a
                href={app.iosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]"
              >
                <IPhone size={13} weight="Bold" /> <span>iOS</span>
              </a>
            )}
          </div>

          {/* CA, Graph, and Market Cap Row */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#23262B]">
            <span className="bg-[#181A20] text-white/80 px-2 py-0.5 rounded-full text-xs font-mono border border-[#2D3138] flex items-center gap-1">
              <Image
                src="/icons/send-logo.png"
                alt="Solana"
                width={12}
                height={12}
                className="inline-block"
              />
              {shortenCA(CA)}
              <button
                onClick={handleCopy}
                className="ml-1 p-0.5 hover:bg-[#23262B] rounded transition"
                title="Copy CA"
              >
                {copied ? (
                  <Image
                    src="/icons/Check_Icon.svg"
                    alt="Copied"
                    width={11}
                    height={11}
                    className="inline-block transition-all duration-200"
                  />
                ) : (
                  <Image
                    src="/Copy_Icon.svg"
                    alt="Copy"
                    width={11}
                    height={11}
                    className="inline-block transition-all duration-200"
                  />
                )}
              </button>
            </span>

            {/* Inline SVG sparkline graph */}
            <span className="flex items-center justify-center mx-2">
              <svg
                width="36"
                height="16"
                viewBox="0 0 40 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={sparklinePoints}
                />
              </svg>
            </span>

            {/* Dexscreener link */}
            <a
              href={dexscreenerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#181A20] text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-[#2D3138] flex items-center gap-1 transition-colors duration-200 hover:bg-[#23262B]"
            >
              <Image
                src="/icons/dexscreener.png"
                alt="Dexscreener"
                width={12}
                height={12}
                className="inline-block"
              />
              {marketCap}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Replace FeaturedApp component
function FeaturedApp({ app }: { app: any }) {
  const [copied, setCopied] = useState(false);
  const featuredSparkline = useMemo(() => getRandomSparklinePoints(0), []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={cardHoverVariants}
      className="flex flex-col md:flex-row items-center bg-[#23262B]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 gap-6 border border-[#23262B] transition-transform duration-200"
    >
      <motion.img
        src={app.banner}
        alt={app.name}
        className="w-full md:w-64 h-40 object-cover rounded-xl border border-[#23262B] bg-[#181A20]"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2 text-white/90">{app.name}</h3>
        <p className="mb-2 text-white/70">{app.description}</p>
        <div className="mb-2 flex flex-wrap gap-2">
          {app.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-[#181A20] text-white/80 px-2 py-0.5 rounded-full text-xs font-medium border border-[#2D3138]"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* X (Twitter) link below CTAs */}
        <div className="flex mt-2">
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#181A20] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium border border-[#23262B] hover:bg-[#23262B] transition"
          >
            <Image
              src="/icons/twitter-x.svg"
              alt="X"
              width={18}
              height={14}
              className="inline-block"
            />
            <span>X</span>
          </a>
        </div>
        
        {/* Links section with border above */}
        <div className="flex gap-1 mt-3 pt-2 border-t border-[#23262B]">
          <a
            href={app.website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-neutral-200"
          >
            <Global size={15} weight="Bold" /> <span>Website</span>
          </a>
          <a
            href={app.android}
            className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]"
          >
            <Smartphone size={15} weight="Bold" /> <span>Android</span>
          </a>
          <a
            href={app.ios}
            className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]"
          >
            <IPhone size={15} weight="Bold" /> <span>iOS</span>
          </a>
        </div>
        
        {/* CA, Graph, and Market Cap Row at the bottom */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#23262B]">
          <span className="bg-[#181A20] text-white/80 px-2 py-0.5 rounded-full text-xs font-mono border border-[#2D3138] flex items-center gap-1">
            <Image
              src="/icons/send-logo.png"
              alt="Solana"
              width={14}
              height={14}
              className="inline-block"
            />
            {shortenCA(CA)}
            <button
              onClick={handleCopy}
              className="ml-1 p-0.5 hover:bg-[#23262B] rounded transition"
              title="Copy CA"
            >
              {copied ? (
                <Image
                  src="/icons/Check_Icon.svg"
                  alt="Copied"
                  width={13}
                  height={13}
                  className="inline-block transition-all duration-200"
                />
              ) : (
                <Image
                  src="/Copy_Icon.svg"
                  alt="Copy"
                  width={13}
                  height={13}
                  className="inline-block transition-all duration-200"
                />
              )}
            </button>
          </span>
          {/* Inline SVG sparkline graph as placeholder */}
          <span className="flex items-center justify-center mx-2">
            <svg
              width="40"
              height="16"
              viewBox="0 0 40 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={featuredSparkline}
              />
            </svg>
          </span>
          <a
            href={dexscreenerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#181A20] text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-[#2D3138] flex items-center gap-1 transition-colors duration-200 hover:bg-[#23262B]"
          >
            <Image
              src="/icons/dexscreener.png"
              alt="Dexscreener"
              width={14}
              height={14}
              className="inline-block"
            />
            {marketCap}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Add new TrendingAppCard component after the FeaturedApp component
function TrendingAppCard({ app, index }: { app: App; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      whileHover="hover"
      className="relative"
    >
      <motion.div
        initial="initial"
        whileHover="hover"
        variants={cardHoverVariants}
        className="bg-[#23262B]/50 backdrop-blur-sm border border-[#2D3138] rounded-[18px] overflow-hidden shadow-lg transition-all p-4"
      >
        <div className="flex items-start gap-3">
          {/* App Icon - Increased size */}
          <div className="flex-shrink-0 w-20 h-20 bg-[#181A20] rounded-xl shadow overflow-hidden border border-[#2D3138] relative">
            {app.iconUrl ? (
              <Image
                src={app.iconUrl}
                alt={app.name || "App icon"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-xs">No logo</span>
              </div>
            )}
          </div>

          {/* App Info */}
          <div className="flex-1 overflow-hidden">
            <h3 className="text-md font-semibold text-white mb-1 truncate">
              {app.name}
            </h3>
            <p className="text-xs text-gray-400 line-clamp-2 mb-2">
              {app.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-1">
              {app.websiteUrl && (
                <a
                  href={app.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-neutral-200"
                >
                  <Global size={10} weight="Bold" /> <span>Website</span>
                </a>
              )}
              
              <span className="bg-[#181A20] text-white/80 px-2 py-0.5 rounded-full text-xs font-mono border border-[#2D3138] flex items-center gap-1">
                <Image
                  src="/icons/send-logo.png"
                  alt="Solana"
                  width={10}
                  height={10}
                  className="inline-block"
                />
                {shortenCA(CA)}
                <button
                  onClick={handleCopy}
                  className="ml-1 p-0.5 hover:bg-[#23262B] rounded transition"
                  title="Copy CA"
                >
                  {copied ? (
                    <Image
                      src="/icons/Check_Icon.svg"
                      alt="Copied"
                      width={10}
                      height={10}
                      className="inline-block transition-all duration-200"
                    />
                  ) : (
                    <Image
                      src="/Copy_Icon.svg"
                      alt="Copy"
                      width={10}
                      height={10}
                      className="inline-block transition-all duration-200"
                    />
                  )}
                </button>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AppsPage() {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Add state for actual data
  const [apps, setApps] = useState<App[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dropdown ref for handling outside clicks
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Fetch apps and categories from API
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch apps and categories in parallel
        const [appsData, categoriesData] = await Promise.all([
          fetchApps(),
          fetchCategories(),
        ]);

        setApps(appsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load apps. Please try again later.");
        // Use mock data as fallback
        setApps(
          mockApps.map(
            (app) =>
              ({
                ...app,
                iconUrl: app.banner,
                websiteUrl: app.website,
                androidUrl: app.android,
                iosUrl: app.ios,
                tags: app.tags,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as unknown as App)
          )
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Get all unique tags from mockApps
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    tags.add("All"); // Add "All" as the default option
    mockApps.forEach((app) => {
      app.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Filter apps by selected tag
  const filteredApps = React.useMemo(() => {
    return apps.filter((app) => {
      if (selectedTag === "All") return true;
      return (
        app.tags && Array.isArray(app.tags) && app.tags.includes(selectedTag)
      );
    });
  }, [apps, selectedTag]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Render loading state with skeletons
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#131519] to-[#1a2740] -z-10" />

        <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
          {/* Skeleton Search Bar */}
          <div className="mb-8">
            <div className="flex justify-center my-12">
              <div className="h-12 w-3/4 bg-[#23262B]/50 rounded-xl animate-pulse"></div>
            </div>
            <div className="w-full h-12 rounded-lg bg-[#23262B]/50 animate-pulse"></div>
          </div>

          {/* Skeleton Featured App */}
          <div className="mb-12">
            <div className="h-8 w-40 bg-[#23262B]/50 rounded-lg mb-4 animate-pulse"></div>
            <div className="flex flex-col md:flex-row bg-[#23262B]/50 rounded-2xl p-6 gap-6 animate-pulse">
              <div className="w-full md:w-64 h-40 bg-[#181A20] rounded-xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-[#181A20] rounded-lg w-1/3"></div>
                <div className="h-4 bg-[#181A20] rounded-lg w-full"></div>
                <div className="h-4 bg-[#181A20] rounded-lg w-5/6"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-[#181A20] rounded-full w-16"></div>
                  <div className="h-6 bg-[#181A20] rounded-full w-16"></div>
                </div>
                <div className="h-px bg-[#2D3138] w-full my-2"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-[#181A20] rounded-full w-24"></div>
                  <div className="h-6 bg-[#181A20] rounded-full w-20"></div>
                  <div className="h-6 bg-[#181A20] rounded-full w-24"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-[#181A20] rounded-full w-24"></div>
                  <div className="h-8 bg-[#181A20] rounded-full w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Skeleton Apps Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-32 bg-[#23262B]/50 rounded-lg animate-pulse"></div>
                <div className="h-8 w-24 bg-[#23262B]/50 rounded-lg animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-[#23262B]/50 rounded-lg animate-pulse"></div>
                <div className="h-10 w-10 bg-[#23262B]/50 rounded-lg animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#23262B]/50 rounded-[18px] overflow-hidden animate-pulse"
                  >
                    <div className="h-40 bg-[#181A20]"></div>
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-[#181A20] rounded-2xl"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-[#181A20] rounded-lg w-3/4"></div>
                          <div className="h-4 bg-[#181A20] rounded-lg w-full"></div>
                          <div className="flex gap-1">
                            <div className="h-4 bg-[#181A20] rounded-full w-12"></div>
                            <div className="h-4 bg-[#181A20] rounded-full w-14"></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="h-6 w-12 bg-[#181A20] rounded-full"></div>
                      </div>
                      <div className="flex justify-between mt-3 pt-2 border-t border-[#2D3138]">
                        <div className="h-6 bg-[#181A20] rounded-full w-20"></div>
                        <div className="h-4 w-10 bg-[#181A20]"></div>
                        <div className="h-6 bg-[#181A20] rounded-full w-20"></div>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <div className="h-8 bg-[#181A20] rounded-full w-24"></div>
                        <div className="h-8 bg-[#181A20] rounded-full w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#131519] flex items-center justify-center">
        <div className="bg-[#23262B]/50 p-8 rounded-lg shadow-lg text-white/90 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-white text-black rounded-md"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#131519] to-[#1a2740] -z-10" />

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        {/* Left decoration */}
        <motion.svg
          id="settingsIcon"
          className="absolute left-0 top-[20%] opacity-10 w-[200px] h-[200px]"
          viewBox="0 0 205 209"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          variants={settingsIconVariants}
          animate="animate"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M84.8449 2.36017C93.3022 0.868169 97.5308 0.122166 101.452 1.08139C102.81 1.41346 104.127 1.89276 105.381 2.51079C109.002 4.29605 111.747 7.56744 117.238 14.1102C122.729 20.653 125.475 23.9244 129.096 25.7097C130.349 26.3277 131.666 26.807 133.024 27.139C136.945 28.0983 141.151 27.3563 149.563 25.8723C157.975 24.3883 162.181 23.6463 166.102 24.6056C167.46 24.9376 168.777 25.4169 170.03 26.035C173.651 27.8202 176.412 31.1093 181.933 37.6875C187.541 44.3707 190.346 47.7122 191.468 51.6587C191.828 52.9219 192.056 54.2185 192.151 55.5283C192.447 59.6207 190.957 63.7147 187.978 71.9027C185.02 80.0316 183.541 84.096 183.823 88.1608C183.915 89.4879 184.145 90.8018 184.508 92.0814C185.622 96.0006 188.382 99.3087 193.9 105.925C199.419 112.541 202.178 115.849 203.292 119.769C203.656 121.048 203.886 122.362 203.978 123.689C204.26 127.754 202.775 131.835 199.805 139.996C196.835 148.158 195.351 152.239 192.522 155.172C191.599 156.129 190.578 156.988 189.477 157.735C186.105 160.022 181.865 160.783 173.385 162.306C164.905 163.828 160.665 164.589 157.293 166.876C156.192 167.623 155.171 168.482 154.248 169.439C151.42 172.372 149.941 176.437 146.983 184.566C144.003 192.754 142.514 196.848 139.657 199.793C138.743 200.736 137.735 201.582 136.648 202.319C133.251 204.621 128.955 205.379 120.363 206.895C111.906 208.387 107.677 209.133 103.755 208.174C102.398 207.842 101.081 207.363 99.8272 206.745C96.2062 204.959 93.4607 201.688 87.9697 195.145C82.4787 188.602 79.7331 185.331 76.1122 183.546C74.8587 182.928 73.5414 182.448 72.1839 182.116C68.2623 181.157 64.0565 181.899 55.6448 183.383C47.233 184.867 43.0272 185.609 39.1056 184.65C37.7481 184.318 36.4308 183.838 35.1773 183.22C31.5564 181.435 28.796 178.146 23.2753 171.568C17.6664 164.885 14.862 161.543 13.7394 157.597C13.3801 156.333 13.1514 155.037 13.0567 153.727C12.7611 149.635 14.2449 145.557 17.2123 137.402C20.1798 129.246 21.6635 125.169 21.3679 121.077C21.2733 119.767 21.0445 118.47 20.6852 117.207C19.5626 113.26 16.7732 109.937 11.1944 103.289C5.61558 96.6418 2.82617 93.3181 1.70359 89.3716C1.3443 88.1085 1.11555 86.8118 1.02093 85.502C0.725336 81.4096 2.20906 77.332 5.17652 69.1767C8.14395 61.0215 9.62766 56.9439 12.4841 53.9985C13.3984 53.0557 14.407 52.2093 15.4941 51.4724C18.8904 49.1702 23.1635 48.4164 31.7097 46.9087C40.2559 45.401 44.5291 44.6471 47.9253 42.3449C49.0125 41.608 50.0211 40.7615 50.9354 39.8187C53.7918 36.8733 55.2755 32.7957 58.2429 24.6405C61.2103 16.4853 62.694 12.4076 65.5505 9.46217C66.4647 8.51942 67.4733 7.67297 68.5604 6.9361C71.9567 4.63389 76.2528 3.87599 84.8449 2.36017Z"
            fill="#64C6FF"
            fillOpacity="0.6"
          />
        </motion.svg>

        {/* Right decoration circle */}
        <motion.svg
          id="circleElement"
          className="absolute right-12 top-[40%] opacity-5 w-[350px] h-[350px]"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          variants={circleVariants}
          animate="animate"
        >
          <circle cx="100" cy="100" r="100" fill="#64C6FF" />
        </motion.svg>

        {/* Bottom right zigzag */}
        <svg
          className="absolute right-0 bottom-0 opacity-10 w-[300px] h-[300px]"
          viewBox="0 0 446 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M81.2498 8.80003C59.4331 1.35181 48.5248 -2.37229 39.4334 2.0914C30.342 6.55509 26.6179 17.4634 19.1697 39.28L9.44654 67.7601C1.99832 89.5767 -1.72579 100.485 2.7379 109.576C7.20159 118.668 18.1099 122.392 39.9265 129.84L64.8466 138.348C76.594 142.358 82.4677 144.364 84.8712 149.259C87.2747 154.155 85.2694 160.028 81.2589 171.776L64.2434 221.616C56.7952 243.432 53.0711 254.341 57.5348 263.432C61.9985 272.524 72.9068 276.248 94.7234 283.696L116.083 290.988C127.831 294.999 133.705 297.004 136.108 301.899C138.512 306.795 136.506 312.669 132.496 324.416L115.48 374.256C108.032 396.073 104.308 406.981 108.772 416.072C113.235 425.164 124.144 428.888 145.96 436.336L364.901 511.083C386.717 518.531 397.625 522.255 406.717 517.791C415.808 513.327 419.532 502.419 426.981 480.603L436.704 452.123C444.152 430.306 447.876 419.398 443.412 410.306C438.949 401.215 428.04 397.491 406.224 390.042L384.864 382.75C373.116 378.739 367.243 376.734 364.839 371.839C362.436 366.943 364.441 361.07 368.451 349.322L385.467 299.482C392.915 277.666 396.639 266.757 392.176 257.666C387.712 248.574 376.804 244.85 354.987 237.402L330.067 228.894C318.319 224.884 312.446 222.879 310.042 217.983C307.639 213.088 309.644 207.214 313.655 195.467L330.67 145.627C338.118 123.81 341.842 112.902 337.379 103.81C332.915 94.7188 322.007 90.9947 300.19 83.5465L81.2498 8.80003Z"
            fill="#64C6FF"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        {/* Semantic Search Bar */}
        <div className="mb-8">
          <div className="flex justify-center my-12 mb-4">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center select-none px-4 py-4 rounded-xl shadow-2xl "
              style={{
                textShadow: "0 4px 24px rgba(0,0,0,0.45), 0 1px 0 #fff",
                letterSpacing: "-0.02em",
              }}
            >
              Build & Launch Solana Apps, Faster
            </h1>
          </div>
          
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link 
                href="/apps/submit" 
                className="bg-white text-black hover:bg-white/90 transition-all duration-200 font-semibold py-2 px-6 rounded-full flex items-center gap-2 shadow-lg"
              >
                <motion.span
                  initial={{ marginRight: 0 }}
                  whileHover={{ marginRight: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Submit App
                </motion.span>
                <motion.div
                  initial={{ marginLeft: 0 }}
                  whileHover={{ marginLeft: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ArrowRight size={20} weight="Bold" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
          
          <input
            type="text"
            placeholder="Search apps, devs, CAs and more..."
            className="w-full p-3 rounded-lg border border-[#23262B] bg-[#181A20] text-white/90 focus:outline-none focus:ring-2 focus:ring-white/10 placeholder:text-white/40"
          />
        </div>

        {/* Featured App */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Featured App</h2>
          {apps.length > 0 && <FeaturedApp app={{
            name: apps[0].name,
            description: apps[0].description,
            banner: apps[0].featureBannerUrl || apps[0].iconUrl,
            tags: apps[0].tags || [],
            website: apps[0].websiteUrl,
            android: apps[0].androidUrl,
            ios: apps[0].iosUrl
          }} />}
        </div>
        
        {/* Trending Apps Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Trending</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.slice(0, 4).map((app, i) => (
              <TrendingAppCard key={`trending-${app.id || i}`} app={app} index={i} />
            ))}
          </div>
        </div>

        {/* Apps Grid/Table */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">All Apps</h2>
              {/* Custom themed dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-[#2D3138] text-white rounded-lg px-3 py-1.5 text-sm font-medium border border-[#23262B] hover:bg-[#32363F] transition-colors focus:outline-none focus:ring-1 focus:ring-white/10"
                >
                  <span>{selectedTag}</span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-48 bg-[#23262B] border border-[#32363F] rounded-lg shadow-lg py-1 max-h-56 overflow-y-auto scrollbar-hide">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTag(tag);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          selectedTag === tag
                            ? "bg-[#32363F] text-white font-medium"
                            : "text-white/80 hover:bg-[#32363F] hover:text-white"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#2D3138] text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Global size={20} weight="Bold" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-[#2D3138] text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Smartphone size={20} weight="Bold" />
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map((app, i) => (
                <AppCard key={app.id || i} app={app} index={i} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#2D3138]">
                <thead className="bg-[#1D1F25]">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider"
                    >
                      App
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider"
                    >
                      Links
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#23262B]/50 divide-y divide-[#2D3138]">
                  {filteredApps.map((app, i) => (
                    <tr
                      key={app.id || i}
                      className="hover:bg-[#1A1D22]/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-[#1B1D22] border border-[#2D3138] relative">
                            {app.iconUrl ? (
                              <Image
                                src={app.iconUrl}
                                alt={app.name || "App icon"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-gray-400 text-xs">
                                  No logo
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{app.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Array.isArray(app.tags) &&
                                app.tags?.slice(0, 2).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 text-[10px] bg-[#1B1D22] rounded-full text-[#64C6FF] border border-[#2D3138]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white/80 text-sm line-clamp-2">
                          {app.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs text-white/90 bg-[#1B1D22] rounded-full border border-[#2D3138]">
                          {app.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {app.websiteUrl && (
                            <a
                              href={app.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white text-black rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-neutral-200"
                            >
                              <Global size={13} />
                            </a>
                          )}
                          {app.androidUrl && (
                            <a
                              href={app.androidUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]"
                            >
                              <Smartphone size={13} />
                            </a>
                          )}
                          {app.iosUrl && (
                            <a
                              href={app.iosUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]"
                            >
                              <IPhone size={13} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
