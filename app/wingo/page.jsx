"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, AlertCircle, Clock } from "lucide-react";

const INTERVALS = [
  { label: "30 Sec", duration: 30 },
  { label: "1 Min", duration: 60 },
  { label: "3 Min", duration: 180 },
  { label: "5 Min", duration: 300 },
];

export default function MockMultiTimerSimulator() {
  const [activeInterval, setActiveInterval] = useState(INTERVALS[0]);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [periodId, setPeriodId] = useState("");
  const [virtualBalance, setVirtualBalance] = useState(129.69);
  const [selectedUnit, setSelectedUnit] = useState(10);
  const [actionLog, setActionLog] = useState([]);
  const [errorNotice, setErrorNotice] = useState("");

  // Drift-free synchronized timer based on active interval
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const currentEpochSec = Math.floor(now.getTime() / 1000);

      // Remaining seconds in current block
      const rem = activeInterval.duration - (currentEpochSec % activeInterval.duration);
      setSecondsRemaining(rem === activeInterval.duration ? 0 : rem);

      // Deterministic period sequence
      const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
      const secondsSinceMidnight =
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const roundIndex = Math.floor(secondsSinceMidnight / activeInterval.duration) + 1;

      setPeriodId(`${datePart}${String(roundIndex).padStart(5, "0")}`);
    };

    updateTimer();
    const intervalRunner = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRunner);
  }, [activeInterval]);

  // Format seconds to MM:SS
  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
  };

  const isLocked = secondsRemaining <= 5;

  const handleExecution = (choice) => {
    setErrorNotice("");

    if (isLocked) {
      setErrorNotice("Round locked during final 5 seconds.");
      return;
    }

    if (virtualBalance < selectedUnit) {
      setErrorNotice("Insufficient demo balance.");
      return;
    }

    // Atomic balance deduction
    setVirtualBalance((prev) => parseFloat((prev - selectedUnit).toFixed(2)));

    const entry = {
      id: Date.now(),
      interval: activeInterval.label,
      period: periodId,
      choice,
      amount: selectedUnit,
      timestamp: new Date().toLocaleTimeString(),
    };

    setActionLog((prev) => [entry, ...prev.slice(0, 5)]);
  };

  return (
    <div className="min-h-screen bg-[#111317] text-white p-4 max-w-md mx-auto space-y-4 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <Link href="/user/select-panel" className="text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-sm tracking-wider uppercase text-yellow-500">
          Simulation Studio
        </span>
        <div className="w-5" />
      </div>

      {/* Balance Card */}
      <div className="bg-[#181a20] border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-400 block mb-1">Demo Balance</span>
          <div className="text-2xl font-black text-white">
            ₹{virtualBalance.toFixed(2)}
          </div>
        </div>
        <button
          onClick={() => setVirtualBalance(100.0)}
          className="text-xs bg-[#252834] text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-yellow-500"
        >
          Reset Demo
        </button>
      </div>

      {/* 4 Timers Tab Selector */}
      <div className="grid grid-cols-4 gap-2">
        {INTERVALS.map((tab) => {
          const isSelected = activeInterval.duration === tab.duration;
          return (
            <button
              key={tab.label}
              onClick={() => {
                setActiveInterval(tab);
                setErrorNotice("");
              }}
              className={`p-2 rounded-xl border text-center transition ${
                isSelected
                  ? "bg-[#252834] border-[#f5a623] text-[#f5a623]"
                  : "bg-[#181a20] border-gray-800 text-gray-400"
              }`}
            >
              <Clock size={14} className="mx-auto mb-1" />
              <div className="text-xs font-bold">{tab.label}</div>
            </button>
          );
        })}
      </div>

      {/* Live Timer & Period Info */}
      <div className="bg-[#181a20] border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-gray-500 block">Period ID</span>
          <span className="text-xs font-mono font-bold text-gray-300">{periodId}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-500 block">Time Remaining</span>
          <div
            className={`text-2xl font-mono font-black ${
              isLocked ? "text-red-500 animate-pulse" : "text-[#f5a623]"
            }`}
          >
            {formatTime(secondsRemaining)}
          </div>
        </div>
      </div>

      {/* Amount Selector */}
      <div>
        <label className="text-xs text-gray-400 block mb-2">Select Allocation Amount</label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 10, 50, 100].map((amt) => (
            <button
              key={amt}
              onClick={() => setSelectedUnit(amt)}
              className={`py-2 rounded-xl text-xs font-bold border transition ${
                selectedUnit === amt
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-[#181a20] border-gray-800 text-gray-300 hover:border-gray-700"
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 block">Place Allocation ({activeInterval.label})</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={isLocked}
            onClick={() => handleExecution("Option Alpha")}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition"
          >
            Option Alpha
          </button>
          <button
            disabled={isLocked}
            onClick={() => handleExecution("Option Beta")}
            className="bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition"
          >
            Option Beta
          </button>
        </div>
      </div>

      {/* Alert Notice */}
      {errorNotice && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-[#181a20] border border-gray-800 rounded-2xl p-4">
        <span className="text-xs font-bold text-gray-300 block mb-3">Recent Allocations</span>
        {actionLog.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">No allocations logged yet.</p>
        ) : (
          <div className="space-y-2">
            {actionLog.map((log) => (
              <div
                key={log.id}
                className="flex justify-between items-center text-xs border-b border-gray-800/60 pb-2"
              >
                <div>
                  <div className="font-semibold text-gray-200">
                    {log.choice}{" "}
                    <span className="text-[10px] text-gray-500 font-normal">({log.interval})</span>
                  </div>
                  <div className="text-[10px] text-gray-500">Period: {log.period}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-red-400 font-bold">-₹{log.amount.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-500">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
