"use client";
import { useState } from "react";
import BottomNav from "@/app/components/BottomNav";
import { Copy, Gift, Users, ShieldAlert, Award } from "lucide-react";

export default function PromotionPage() {
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://pandora.live/auth/sign-up?inviteCode=EW38482";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      {/* Top Commission Header */}
      <div className="p-6 text-center border-b border-gray-800 bg-gradient-to-b from-[#181a22] to-[#0e1014]">
        <div className="flex justify-center gap-1 text-[#f5a623] mb-1">
          <Award size={18} />
        </div>
        <div className="text-2xl font-black text-white">
          65.16 <span className="text-xs text-[#f5a623] font-bold">INR</span>
        </div>
        <p className="text-[11px] text-gray-400">Yesterday's total commission</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Referral Link Box */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="text-[#f5a623]" size={16} />
            <span className="text-xs font-bold text-gray-200">Invitation Link</span>
          </div>
          <div className="flex items-center gap-2 bg-[#101217] border border-gray-700/60 rounded-xl p-2.5">
            <span className="text-xs text-gray-400 truncate flex-1">{inviteLink}</span>
            <button
              onClick={handleCopy}
              className="bg-[#f5a623] text-black text-xs font-semibold px-3 py-1 rounded-lg hover:bg-[#e0961f] transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* 2x2 Grid Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#16181f] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-300">Today Register Team</span>
            <span className="text-lg font-black text-teal-400 mt-2">0</span>
          </div>
          <div className="bg-[#16181f] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-300">Direct Team Details</span>
            <span className="text-xs text-[#f5a623] mt-2">View &rarr;</span>
          </div>
          <div className="bg-[#16181f] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-300">Subordinate Data</span>
            <span className="text-xs text-[#f5a623] mt-2">Details &rarr;</span>
          </div>
          <div className="bg-[#16181f] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-xs font-bold text-gray-300">Income Details</span>
            <span className="text-xs text-[#f5a623] mt-2">Check &rarr;</span>
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[11px] text-gray-400 block">Direct Members: 2</span>
            <span className="text-[11px] text-gray-400 block">Team Members: 12</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-[#f5a623]">360.88 INR</span>
            <span className="text-[10px] text-gray-400 block">Total commission</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
