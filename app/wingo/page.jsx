"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, RefreshCw, X, AlertCircle } from "lucide-react";

const WIN_GO_MODES = [
  { label: "30 Sec", duration: 30 },
  { label: "1 Min", duration: 60 },
  { label: "3 Min", duration: 180 },
  { label: "5 Min", duration: 300 },
];

const MULTIPLIERS = [1, 5, 10, 20, 50, 100];
const BASE_AMOUNTS = [1, 10, 100, 1000];

export default function WinGoGamePage() {
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [balance, setBalance] = useState(133.56);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [periodId, setPeriodId] = useState("2026100330592300");

  // Betting Sheet States
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [betSelection, setBetSelection] = useState(null); // 'Green', 'Red', 'Violet', 'Big', 'Small', or Number 0-9
  const [betType, setBetType] = useState(""); // 'Color', 'Size', 'Number'
  const [baseUnit, setBaseUnit] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // History List
  const [historyData, setHistoryData] = useState([
    { period: "2026100330592300", number: 6, bigSmall: "Big", color: "bg-rose-500" },
    { period: "2026100330592299", number: 4, bigSmall: "Small", color: "bg-rose-500" },
    { period: "2026100330592298", number: 7, bigSmall: "Big", color: "bg-emerald-500" },
    { period: "2026100330592297", number: 8, bigSmall: "Big", color: "bg-rose-500" },
    { period: "2026100330592296", number: 2, bigSmall: "Small", color: "bg-rose-500" },
    { period: "2026100330592295", number: 0, bigSmall: "Small", color: "bg-purple-600" },
    { period: "2026100330592294", number: 5, bigSmall: "Big", color: "bg-purple-600" },
    { period: "2026100330592293", number: 3, bigSmall: "Small", color: "bg-emerald-500" },
  ]);

  // Load user balance from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("pandora_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.balance !== undefined) setBalance(parseFloat(parsed.balance));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Real Clock-Synchronized Timer for all 4 intervals
  const currentDuration = WIN_GO_MODES[activeModeIndex].duration;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentEpochSec = Math.floor(now.getTime() / 1000);

      // Remaining seconds in current block
      const rem = currentDuration - (currentEpochSec % currentDuration);
      const actualRem = rem === currentDuration ? 0 : rem;
      setSecondsRemaining(actualRem);

      // Generate accurate Period ID
      const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
      const secondsSinceMidnight =
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const roundIndex = Math.floor(secondsSinceMidnight / currentDuration) + 1;
      setPeriodId(`${datePart}${String(roundIndex).padStart(6, "0")}`);
    };

    updateCountdown();
    const intervalRunner = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalRunner);
  }, [activeModeIndex, currentDuration]);

  // Format MM:SS
  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
  };

  const isLocked = secondsRemaining <= 5;
  const totalBetAmount = baseUnit * multiplier;

  const handleOpenSheet = (type, val) => {
    if (isLocked) {
      setErrorMsg("Round is locked for the last 5 seconds!");
      setTimeout(() => setErrorMsg(""), 2500);
      return;
    }
    setBetType(type);
    setBetSelection(val);
    setIsSheetOpen(true);
  };

  const handleConfirmBet = () => {
    if (isLocked) {
      setErrorMsg("Time expired! Cannot place order now.");
      return;
    }

    if (balance < totalBetAmount) {
      setErrorMsg("Insufficient balance in your wallet!");
      return;
    }

    // Atomic Deduct
    const newBal = parseFloat((balance - totalBetAmount).toFixed(2));
    setBalance(newBal);

    // Save to localStorage session
    const stored = localStorage.getItem("pandora_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.balance = newBal;
        localStorage.setItem("pandora_user", JSON.stringify(parsed));
      } catch (e) {}
    }

    setIsSheetOpen(false);
    setSuccessToast(`Placed ₹${totalBetAmount} on ${betSelection}!`);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-12 max-w-md mx-auto relative font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#16181f]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/select-panel" className="text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-extrabold text-sm tracking-widest uppercase text-[#f5a623]">
          PANDORA PLAY
        </span>
        <div className="w-5" />
      </header>

      {/* Main Container */}
      <div className="p-4 space-y-4">
        {/* Wallet Balance Gold Card */}
        <div className="bg-gradient-to-r from-[#d4a046] via-[#c49237] to-[#a37220] text-black p-4 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5 opacity-90">
              <Wallet size={15} /> Wallet Balance
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
              Real-Time
            </span>
          </div>

          <div className="text-3xl font-black my-2 tracking-tight">
            ₹{balance.toFixed(2)}
          </div>

          <div className="flex gap-2 mt-3">
            <Link
              href="/user/crypto/deposit"
              className="flex-1 bg-black/90 hover:bg-black text-white text-xs font-bold py-2 rounded-xl text-center shadow-md transition"
            >
              Deposit
            </Link>
            <Link
              href="/user/crypto/withdraw"
              className="flex-1 bg-white hover:bg-gray-100 text-black text-xs font-bold py-2 rounded-xl text-center shadow-md transition"
            >
              Withdraw
            </Link>
          </div>
        </div>

        {/* 4 Mode Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {WIN_GO_MODES.map((mode, idx) => {
            const isSelected = activeModeIndex === idx;
            return (
              <button
                key={mode.label}
                onClick={() => {
                  setActiveModeIndex(idx);
                  setIsSheetOpen(false);
                }}
                className={`py-2.5 px-1 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                  isSelected
                    ? "bg-[#1f222b] border-[#f5a623] text-[#f5a623] shadow-md shadow-[#f5a623]/10"
                    : "bg-[#16181f] border-gray-800/80 text-gray-400 hover:border-gray-700"
                }`}
              >
                <span className="text-xs font-extrabold tracking-wide">Win Go</span>
                <span className="text-[10px] font-medium opacity-80">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Timer & Period Card */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4 flex justify-between items-center relative overflow-hidden">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
              Period
            </span>
            <div className="text-xs font-mono font-bold text-gray-200 tracking-wider">
              {periodId}
            </div>
            <div className="flex gap-1 mt-2">
              {[8, 7, 7, 6, 7].map((num, i) => (
                <span
                  key={i}
                  className="w-5 h-5 rounded-full bg-gray-800 text-[10px] font-bold flex items-center justify-center text-gray-300 border border-gray-700"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
              Time Remaining
            </span>
            <div
              className={`text-2xl font-mono font-black ${
                isLocked ? "text-rose-500 animate-pulse" : "text-[#f5a623]"
              }`}
            >
              {formatTime(secondsRemaining)}
            </div>
          </div>
        </div>

        {/* Color Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleOpenSheet("Color", "Green")}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/20 transition"
          >
            Green
          </button>
          <button
            onClick={() => handleOpenSheet("Color", "Violet")}
            className="bg-purple-600 hover:bg-purple-500 active:scale-95 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-purple-900/20 transition"
          >
            Violet
          </button>
          <button
            onClick={() => handleOpenSheet("Color", "Red")}
            className="bg-rose-600 hover:bg-rose-500 active:scale-95 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-rose-900/20 transition"
          >
            Red
          </button>
        </div>

        {/* Number Balls 0 - 9 */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-3.5">
          <div className="grid grid-cols-5 gap-2.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
              const isSpecial = num === 0 || num === 5;
              const isEven = num % 2 === 0;
              const bgClass = isSpecial
                ? "bg-purple-600 border-purple-400"
                : isEven
                ? "bg-rose-600 border-rose-400"
                : "bg-emerald-600 border-emerald-400";

              return (
                <button
                  key={num}
                  onClick={() => handleOpenSheet("Number", num)}
                  className={`h-11 rounded-full font-black text-sm flex items-center justify-center border shadow-md active:scale-95 transition ${bgClass}`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Big / Small Choice */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOpenSheet("Size", "Big")}
            className="bg-[#f5a623] hover:bg-[#e0961f] active:scale-95 text-black font-extrabold py-3 rounded-2xl text-sm shadow-lg shadow-[#f5a623]/20 transition"
          >
            Big
          </button>
          <button
            onClick={() => handleOpenSheet("Size", "Small")}
            className="bg-sky-600 hover:bg-sky-500 active:scale-95 font-extrabold py-3 rounded-2xl text-sm shadow-lg shadow-sky-900/20 transition"
          >
            Small
          </button>
        </div>

        {/* Game History Table */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl overflow-hidden mt-4">
          <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-200">Game Record</span>
            <span className="text-[10px] text-gray-500">{WIN_GO_MODES[activeModeIndex].label}</span>
          </div>

          <div className="divide-y divide-gray-800/60">
            {historyData.map((item) => (
              <div key={item.period} className="px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono text-[11px]">{item.period}</span>
                <span className="font-extrabold text-sm text-[#f5a623]">{item.number}</span>
                <span className="text-gray-300 font-medium">{item.bigSmall}</span>
                <span className={`w-3.5 h-3.5 rounded-full ${item.color}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5-SECOND FULLSCREEN BIG COUNTDOWN OVERLAY */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
          <div className="flex gap-4">
            <div className="w-24 h-36 bg-gradient-to-b from-[#d4a046] to-[#a37220] text-black font-mono font-black text-7xl rounded-3xl flex items-center justify-center shadow-2xl border-2 border-yellow-200">
              0
            </div>
            <div className="w-24 h-36 bg-gradient-to-b from-[#d4a046] to-[#a37220] text-black font-mono font-black text-7xl rounded-3xl flex items-center justify-center shadow-2xl border-2 border-yellow-200">
              {secondsRemaining}
            </div>
          </div>
        </div>
      )}

      {/* ERROR TOAST */}
      {errorMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-rose-600/90 text-white text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
          <AlertCircle size={15} />
          {errorMsg}
        </div>
      )}

      {/* SUCCESS TOAST */}
      {successToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600/95 text-white text-xs px-4 py-2 rounded-xl font-bold shadow-lg">
          {successToast}
        </div>
      )}

      {/* BETTING BOTTOM SHEET DRAWER MODAL */}
      {isSheetOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-[#16181f] rounded-t-3xl p-5 border-t border-gray-700 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <span className="font-bold text-sm text-[#f5a623]">
                Win Go {WIN_GO_MODES[activeModeIndex].label} - Select {betSelection}
              </span>
              <button
                onClick={() => setIsSheetOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Base Balance Selection */}
            <div>
              <span className="text-[11px] text-gray-400 block mb-1.5 font-medium">Balance</span>
              <div className="grid grid-cols-4 gap-2">
                {BASE_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    onClick={() => setBaseUnit(val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      baseUnit === val
                        ? "bg-[#f5a623] text-black border-[#f5a623]"
                        : "bg-[#101217] border-gray-800 text-gray-300"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiplier Selection */}
            <div>
              <span className="text-[11px] text-gray-400 block mb-1.5 font-medium">Quantity</span>
              <div className="grid grid-cols-6 gap-1.5">
                {MULTIPLIERS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMultiplier(m)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      multiplier === m
                        ? "bg-[#f5a623] text-black border-[#f5a623]"
                        : "bg-[#101217] border-gray-800 text-gray-400"
                    }`}
                  >
                    X{m}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsSheetOpen(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBet}
                className="flex-1 bg-[#f5a623] hover:bg-[#e0961f] text-black py-3 rounded-xl text-xs font-bold transition"
              >
                Total ₹{totalBetAmount}.00
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
