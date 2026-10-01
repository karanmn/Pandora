import Link from "next/link";
import BottomNav from "@/app/components/BottomNav";
import { UserCheck, RefreshCw, PlayCircle, HelpCircle, User } from "lucide-react";

export default function HomePage() {
  const trendingCoins = [
    { name: "Bitcoin", pair: "BTC/USDT", price: "83,192", fullPrice: "$83192.00000000", chg: "-0.6693%", down: true },
    { name: "Ethereum", pair: "ETH/USDT", price: "2,675.55", fullPrice: "$2675.55000000", chg: "-1.0434%", down: true },
    { name: "BNB", pair: "BNB/USDT", price: "760.65", fullPrice: "$760.65000000", chg: "-0.3267%", down: true },
    { name: "XRP", pair: "XRP/USDT", price: "1.50", fullPrice: "$1.50000000", chg: "+0.1372%", down: false },
    { name: "USDC", pair: "USDC/USDT", price: "0.9999", fullPrice: "$0.99986000", chg: "-0.0039%", down: true },
    { name: "Solana", pair: "SOL/USDT", price: "118.49", fullPrice: "$118.49000000", chg: "-0.3777%", down: true },
  ];

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      {/* Top Header */}
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
        {/* Wallet Banner Card */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4">
          <span className="text-xs text-gray-400 block mb-1">Est. Total Wallet</span>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-extrabold text-white">121.69</span>
            <span className="text-xs font-semibold text-[#f5a623]">INR</span>
          </div>

          {/* 4 Icon Quick Nav */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-800/80">
            <Link href="/user/crypto/promotion" className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-xl bg-[#1f222b] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition">
                <UserCheck size={18} />
              </div>
              <span className="text-[10px] text-gray-400">Refer2Earn</span>
            </Link>
            <Link href="/user/crypto/market" className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-xl bg-[#1f222b] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition">
                <RefreshCw size={18} />
              </div>
              <span className="text-[10px] text-gray-400">Trades</span>
            </Link>
            <Link href="/wingo" className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-xl bg-[#1f222b] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition">
                <PlayCircle size={18} />
              </div>
              <span className="text-[10px] text-gray-400">PandoraPlay</span>
            </Link>
            <Link href="/user/crypto/assets" className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-xl bg-[#1f222b] flex items-center justify-center text-[#f5a623] group-hover:scale-105 transition">
                <HelpCircle size={18} />
              </div>
              <span className="text-[10px] text-gray-400">Support</span>
            </Link>
          </div>
        </div>

        {/* Trending Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#f5a623] tracking-wide">Trending</span>
            <span className="text-xs text-orange-500">🔥</span>
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
                      coin.down ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
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
