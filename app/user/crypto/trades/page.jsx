"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import BottomNav from "../../../components/BottomNav";

export default function TradesHistoryPage() {
  const [filterPair, setFilterPair] = useState("");

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/crypto/home" className="text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-sm">Trades History</span>
        <div className="w-5" />
      </div>

      <div className="p-4 space-y-4">
        {/* Filter Inputs */}
        <div className="flex gap-2">
          <input
            placeholder="Pair"
            value={filterPair}
            onChange={(e) => setFilterPair(e.target.value)}
            className="flex-1 bg-[#16181f] border border-gray-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#f5a623]"
          />
          <button className="bg-[#16181f] border border-gray-800 rounded-xl px-4 py-2 text-xs flex items-center gap-1 text-gray-300">
            Status <ChevronDown size={14} />
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl overflow-x-auto">
          <div className="min-w-[450px]">
            <div className="grid grid-cols-5 p-3 text-[10px] text-gray-500 font-semibold border-b border-gray-800">
              <span># Pair</span>
              <span>Price Direction</span>
              <span>Start Price</span>
              <span>End Price</span>
              <span className="text-right">Net Amount</span>
            </div>
            <div className="p-12 text-center text-xs text-gray-500">
              No results.
            </div>
          </div>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>Showing 0 results</span>
          <span>Page 1 of 0</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
