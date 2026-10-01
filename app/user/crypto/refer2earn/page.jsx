"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Share2 } from "lucide-react";
import BottomNav from "../../../components/BottomNav";

export default function Refer2EarnPage() {
  const [copiedId, setCopiedId] = useState(false);
  const [userId, setUserId] = useState("EW00022233");
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("pandora_user");
    let uid = "EW00022233";
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.user_id) uid = parsed.user_id;
      } catch (e) {}
    }
    setUserId(uid);
    setInviteUrl(`${window.location.origin}/auth/sign-up?inviteCode=${uid}`);
  }, []);

  const copyText = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Pandora Trading",
          text: `Use my invite code ${userId} to earn bonus!`,
          url: inviteUrl,
        });
      } catch (e) {}
    } else {
      copyText(inviteUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/crypto/home" className="text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-sm">Refer2Earn</span>
        <div className="w-5" />
      </div>

      <div className="p-4 space-y-4">
        {/* Campaign Banner Header */}
        <div>
          <h2 className="text-lg font-black text-white">WIN UP TO 2,000 USDC!</h2>
          <p className="text-xs text-gray-400 mt-1">Let's earn together by joining our platform's time-limited referral campaign.</p>
          <span className="text-xs font-bold text-[#f5a623] block mt-1">#EarnTogether</span>
        </div>

        {/* Magnet Illustration Banner */}
        <div className="bg-[#16181f] border border-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 relative flex items-center justify-center text-6xl">
            🧲
          </div>
          <span className="text-xs text-gray-400 font-semibold mt-2">Invite Friends, Earn Lifetime Commissions</span>
        </div>

        {/* Referral ID Box */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-3.5 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-500 block">Referral ID</span>
            <span className="text-sm font-bold text-gray-200">{userId}</span>
          </div>
          <button onClick={() => copyText(userId)} className="text-gray-400 hover:text-white p-2">
            <Copy size={16} />
          </button>
        </div>

        {/* Referral Link Box */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-3.5 flex justify-between items-center">
          <div className="truncate mr-2">
            <span className="text-[10px] text-gray-500 block">Referral Link</span>
            <span className="text-xs text-gray-300 truncate block">{inviteUrl}</span>
          </div>
          <button onClick={() => copyText(inviteUrl)} className="text-gray-400 hover:text-white p-2 flex-shrink-0">
            <Copy size={16} />
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-[#f5a623] hover:bg-[#e0961f] text-black font-bold py-3 rounded-2xl text-sm transition flex items-center justify-center gap-2"
        >
          <Share2 size={16} />
          {copiedId ? "Copied Link!" : "Share"}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
