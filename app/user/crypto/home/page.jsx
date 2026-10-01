"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "../../../components/BottomNav";
import { UserCheck, RefreshCw, PlayCircle, HelpCircle, User, Flame } from "lucide-react";

export default function HomePage() {
  const [balance, setBalance] = useState("131.52");

  useEffect(() => {
    const user = localStorage.getItem("pandora_user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.balance) setBalance(parsed.balance);
      } catch (e) {}
    }
  }, []);

  const trendingCoins = [
    { name: "Bitcoin", pair: "BTC/USDT", price: "84,759", fullPrice: "$84759.00000000", chg: "+1.4135%", down: false },
    { name: "Ethereum", pair: "ETH/USDT", price: "2,701.35", fullPrice: "$2701.35000000", chg: "+1.0308%", down: false },
    { name: "BNB", pair: "BNB/USDT", price: "769.75", fullPrice: "$769.75000000", chg: "+0.4986%", down: false },
    { name: "XRP", pair: "XRP/USDT", price: "1.50", fullPrice: "$1.50000000", chg: "+0.8801%", down: false },
    { name: "USDC", pair: "USDC/USDT", price: "0.9999", fullPrice: "$0.99989400", chg: "+0.0097%", down: false },
    { name: "Solana", pair: "SOL/USDT", price: "118.41", fullPrice: "$118.41000000", chg: "+0.6956%", down: false },
    { name: "TRON", pair: "TRX/USDT", price: "0.3358", fullPrice: "$0.33581600", chg: "-0.6380%", down: true },
  ];

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-teal-500/50 bg-[#161922] flex items-center justify-center">
            <span className="text-sm">🌐</span>
          </div>
          <span className="font-bold text-sm tracking-wider">PANDORA</span>
        </div>
        <Link href="/user/crypto/assets" className="w-8 h-8 rounded-full bg-[#181a20] flex items-center justify-center text-gray-400">
          <User size={18} />
        </Link>
      </div>

      <div className="p-4 space-y-4">
        {/* Wallet Balance Card */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4">
          <span className="text-xs text-gray-400 block mb-1">Est. Total Wallet</span>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-extrabold text-white">{balance}</span>
            <span className="text-xs font-semibold text-[#f5a623]">INR</span>
          </div>

          {/* 4 Connected Quick Nav Cards (Video 00:00 - 00:30) */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-800/80">
            <Link href="/user/crypto/refer2earn" className="flex flex-col items-center gap-1 group">
              <div className="w-11 h-11 rounded-2xl bg-[#1f222b] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition border border-gray-800">
                <UserCheck size={20} />
              </div>
              <span className="text-[10px] text-gray-300 font-medium">Refer2Earn</span>
            </Link>

            <Link href="/user/crypto/trades" className="flex flex-col items-center gap-1 group">
              <div className="w-11 h-11 rounded-2xl bg-[#1f222b] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition border border-gray-800">
                <RefreshCw size={20} />
              </div>
              <span className="text-[10px] text-gray-300 font-medium">Trades</span>
            </Link>

            <Link href="/user/crypto/play-history" className="flex flex-col items-center gap-1 group">
              <div className="w-11 h-11 rounded-2xl bg-[#1f222b] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition border border-gray-800">
                <PlayCircle size={20} />
              </div>
              <span className="text-[10px] text-gray-300 font-medium">Play History</span>
            </Link>

            <Link href="/user/crypto/support" className="flex flex-col items-center gap-1 group">
              <div className="w-11 h-11 rounded-2xl bg-[#1f222b] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition border border-gray-800">
                <HelpCircle size={20} />
              </div>
              <span className="text-[10px] text-gray-300 font-medium">Support</span>
            </Link>
          </div>
        </div>

        {/* Trending Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#f5a623] tracking-wide">Trending</span>
            <Flame size={16} className="text-orange-500" />
          </div>

          <div className="bg-[#16181f] border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800/60">
            {trendingCoins.map((coin) => (
              <div key={coin.pair} className="p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-gray-100">{coin.name}</div>
                  <div className="text-[10px] text-gray-500">{coin.pair}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs text-gray-200">{coin.price}</div>
                  <div className="text-[9px] text-gray-500">{coin.fullPrice}</div>
                </div>
                <div>
                  <span
                    className={`inline-block text-xs font-bold px-2 py-1 rounded-md min-w-[70px] text-center ${
                      coin.down ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {coin.chg}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
