"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import BottomNav from "../../../components/BottomNav";

export default function PlayHistoryPage() {
  const [selectedGame, setSelectedGame] = useState("Win Go");

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/crypto/home" className="text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-sm">Pandora Play History</span>
        <div className="w-5" />
      </div>

      <div className="p-4 space-y-4">
        {/* Game Filter Dropdown */}
        <div className="flex justify-end">
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="bg-[#16181f] border border-gray-800 rounded-xl px-4 py-2 text-xs text-gray-300 outline-none"
          >
            <option>Win Go</option>
            <option>7 Up Down</option>
            <option>Car Roulette</option>
            <option>Aviator</option>
          </select>
        </div>

        {/* History Table */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="grid grid-cols-6 p-3 text-[10px] text-gray-500 font-semibold border-b border-gray-800">
              <span>#</span>
              <span>Period</span>
              <span>Selection</span>
              <span>Result</span>
              <span>Amount</span>
              <span className="text-right">Status</span>
            </div>
            <div className="p-12 text-center text-xs text-gray-500">
              No results found for {selectedGame}.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>Showing 0 results</span>
          <span>Page 1 of 0</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
