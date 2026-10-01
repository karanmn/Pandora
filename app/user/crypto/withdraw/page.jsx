"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import BottomNav from "../../../components/BottomNav";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const rate = 103.0;

  const receiveUSDT = amount ? (parseFloat(amount) / rate).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/crypto/assets" className="text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-sm">Withdrawal</span>
        <History size={18} className="text-gray-400" />
      </div>

      <div className="p-4 space-y-4">
        {/* Wallet Balance */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-xs text-gray-400">Current Wallet</span>
          <span className="text-lg font-black text-white">129.69 <span className="text-xs text-[#f5a623]">INR</span></span>
        </div>

        {/* Conversion Rate */}
        <div className="flex justify-between items-center bg-[#16181f] p-3 rounded-xl border border-gray-800 text-xs">
          <span className="text-gray-400">Conversion Rate</span>
          <span className="text-[#f5a623] font-bold">1.00 USDT = 103.00 INR</span>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Select Wallet</span>
              <span className="text-[#f5a623] cursor-pointer">manage</span>
            </div>
            <select className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-xs text-gray-200 outline-none">
              <option>Default BEP20 Wallet (0x71C...49A)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Amount (INR)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623] outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Transaction Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623] outline-none"
            />
          </div>

          <div className="text-right text-xs text-gray-400">
            Will receive = <span className="text-base font-bold text-[#f5a623]">{receiveUSDT}</span> USDT
          </div>

          <button
            onClick={() => alert("Withdrawal request submitted for review!")}
            className="w-full bg-[#f5a623] text-black font-bold py-3 rounded-xl text-sm hover:bg-[#e0961f]"
          >
            Withdraw
          </button>
        </div>

        {/* Withdrawal Instructions */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4 text-[11px] space-y-1.5 text-gray-400">
          <div className="font-bold text-[#f5a623] mb-1">Withdrawal Instructions</div>
          <p>• Get withdrawal processed within 24 hrs.</p>
          <p>• The minimum withdrawal amount is 10.00 USDT.</p>
          <p>• You can withdraw up to 10 times a day.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
