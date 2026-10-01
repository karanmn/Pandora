"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, Wallet, History } from "lucide-react";

export default function WinGoPage() {
  const [timeLeft, setTimeLeft] = useState(14);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);

  // Countdown timer for 30s game
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const history = [
    { period: "2026093030583685", num: 2, bs: "Small", color: "red" },
    { period: "2026093030583684", num: 3, bs: "Small", color: "green" },
    { period: "2026093030583683", num: 3, bs: "Small", color: "green" },
    { period: "2026093030583682", num: 9, bs: "Big", color: "green" },
    { period: "2026093030583681", num: 0, bs: "Small", color: "violet" },
  ];

  return (
    <div className="min-h-screen bg-[#111317] text-white pb-10 max-w-md mx-auto">
      {/* Header */}
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
          <div className="text-2xl font-black my-1">₹121.69</div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-black/80 hover:bg-black text-white text-xs font-semibold py-2 rounded-xl">
              Deposit
            </button>
            <button className="flex-1 bg-white/80 hover:bg-white text-black text-xs font-semibold py-2 rounded-xl">
              Withdraw
            </button>
          </div>
        </div>

        {/* Game Interval Selection */}
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
            <span className="text-xs text-gray-400 block mb-1">Period: 20260930583686</span>
            <div className="flex gap-1">
              {[2, 3, 3, 9, 0].map((n, i) => (
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

        {/* Color Betting: Green, Violet, Red */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedColor("Green")}
            className="bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/30"
          >
            Green
          </button>
          <button
            onClick={() => setSelectedColor("Violet")}
            className="bg-purple-600 hover:bg-purple-500 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/30"
          >
            Violet
          </button>
          <button
            onClick={() => setSelectedColor("Red")}
            className="bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-rose-900/30"
          >
            Red
          </button>
        </div>

        {/* Numbers 0 - 9 */}
        <div className="grid grid-cols-5 gap-2 bg-[#181a20] p-3 rounded-2xl border border-gray-800">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedNumber(num)}
              className={`h-11 rounded-full font-black text-sm flex items-center justify-center transition border ${
                selectedNumber === num ? "ring-2 ring-[#f5a623]" : ""
              } ${
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

        {/* Big / Small */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-[#f5a623] hover:bg-[#e0961f] text-black font-bold py-2.5 rounded-xl text-sm">
            Big
          </button>
          <button className="bg-sky-600 hover:bg-sky-500 font-bold py-2.5 rounded-xl text-sm">
            Small
          </button>
        </div>

        {/* History Table */}
        <div className="bg-[#181a20] rounded-2xl border border-gray-800 overflow-hidden mt-4">
          <div className="p-3 border-b border-gray-800 text-xs font-bold text-gray-300 flex items-center gap-1">
            <History size={14} /> Game History
          </div>
          <div className="divide-y divide-gray-800/60 text-xs">
            {history.map((row) => (
              <div key={row.period} className="p-2.5 flex items-center justify-between">
                <span className="text-gray-400 text-[11px]">{row.period}</span>
                <span className="font-bold text-[#f5a623]">{row.num}</span>
                <span className="text-gray-300">{row.bs}</span>
                <span
                  className={`w-3 h-3 rounded-full ${
                    row.color === "green"
                      ? "bg-emerald-500"
                      : row.color === "red"
                      ? "bg-rose-500"
                      : "bg-purple-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
