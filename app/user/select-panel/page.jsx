import Link from "next/link";
import { TrendingUp, Gamepad2 } from "lucide-react";

export default function SelectPanelPage() {
  return (
    <div className="min-h-screen bg-[#0e1014] text-white flex flex-col justify-center items-center px-4">
      {/* Container */}
      <div className="w-full max-w-sm bg-[#16181f] border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        {/* Logo */}
        <div className="w-14 h-14 rounded-full border border-teal-500/50 bg-[#12141a] flex items-center justify-center mb-2">
          <span className="text-2xl">🌐</span>
        </div>
        <h1 className="text-2xl font-black text-[#f5a623] tracking-wide mb-1">Pandora World</h1>
        <p className="text-xs text-gray-400 mb-8">Choose your investment path</p>

        {/* 2 Option Cards */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Trading Button */}
          <Link
            href="/user/crypto/home"
            className="flex flex-col items-center justify-center p-4 bg-[#101217] rounded-2xl border border-gray-800 hover:border-[#f5a623]/60 transition group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
              <TrendingUp className="text-red-400" size={24} />
            </div>
            <span className="font-bold text-sm mb-1 text-gray-200">Trading</span>
            <span className="text-[10px] text-gray-500 text-center">Crypto, Forex, and more</span>
          </Link>

          {/* Pandora Play Button */}
          <Link
            href="/wingo"
            className="flex flex-col items-center justify-center p-4 bg-[#101217] rounded-2xl border border-gray-800 hover:border-[#f5a623]/60 transition group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
              <Gamepad2 className="text-purple-400" size={24} />
            </div>
            <span className="font-bold text-sm mb-1 text-gray-200">Pandora Play</span>
            <span className="text-[10px] text-gray-500 text-center">Play & earn</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
