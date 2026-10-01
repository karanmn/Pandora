"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import BottomNav from "../../../components/BottomNav";

export default function DepositPage() {
  const [tab, setTab] = useState("crypto");
  const [amount, setAmount] = useState("");
  const rate = 103.0; // 1 USDTBSC = 103 INR

  const receivedINR = amount ? (parseFloat(amount) * rate).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/crypto/assets" className="text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-sm">Deposit</span>
        <History size={18} className="text-gray-400" />
      </div>

      <div className="p-4 space-y-4">
        {/* Wallet Balance */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-xs text-gray-400">Current Wallet</span>
          <span className="text-lg font-black text-white">129.69 <span className="text-xs text-[#f5a623]">INR</span></span>
        </div>

        {/* Tabs: Crypto vs Bank */}
        <div className="grid grid-cols-2 gap-2 bg-[#12141a] p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setTab("crypto")}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              tab === "crypto" ? "bg-[#f5a623] text-black" : "text-gray-400"
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => setTab("bank")}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              tab === "bank" ? "bg-[#f5a623] text-black" : "text-gray-400"
            }`}
          >
            Bank Card
          </button>
        </div>

        {tab === "crypto" ? (
          <div className="space-y-4">
            {/* Conversion Rate */}
            <div className="flex justify-between items-center bg-[#16181f] p-3 rounded-xl border border-gray-800 text-xs">
              <span className="text-gray-400">Conversion Rate</span>
              <span className="text-[#f5a623] font-bold">1.00 USDTBSC = 103.00 INR</span>
            </div>

            {/* Currency Select */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Currency</label>
              <div className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-xs text-gray-200">
                USDTBSC (Tether USD BEP20)
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Amount (USDT)</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623] outline-none"
              />
            </div>

            {/* Live Calculation Output */}
            <div className="text-right text-xs text-gray-400">
              Will receive = <span className="text-base font-bold text-white">{receivedINR}</span> INR
            </div>

            <button
              onClick={() => alert(`Deposit request initiated for ${amount || 0} USDT`)}
              className="w-full bg-[#f5a623] text-black font-bold py-3 rounded-xl text-sm hover:bg-[#e0961f]"
            >
              Deposit
            </button>

            {/* Instructions */}
            <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4 text-xs space-y-1.5 text-gray-400">
              <div className="font-bold text-[#f5a623] mb-1">Deposit Instructions</div>
              <p>• Deposit timing is 24/7.</p>
              <p>• The minimum deposit amount is 10.00 USDTBSC.</p>
              <p>• Make sure to send funds only via BSC (BEP20) network.</p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-gray-400 bg-[#16181f] rounded-2xl border border-gray-800">
            Bank deposit gateway currently under maintenance. Please use Crypto.
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
