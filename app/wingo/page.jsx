"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, History, X } from "lucide-react";

export default function WinGoPage() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [betModal, setBetModal] = useState({ open: false, type: "", selection: "" });
  const [betAmount, setBetAmount] = useState(1);
  const [multiplier, setMultiplier] = useState(1);

  // Synchronized countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openBet = (type, val) => {
    if (timeLeft <= 5) return; // Last 5 seconds betting locked
    setBetModal({ open: true, type, selection: val });
  };

  const totalBet = betAmount * multiplier;

  return (
    <div className="min-h-screen bg-[#111317] text-white pb-10 max-w-md mx-auto relative overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#191c22] p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/select-panel" className="text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-extrabold text-sm tracking-wider uppercase text-yellow-500">PANDORA PLAY</span>
        <div className="w-5" />
      </div>

      <div className="p-4 space-y-4">
        {/* Wallet Balance Gold Card */}
        <div className="bg-gradient-to-r from-[#d4a046] to-[#b37e28] text-black p-4 rounded-2xl shadow-lg">
          <span className="text-[11px] font-semibold flex items-center gap-1">
            <Wallet size={14} /> Wallet Balance
          </span>
          <div className="text-2xl font-black my-1">₹129.69</div>
          <div className="flex gap-2 mt-3">
            <Link href="/user/crypto/deposit" className="flex-1 bg-black/80 hover:bg-black text-white text-xs font-semibold py-2 rounded-xl text-center">
              Deposit
            </Link>
            <Link href="/user/crypto/withdraw" className="flex-1 bg-white/80 hover:bg-white text-black text-xs font-semibold py-2 rounded-xl text-center">
              Withdraw
            </Link>
          </div>
        </div>

        {/* Intervals */}
        <div className="grid grid-cols-4 gap-2">
          {["30 Sec", "1 Min", "3 Min", "5 Min"].map((tab, idx) => (
            <div
              key={tab}
              className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                idx === 0
                  ? "bg-[#252834] border-[#f5a623] text-[#f5a623]"
                  : "bg-[#181a20] border-gray-800 text-gray-400"
              }`}
            >
              <div className="text-xs font-bold">Win Go</div>
              <div className="text-[10px]">{tab}</div>
            </div>
          ))}
        </div>

        {/* Timer Card */}
        <div className="bg-[#181a20] border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 block mb-1">Period: 2026100130067974</span>
            <div className="flex gap-1">
              {[8, 7, 7, 6, 7].map((n, i) => (
                <span key={i} className="w-5 h-5 rounded-full bg-gray-700 text-[10px] flex items-center justify-center font-bold">
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 block">Time remaining</span>
            <div className="text-xl font-mono font-black text-[#f5a623]">
              00 : {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>
        </div>

        {/* Color Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => openBet("Color", "Green")}
            className="bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl font-bold text-sm shadow-md"
          >
            Green
          </button>
          <button
            onClick={() => openBet("Color", "Violet")}
            className="bg-purple-600 hover:bg-purple-500 py-2.5 rounded-xl font-bold text-sm shadow-md"
          >
            Violet
          </button>
          <button
            onClick={() => openBet("Color", "Red")}
            className="bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl font-bold text-sm shadow-md"
          >
            Red
          </button>
        </div>

        {/* Numbers 0 - 9 */}
        <div className="grid grid-cols-5 gap-2 bg-[#181a20] p-3 rounded-2xl border border-gray-800">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => openBet("Number", num)}
              className={`h-11 rounded-full font-black text-sm flex items-center justify-center transition border ${
                num === 0 || num === 5
                  ? "bg-purple-600 border-purple-400"
                  : num % 2 === 0
                  ? "bg-rose-600 border-rose-400"
                  : "bg-emerald-600 border-emerald-400"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Big / Small Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => openBet("Size", "Big")}
            className="bg-[#f5a623] hover:bg-[#e0961f] text-black font-bold py-2.5 rounded-xl text-sm"
          >
            Big
          </button>
          <button
            onClick={() => openBet("Size", "Small")}
            className="bg-sky-600 hover:bg-sky-500 font-bold py-2.5 rounded-xl text-sm"
          >
            Small
          </button>
        </div>
      </div>

      {/* 5-SECOND BIG COUNTDOWN OVERLAY (Video 00:57 - 01:02) */}
      {timeLeft <= 5 && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="flex gap-4">
            <div className="w-24 h-36 bg-[#cca869] text-black font-mono font-black text-7xl rounded-2xl flex items-center justify-center shadow-2xl border-4 border-yellow-200">
              0
            </div>
            <div className="w-24 h-36 bg-[#cca869] text-black font-mono font-black text-7xl rounded-2xl flex items-center justify-center shadow-2xl border-4 border-yellow-200">
              {timeLeft}
            </div>
          </div>
        </div>
      )}

      {/* BET BOTTOM DRAWER MODAL (Video 01:20) */}
      {betModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-[#1c1f26] rounded-t-3xl p-5 border-t border-gray-700 space-y-4 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <span className="font-bold text-sm text-[#f5a623]">Win Go - Select {betModal.selection}</span>
              <button onClick={() => setBetModal({ open: false, type: "", selection: "" })} className="text-gray-400">
                <X size={18} />
              </button>
            </div>

            {/* Base Balance Selection */}
            <div>
              <span className="text-xs text-gray-400 block mb-1">Balance</span>
              <div className="grid grid-cols-4 gap-2">
                {[1, 10, 100, 1000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setBetAmount(val)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      betAmount === val ? "bg-[#f5a623] text-black border-[#f5a623]" : "bg-[#14161c] border-gray-700 text-gray-300"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiplier Selection */}
            <div>
              <span className="text-xs text-gray-400 block mb-1">Multiplier</span>
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 5, 10, 20, 50, 100].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMultiplier(m)}
                    className={`py-1 rounded-lg text-xs font-bold border transition ${
                      multiplier === m ? "bg-[#f5a623] text-black border-[#f5a623]" : "bg-[#14161c] border-gray-700 text-gray-400"
                    }`}
                  >
                    X{m}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Confirm Bar */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setBetModal({ open: false, type: "", selection: "" })}
                className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Bet placed on ${betModal.selection} for ₹${totalBet}`);
                  setBetModal({ open: false, type: "", selection: "" });
                }}
                className="flex-1 bg-[#f5a623] text-black py-2.5 rounded-xl text-xs font-bold hover:bg-[#e0961f]"
              >
                Total ₹{totalBet}.00
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
