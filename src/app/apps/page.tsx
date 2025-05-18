'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Global, IPhone, Smartphone, Copy } from '@solar-icons/react';
import Image from 'next/image';

const mockApps = [
  {
    id: 1,
    name: 'SolanaSwap',
    description: 'A fast and secure DEX for Solana. Trade tokens instantly.',
    tags: ['DeFi', 'Trading'],
    banner: 'https://picsum.photos/seed/solanaswap/400/200',
    website: 'https://solanaswap.app',
    android: '#',
    ios: '#',
  },
  {
    id: 2,
    name: 'DePIN Connect',
    description: 'Connect to decentralized physical infrastructure networks.',
    tags: ['DePIN', 'SocialFi'],
    banner: 'https://picsum.photos/seed/depinnet/400/200',
    website: 'https://depinnet.app',
    android: '#',
    ios: '#',
  },
  {
    id: 3,
    name: 'MemeFi',
    description: 'The ultimate memecoin launchpad and trading platform.',
    tags: ['Memecoins', 'DeFi'],
    banner: 'https://picsum.photos/seed/memefi/400/200',
    website: 'https://memefi.app',
    android: '#',
    ios: '#',
  },
  {
    id: 4,
    name: 'NFT Gallery',
    description: 'Showcase and trade your NFTs with ease.',
    tags: ['NFTs', 'SocialFi'],
    banner: 'https://picsum.photos/seed/nftgallery/400/200',
    website: 'https://nftgallery.app',
    android: '#',
    ios: '#',
  },
];

const spring = { type: 'spring', mass: 1, damping: 10, stiffness: 100 };

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: spring },
  hover: {
    scale: 1.015,
    transition: spring,
  },
};

function use3DImageTilt<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const [isHover, setIsHover] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 12;
      const rotateY = ((x - centerX) / centerX) * -12;
      setStyle({
        transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.10)`,
        transition: isHover ? 'transform 0.15s cubic-bezier(.22,1,.36,1)' : 'transform 0.3s cubic-bezier(.22,1,.36,1)',
        zIndex: 2,
        boxShadow: isHover ? '0 8px 32px 0 rgba(0,0,0,0.25)' : '0 2px 8px 0 rgba(0,0,0,0.10)'
      });
    };
    const handleMouseEnter = () => {
      setIsHover(true);
      setStyle(s => ({ ...s, transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1.10)', zIndex: 2, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)', transition: 'transform 0.2s cubic-bezier(.22,1,.36,1)' }));
    };
    const handleMouseLeave = () => {
      setIsHover(false);
      setStyle({
        transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.4s cubic-bezier(.22,1,.36,1)',
        zIndex: 1,
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'
      });
    };
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHover]);
  return [ref, style] as const;
}

// Helper to shorten CA
function shortenCA(ca: string) {
  if (ca.length <= 10) return ca;
  return ca.slice(0, 5) + '....' + ca.slice(-4);
}

// Example CA and market cap for all cards (could be per-app in real data)
const CA = 'SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa';
const marketCap = '$30M';
const dexscreenerUrl = 'https://dexscreener.com/solana/esr8sbvggbmrcgcddfl9x8dwpgldatgllkkgx3uukoaq';

// Helper to generate random sparkline points for SVG
function getRandomSparklinePoints() {
  // 9 points for a simple sparkline
  const points = Array.from({ length: 9 }, (_, i) => {
    const x = i * 5;
    // y between 2 and 14 for some variation
    const y = 2 + Math.floor(Math.random() * 12);
    return `${x},${y}`;
  });
  return points.join(' ');
}

export default function AppsPage() {
  const [featuredImgRef, featuredImgStyle] = use3DImageTilt<HTMLImageElement>();
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Generate sparkline points once for featured and each grid card
  const featuredSparkline = React.useMemo(() => getRandomSparklinePoints(), []);
  const gridSparklines = React.useMemo(() => mockApps.slice(1).map(() => getRandomSparklinePoints()), []);
  
  // Call hooks at the top level for each app - one for featured, and one for each app in the grid
  // These are named using array destructuring so they're called consistently
  const [img1Ref, img1Style] = use3DImageTilt<HTMLImageElement>();
  const [img2Ref, img2Style] = use3DImageTilt<HTMLImageElement>();
  const [img3Ref, img3Style] = use3DImageTilt<HTMLImageElement>();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Map the refs and styles to the apps
  const imageRefs = [img1Ref, img2Ref, img3Ref];
  const imageStyles = [img1Style, img2Style, img3Style];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Semantic Search Bar */}
      <div className="mb-8">
        <div className="flex justify-center my-12">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center select-none px-4 py-4 rounded-xl shadow-2xl "
            style={{
              textShadow: '0 4px 24px rgba(0,0,0,0.45), 0 1px 0 #fff',
              letterSpacing: '-0.02em',
            }}
          >
            Build & Launch Solana Apps, Faster
          </h1>
        </div>
        <input
          type="text"
          placeholder="Search apps..."
          className="w-full p-3 rounded-lg border border-[#23262B] bg-[#181A20] text-white/90 focus:outline-none focus:ring-2 focus:ring-white/10 placeholder:text-white/40"
        />
      </div>

      {/* Featured App */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-white">Featured App</h2>
        <motion.div
          className="flex flex-col md:flex-row items-center bg-[#23262B] rounded-2xl shadow-lg p-6 gap-6 border border-[#23262B] transition-transform duration-200"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <motion.img
            ref={featuredImgRef}
            style={featuredImgStyle}
            src={mockApps[0].banner}
            alt={mockApps[0].name}
            className="w-full md:w-64 h-40 object-cover rounded-xl border border-[#23262B] bg-[#181A20]"
            whileHover={{ scale: 1.10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 text-white/90">{mockApps[0].name}</h3>
            <p className="mb-2 text-white/70">{mockApps[0].description}</p>
            <div className="mb-2 flex flex-wrap gap-2">
              {mockApps[0].tags.map(tag => (
                <span key={tag} className="bg-[#181A20] text-white/80 px-2 py-0.5 rounded-full text-xs font-medium border border-[#2D3138]">
                  {tag}
                </span>
              ))}
            </div>
            {/* X (Twitter) link below CTAs */}
            <div className="flex mt-2">
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="bg-[#181A20] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium border border-[#23262B] hover:bg-[#23262B] transition">
                <Image src="/icons/twitter-x.svg" alt="X" width={14} height={14} className="inline-block" />
                <span>X</span>
              </a>
            </div>
            {/* CA, Graph, and Market Cap Row at the bottom */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#23262B]">
              <span className="bg-[#181A20] text-white/80 px-2 py-0.5 rounded-full text-xs font-mono border border-[#2D3138] flex items-center gap-1">
                <Image src="/icons/solana.svg" alt="Solana" width={14} height={14} className="inline-block" />
                {shortenCA(CA)}
                <button onClick={handleCopy} className="ml-1 p-0.5 hover:bg-[#23262B] rounded transition" title="Copy CA">
                  {copied ? (
                    <Image src="/icons/Check_Icon.svg" alt="Copied" width={13} height={13} className="inline-block transition-all duration-200" />
                  ) : (
                    <Image src="/Copy_Icon.svg" alt="Copy" width={13} height={13} className="inline-block transition-all duration-200" />
                  )}
                </button>
              </span>
              {/* Inline SVG sparkline graph as placeholder */}
              <span className="flex items-center justify-center mx-2">
                <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <Image src="/icons/dexscreener.png" alt="Dexscreener" width={14} height={14} className="inline-block" />
                {marketCap}
              </a>
            </div>
            
            <div className="flex gap-1 mt-2">
              <a href={mockApps[0].website} target="_blank" rel="noopener noreferrer" className="bg-white text-black rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-neutral-200">
                <Global size={15} weight="Bold" /> <span>Website</span>
              </a>
              <a href={mockApps[0].android} className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]">
                <Smartphone size={15} weight="Bold" /> <span>Android</span>
              </a>
              <a href={mockApps[0].ios} className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]">
                <IPhone size={15} weight="Bold" /> <span>iOS</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Apps Grid/Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">All Apps</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#2D3138] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <Global size={20} weight="Bold" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-[#2D3138] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <Smartphone size={20} weight="Bold" />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockApps.slice(1).map((app, i) => {
              return (
                <motion.div
                  key={app.id}
                  className="bg-[#23262B] rounded-2xl shadow-lg p-4 flex flex-col border border-[#23262B] transition-transform duration-200"
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  variants={cardVariants}
                  transition={{ ...spring, delay: i * 0.1 }}
                >
                  <motion.img
                    ref={imageRefs[i]}
                    style={imageStyles[i]}
                    src={app.banner}
                    alt={app.name}
                    className="w-full h-32 object-cover rounded-xl mb-3 border border-[#23262B] bg-[#181A20]"
                    whileHover={{ scale: 1.10 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  />
                  <h3 className="text-lg font-semibold mb-1 text-white/90">{app.name}</h3>
                  <p className="text-white/70 mb-2 text-sm">{app.description}</p>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {app.tags.map(tag => (
                      <span key={tag} className="bg-[#181A20] text-white/80 px-2 py-0.5 rounded-full text-xs font-medium border border-[#2D3138]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-1 mt-auto">
                    <a href={app.website} target="_blank" rel="noopener noreferrer" className="bg-white text-black rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-neutral-200">
                      <Global size={13} weight="Bold" /> <span>Website</span>
                    </a>
                    <a href={app.android} className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]">
                      <Smartphone size={13} weight="Bold" /> <span>Android</span>
                    </a>
                    <a href={app.ios} className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]">
                      <IPhone size={13} weight="Bold" /> <span>iOS</span>
                    </a>
                  </div>

                  {/* CA, Graph, and Market Cap Row at the bottom */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#23262B]">
                    <span className="bg-[#181A20] text-white/80 px-2 py-0.5 rounded-full text-xs font-mono border border-[#2D3138] flex items-center gap-1">
                      <Image src="/icons/solana.svg" alt="Solana" width={14} height={14} className="inline-block" />
                      {shortenCA(CA)}
                      <button onClick={handleCopy} className="ml-1 p-0.5 hover:bg-[#23262B] rounded transition" title="Copy CA">
                        {copied ? (
                          <Image src="/icons/Check_Icon.svg" alt="Copied" width={13} height={13} className="inline-block transition-all duration-200" />
                        ) : (
                          <Image src="/Copy_Icon.svg" alt="Copy" width={13} height={13} className="inline-block transition-all duration-200" />
                        )}
                      </button>
                    </span>
                    {/* Inline SVG sparkline graph as placeholder */}
                    <span className="flex items-center justify-center mx-2">
                      <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline
                          fill="none"
                          stroke="#4ADE80"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          points={gridSparklines[i]}
                        />
                      </svg>
                    </span>
                    <a
                      href={dexscreenerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#181A20] text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-[#2D3138] flex items-center gap-1 transition-colors duration-200 hover:bg-[#23262B]"
                    >
                      <Image src="/icons/dexscreener.png" alt="Dexscreener" width={14} height={14} className="inline-block" />
                      {marketCap}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#23262B] rounded-2xl shadow-lg border border-[#23262B] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2D3138]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">App</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Tags</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Market Cap</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockApps.slice(1).map((app, i) => (
                    <tr key={app.id} className="border-b border-[#2D3138] last:border-0 hover:bg-[#2D3138]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.banner}
                            alt={app.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="font-medium text-white/90">{app.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70 text-sm">{app.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {app.tags.map(tag => (
                            <span key={tag} className="bg-[#181A20] text-white/80 px-2 py-0.5 rounded-full text-xs font-medium border border-[#2D3138]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={dexscreenerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#181A20] text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-[#2D3138] flex items-center gap-1 transition-colors duration-200 hover:bg-[#23262B]"
                        >
                          <Image src="/icons/dexscreener.png" alt="Dexscreener" width={14} height={14} className="inline-block" />
                          {marketCap}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <a href={app.website} target="_blank" rel="noopener noreferrer" className="bg-white text-black rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-neutral-200">
                            <Global size={13} weight="Bold" />
                          </a>
                          <a href={app.android} className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]">
                            <Smartphone size={13} weight="Bold" />
                          </a>
                          <a href={app.ios} className="bg-[#2D3138] text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium transition hover:bg-[#32363F]">
                            <IPhone size={13} weight="Bold" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 