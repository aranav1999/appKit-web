'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const spring = { type: 'spring', mass: 1, damping: 10, stiffness: 100 };
const TAGS = [
  'DeFi', 'DePIN', 'Memecoins',
  'Trading', 'SocialFi', 'NFTs',
  'Wallet', 'Tools', 'Games',
];

export default function SubmitAppPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(tags =>
      tags.includes(tag)
        ? tags.filter(t => t !== tag)
        : [...tags, tag]
    );
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
    >
      <h1 className="text-3xl font-bold mb-6 text-white">Submit Your App</h1>
      <form className="bg-[#23262B] rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-[#23262B]">
        {/* App Details */}
        <div>
          <label className="block font-medium mb-1 text-white/80">App Name</label>
          <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="Enter app name" />
        </div>
        <div>
          <label className="block font-medium mb-1 text-white/80">Description (max 90 chars)</label>
          <textarea maxLength={90} className="w-full p-2 border border-[#2D3138] rounded-2xl bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="Short description" />
        </div>
        <div>
          <label className="block font-medium mb-1 text-white/80">Tags</label>
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
        <div>
          <label className="block font-medium mb-1 text-white/80">Feature Banner URL</label>
          <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="Image URL" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-medium mb-1 text-white/80">Website</label>
            <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="https://" />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1 text-white/80">Android Link</label>
            <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="Play Store URL" />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1 text-white/80">iOS Link</label>
            <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="App Store URL" />
          </div>
        </div>
        {/* Socials */}
        <div>
          <label className="block font-medium mb-1 text-white/80">Submitter Twitter</label>
          <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="@yourhandle" />
        </div>
        <div>
          <label className="block font-medium mb-1 text-white/80">Project Twitter</label>
          <input type="text" className="w-full p-2 border border-[#2D3138] rounded-[12px] bg-[#181A20] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="@projecthandle" />
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
  );
} 