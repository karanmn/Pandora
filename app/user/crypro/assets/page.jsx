"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/app/components/BottomNav";
import { LogOut, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState("password");

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      {/* Wallet Balance Banner */}
      <div className="p-4 border-b border-gray-800 bg-[#14161d]">
        <span className="text-xs text-gray-400 block mb-1">Est. Total Wallet</span>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-black text-white">121.69</span>
          <span className="text-xs font-bold text-[#f5a623]">INR</span>
        </div>

        {/* Actions: Deposit, Withdraw, P2P, Sign Out */}
        <div className="grid grid-cols-4 gap-2">
          <button className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#1b1e26] hover:bg-[#252834]">
            <ArrowDownLeft size={18} className="text-green-400" />
            <span className="text-[10px] text-gray-300">Deposit</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#1b1e26] hover:bg-[#252834]">
            <ArrowUpRight size={18} className="text-[#f5a623]" />
            <span className="text-[10px] text-gray-300">Withdraw</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#1b1e26] hover:bg-[#252834]">
            <ArrowLeftRight size={18} className="text-blue-400" />
            <span className="text-[10px] text-gray-300">P2P</span>
          </button>
          <Link href="/auth/sign-in" className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#1b1e26] hover:bg-red-500/20">
            <LogOut size={18} className="text-red-400" />
            <span className="text-[10px] text-gray-300">Sign Out</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 text-xs">
        <button
          onClick={() => setActiveTab("password")}
          className={`flex-1 py-3 font-semibold border-b-2 transition ${
            activeTab === "password" ? "border-[#f5a623] text-[#f5a623]" : "border-transparent text-gray-400"
          }`}
        >
          Change Password
        </button>
        <button
          onClick={() => setActiveTab("crypto")}
          className={`flex-1 py-3 font-semibold border-b-2 transition ${
            activeTab === "crypto" ? "border-[#f5a623] text-[#f5a623]" : "border-transparent text-gray-400"
          }`}
        >
          Manage Crypto
        </button>
        <button
          onClick={() => setActiveTab("bank")}
          className={`flex-1 py-3 font-semibold border-b-2 transition ${
            activeTab === "bank" ? "border-[#f5a623] text-[#f5a623]" : "border-transparent text-gray-400"
          }`}
        >
          Manage Bank
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "password" && (
          <form onSubmit={(e) => { e.preventDefault(); alert("Password updated successfully!"); }} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" required className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">New Password</label>
              <input type="password" placeholder="••••••••" required className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Confirm Password</label>
              <input type="password" placeholder="••••••••" required className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623]" />
            </div>
            <button type="submit" className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-xl text-sm transition mt-2">
              Change Password
            </button>
          </form>
        )}

        {activeTab === "crypto" && (
          <div className="p-4 text-center text-xs text-gray-500 bg-[#16181f] rounded-2xl border border-gray-800">
            No TRC20 / BEP20 Wallet added yet.
          </div>
        )}

        {activeTab === "bank" && (
          <div className="p-4 text-center text-xs text-gray-500 bg-[#16181f] rounded-2xl border border-gray-800">
            No Bank Account Linked.
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
