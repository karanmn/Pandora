"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import BottomNav from "../../../components/BottomNav";

export default function P2PPage() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/crypto/assets" className="text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-sm">P2P Transfer</span>
        <History size={18} className="text-gray-400" />
      </div>

      <div className="p-4 space-y-4">
        {/* Wallet Balance */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-xs text-gray-400">Current Balance</span>
          <span className="text-lg font-black text-white">129.69 <span className="text-xs text-[#f5a623]">INR</span></span>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert(`Transferred ₹${amount} to User ${userId}`); }} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">User ID</label>
            <input
              type="text"
              placeholder="e.g. EW123456"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623] outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Amount (INR)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623] outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#f5a623] text-black font-bold py-3 rounded-xl text-sm hover:bg-[#e0961f] transition mt-2"
          >
            Transfer
          </button>
        </form>

        {/* Instructions */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4 text-[11px] space-y-1.5 text-gray-400">
          <div className="font-bold text-[#f5a623] mb-1">P2P Transfer Instructions</div>
          <p>• P2P transfer timing is 24/7.</p>
          <p>• The minimum transfer amount is 100.00 INR.</p>
          <p>• The maximum transfer amount is 500.00 INR.</p>
          <p>• Transfer fee is 0% of the total amount.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
