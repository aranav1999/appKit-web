'use client';
import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const spring = { type: 'spring', mass: 1, damping: 10, stiffness: 100 };
const TAGS = [
  'DeFi', 'DePIN', 'Memecoins',
  'Trading', 'SocialFi', 'NFTs',
  'Wallet', 'Tools', 'Games',
];

export default function SubmitAppPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featureBanner, setFeatureBanner] = useState<File | null>(null);
  const [appLogo, setAppLogo] = useState<File | null>(null);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  
  const featureBannerRef = useRef<HTMLInputElement>(null);
  const appLogoRef = useRef<HTMLInputElement>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags(tags =>
      tags.includes(tag)
        ? tags.filter(t => t !== tag)
        : [...tags, tag]
    );
  };

  const handleFeatureBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFeatureBanner(file);
  };

  const handleAppLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAppLogo(file);
  };

  const handleDrop = useCallback((e: React.DragEvent, setFile: React.Dispatch<React.SetStateAction<File | null>>, setIsDragging: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFile(file);
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, setIsDragging: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, setIsDragging: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Animation variants for background elements
  const settingsIconVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const circleVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

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

      <motion.div
        className="max-w-2xl mx-auto px-4 py-10 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <h1 className="text-3xl text-center font-bold mb-6 text-white">Launch Your App</h1>
        <form className="relative bg-[#23262B]/50 backdrop-blur-sm rounded-lg shadow-lg p-6 flex flex-col gap-4 border border-[#2D3138] overflow-hidden shadow-[0_0_15px_rgba(100,198,255,0.1)]">
          {/* SVG Pattern backgrounds */}
          <div className="absolute inset-0 -z-10">
            {/* Hexagon pattern */}
            <svg 
              className="absolute top-0 right-0 w-56 h-56 opacity-5 transform rotate-45"
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="hexagonPattern" width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
                  <path d="M5,0 L10,8.66 L5,17.32 L0,8.66Z" fill="none" stroke="#64C6FF" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#hexagonPattern)" />
            </svg>
            
            {/* Dots pattern */}
            <svg 
              className="absolute bottom-0 left-0 w-72 h-72 opacity-5"
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="dotPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.8" fill="#64C6FF" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#dotPattern)" />
            </svg>
            
            {/* Waveform pattern */}
            <svg 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 opacity-5"
              viewBox="0 0 200 50" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M0,25 Q25,0 50,25 T100,25 T150,25 T200,25" 
                fill="none" 
                stroke="#64C6FF" 
                strokeWidth="0.5"
              />
              <path 
                d="M0,25 Q25,50 50,25 T100,25 T150,25 T200,25" 
                fill="none" 
                stroke="#64C6FF" 
                strokeWidth="0.5"
              />
            </svg>

            <div className="absolute inset-0" 
                style={{
                  background: 'radial-gradient(circle, transparent 0%, rgba(24, 26, 32, 0.9) 100%)'
                }}
            />
          </div>
          
          {/* App Details */}
          <div className="border-b border-[#2D3138] pb-4 mb-2">
            {/* <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <div className="w-1 h-5 bg-white rounded-full mr-2"></div>
              Basic Information
            </h3> */}
            <div className="space-y-3">
              <div>
                <label className="block font-medium mb-1 text-white/80">App Name</label>
                <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" />
              </div>
              <div>
                <label className="block font-medium mb-1 text-white/80">Description (max 90 chars)</label>
                <textarea maxLength={90} className="w-full p-2 border border-[#2D3138] rounded-2xl bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" />
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="border-b border-[#2D3138] pb-4 mb-2">
            {/* <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <div className="w-1 h-5 bg-white rounded-full mr-2"></div>
              Tags
            </h3> */}
            <div className="flex flex-wrap gap-2 items-center mb-2">
              {TAGS.map(tag => (
                <label key={tag} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="hidden"
                  />
                  <span
                    className={
                      'px-3 py-2 rounded-[12px] border font-medium text-sm transition-all select-none ' +
                      (selectedTags.includes(tag)
                        ? 'bg-white text-black border-white shadow'
                        : 'bg-[#181A20] text-white/80 border-[#2D3138] hover:bg-white/10')
                    }
                  >
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Images */}
          <div className="border-b border-[#2D3138] pb-4 mb-2">
            {/* <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <div className="w-1 h-5 bg-white rounded-full mr-2"></div>
              Images
            </h3> */}
            <div className="space-y-6">
              {/* Feature Banner Upload */}
              <div>
                <label className="block font-medium mb-2 text-white/80">Feature Banner</label>
                <div className="flex flex-col gap-3">
                  {featureBanner && (
                    <div className="relative w-full h-36 bg-[#181A20] rounded-lg overflow-hidden border border-[#2D3138]">
                      <Image 
                        src={URL.createObjectURL(featureBanner)} 
                        alt="Feature Banner Preview" 
                        fill
                        className="object-cover"
                      />
                      <button 
                        className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/75"
                        onClick={() => setFeatureBanner(null)}
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M16.0659 8.9412L15.1547 8.03L12.0659 11.1188L8.97712 8.03L8.06592 8.9412L11.1547 12.03L8.06592 15.1188L8.97712 16.03L12.0659 12.9412L15.1547 16.03L16.0659 15.1188L12.9771 12.03L16.0659 8.9412Z" 
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <div 
                    onClick={() => featureBannerRef.current?.click()}
                    onDrop={(e) => handleDrop(e, setFeatureBanner, setIsDraggingBanner)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, setIsDraggingBanner)}
                    onDragLeave={(e) => handleDragLeave(e, setIsDraggingBanner)}
                    className={`cursor-pointer flex flex-col items-center justify-center border border-dashed rounded-lg p-4 h-28 transition-colors ${
                      isDraggingBanner 
                        ? 'border-white/80 bg-[#181A20]/60' 
                        : 'border-[#2D3138] bg-[#181A20] hover:border-white/50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-white/60">
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="mb-2"
                      >
                        <path 
                          d="M16.6725 13.5H12.5V17.5H11.5V13.5H7.3275L12 8.82753L16.6725 13.5Z" 
                          fill="currentColor"
                        />
                        <path 
                          d="M19 19V11.825L18.25 11.075L12 4.82753L5.75 11.075L5 11.825V19H19ZM20 20H4V11.4L12 3.4L20 11.4V20Z" 
                          fill="currentColor"
                        />
                      </svg>
                      <span className="text-sm font-medium mb-1">Upload Banner</span>
                      <span className="text-xs text-white/40">{isDraggingBanner ? 'Drop image here' : 'Click or drag & drop'}</span>
                    </div>
                    <input
                      type="file"
                      ref={featureBannerRef}
                      onChange={handleFeatureBannerChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-white/50">Recommended: 1200×630px, 16:9 ratio</p>
                </div>
              </div>
              
              {/* App Logo Upload */}
              <div>
                <label className="block font-medium mb-2 text-white/80">App Logo</label>
                <div className="flex flex-col gap-3">
                  {appLogo && (
                    <div className="relative w-24 h-24 bg-[#181A20] rounded-lg overflow-hidden border border-[#2D3138] mx-auto">
                      <Image 
                        src={URL.createObjectURL(appLogo)} 
                        alt="App Logo Preview" 
                        fill
                        className="object-cover"
                      />
                      <button 
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/75"
                        onClick={() => setAppLogo(null)}
                      >
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M16.0659 8.9412L15.1547 8.03L12.0659 11.1188L8.97712 8.03L8.06592 8.9412L11.1547 12.03L8.06592 15.1188L8.97712 16.03L12.0659 12.9412L15.1547 16.03L16.0659 15.1188L12.9771 12.03L16.0659 8.9412Z" 
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <div 
                    onClick={() => appLogoRef.current?.click()}
                    onDrop={(e) => handleDrop(e, setAppLogo, setIsDraggingLogo)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, setIsDraggingLogo)}
                    onDragLeave={(e) => handleDragLeave(e, setIsDraggingLogo)}
                    className={`cursor-pointer flex flex-col items-center justify-center border border-dashed rounded-lg p-4 h-28 transition-colors ${
                      isDraggingLogo 
                        ? 'border-white/80 bg-[#181A20]/60' 
                        : 'border-[#2D3138] bg-[#181A20] hover:border-white/50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-white/60">
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="mb-2"
                      >
                        <path 
                          d="M16.6725 13.5H12.5V17.5H11.5V13.5H7.3275L12 8.82753L16.6725 13.5Z" 
                          fill="currentColor"
                        />
                        <path 
                          d="M19 19V11.825L18.25 11.075L12 4.82753L5.75 11.075L5 11.825V19H19ZM20 20H4V11.4L12 3.4L20 11.4V20Z" 
                          fill="currentColor"
                        />
                      </svg>
                      <span className="text-sm font-medium mb-1">Upload Logo</span>
                      <span className="text-xs text-white/40">{isDraggingLogo ? 'Drop image here' : 'Click or drag & drop'}</span>
                    </div>
                    <input
                      type="file"
                      ref={appLogoRef}
                      onChange={handleAppLogoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-white/50">Recommended: 512×512px, square ratio</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Links */}
          <div className="border-b border-[#2D3138] pb-4 mb-2">
            {/* <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <div className="w-1 h-5 bg-white rounded-full mr-2"></div>
              Links
            </h3> */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1 text-white/80">Website</label>
                <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" />
              </div>
              <div>
                <label className="block font-medium mb-1 text-white/80">Android Link</label>
                <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" />
              </div>
              <div>
                <label className="block font-medium mb-1 text-white/80">iOS Link</label>
                <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" />
              </div>
              <div>
                <label className="block font-medium mb-1 text-white/80">Solana Mobile Link</label>
                <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" />
              </div>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="border-b border-[#2D3138] pb-4 mb-2">
            {/* <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <div className="w-1 h-5 bg-white rounded-full mr-2"></div>
              Social Media
            </h3> */}
            <div className="space-y-3">
              <div>
                <label className="block font-medium mb-1 text-white/80">Submitter Twitter</label>
                <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" />
              </div>
              <div>
                <label className="block font-medium mb-1 text-white/80">Project Twitter</label>
                <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" />
              </div>
            </div>
          </div>
          
          {/* Token Details */}
          <div>
            {/* <h3 className="text-xl font-bold mb-4 text-white flex items-center">
              <div className="w-1 h-5 bg-white rounded-full mr-2"></div>
              Token Details
            </h3> */}
            <div>
              <label className="block font-medium mb-1 text-white/80">Contract Address (CA)</label>
              <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" />
            </div>
          </div>

          <motion.button
            type="submit"
            className="mt-4 bg-white text-black rounded-[12px] px-6 py-2 font-medium transition hover:bg-neutral-200"
            whileHover={{ scale: 1.015 }}
            transition={spring}
          >
            Submit App
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 