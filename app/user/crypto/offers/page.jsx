"use client";
import Link from "next/link";
import { ArrowLeft, Gift } from "lucide-react";
import BottomNav from "../../../components/BottomNav";

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/crypto/home" className="text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-sm">Offers</span>
        <div className="w-5" />
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-6 text-center space-y-2">
          <Gift size={32} className="mx-auto text-[#f5a623]" />
          <h3 className="font-bold text-sm text-gray-200">First Deposit 100% Bonus</h3>
          <p className="text-xs text-gray-500">Deposit 10 USDT or more to claim up to 100 USDT bonus balance instantly.</p>
          <Link
            href="/user/crypto/deposit"
            className="inline-block mt-3 px-6 py-2 bg-[#f5a623] text-black font-bold text-xs rounded-xl"
          >
            Claim Now
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
