"use client";
import { useState, useEffect } from "react";
import BottomNav from "../../../components/BottomNav";
import { Copy, Gift, Award, ArrowLeft, Users, ChevronRight, X, Calendar, Search } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function PromotionPage() {
  const [copied, setCopied] = useState(false);
  const [currentUser, setCurrentUser] = useState({ user_id: "EW00022233" });
  const [inviteLink, setInviteLink] = useState("");
  const [directMembers, setDirectMembers] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [activeModal, setActiveModal] = useState(null); // 'today' | 'direct' | 'income' | 'subordinate'

  useEffect(() => {
    // 1. Get logged-in user session
    const stored = localStorage.getItem("pandora_user");
    let uid = "EW00022233";
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.user_id) uid = parsed.user_id;
      } catch (e) {
        console.error(e);
      }
    }
    setCurrentUser({ user_id: uid });

    const origin = typeof window !== "undefined" ? window.location.origin : "https://pandora.live";
    setInviteLink(`${origin}/auth/sign-up?inviteCode=${uid}`);

    // 2. Fetch direct team members from Supabase
    async function fetchTeamData() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("user_id, name, created_at, balance")
          .eq("referred_by", uid);

        if (!error && data) {
          setDirectMembers(data);

          // Calculate today's registrations
          const today = new Date().toISOString().split("T")[0];
          const todayRegs = data.filter((u) => u.created_at && u.created_at.startsWith(today));
          setTodayCount(todayRegs.length);
        }
      } catch (err) {
        console.error("Error fetching team data:", err);
      }
    }

    fetchTeamData();
  }, []);

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto relative">
      {/* Top Commission Header */}
      <div className="p-6 text-center border-b border-gray-800 bg-gradient-to-b from-[#181a22] to-[#0e1014]">
        <div className="flex justify-center gap-1 text-[#f5a623] mb-1">
          <Award size={20} />
        </div>
        <div className="text-3xl font-black text-white">
          8.01 <span className="text-xs text-[#f5a623] font-bold">INR</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">Yesterday's total commission</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Referral Link Box */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="text-[#f5a623]" size={16} />
            <span className="text-xs font-bold text-gray-200">Invitation Code</span>
          </div>
          <div className="flex items-center gap-2 bg-[#101217] border border-gray-700/60 rounded-xl p-2.5">
            <span className="text-xs text-gray-400 truncate flex-1">{inviteLink || "Generating..."}</span>
            <button
              onClick={handleCopy}
              className="bg-[#f5a623] text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#e0961f] transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* 2x2 Grid Info Navigations */}
        <div className="space-y-3">
          {/* Today Register Team */}
          <div
            onClick={() => setActiveModal("today")}
            className="bg-[#16181f] border border-gray-800 hover:border-gray-700 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Users size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-200">Today Register Team</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-teal-400">{todayCount}</span>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          </div>

          {/* Direct Team Details */}
          <div
            onClick={() => setActiveModal("direct")}
            className="bg-[#16181f] border border-gray-800 hover:border-gray-700 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Users size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-200">Direct Team Details</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-blue-400">{directMembers.length}</span>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          </div>

          {/* Income Details */}
          <div
            onClick={() => setActiveModal("income")}
            className="bg-[#16181f] border border-gray-800 hover:border-gray-700 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f5a623]/10 flex items-center justify-center text-[#f5a623]">
                <Award size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-200">Income Details</span>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>

          {/* Subordinate Data */}
          <div
            onClick={() => setActiveModal("subordinate")}
            className="bg-[#16181f] border border-gray-800 hover:border-gray-700 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Users size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-200">Subordinate Data</span>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </div>
        </div>

        {/* Promotion Summary Card */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-300 font-medium block">Direct Members: {directMembers.length}</span>
            <span className="text-xs text-gray-500 block mt-0.5">Team Members: {directMembers.length + 10}</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-[#f5a623]">368.89 INR</span>
            <span className="text-[10px] text-gray-400 block">Total commission</span>
          </div>
        </div>
      </div>

      {/* MODAL: Today Register Team */}
      {activeModal === "today" && (
        <div className="fixed inset-0 bg-[#0e1014] z-50 flex flex-col max-w-md mx-auto">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-sm">Today Register Team</span>
            <div className="w-5" />
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="bg-[#16181f] rounded-2xl p-8 border border-gray-800 text-center text-gray-500 text-xs">
              No records found for today.
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Direct Team Details */}
      {activeModal === "direct" && (
        <div className="fixed inset-0 bg-[#0e1014] z-50 flex flex-col max-w-md mx-auto">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-sm">Direct Team Details</span>
            <div className="w-5" />
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {directMembers.length === 0 ? (
              <div className="bg-[#16181f] rounded-2xl p-6 border border-gray-800 text-center text-gray-500 text-xs">
                No direct team members yet. Share your invite link!
              </div>
            ) : (
              directMembers.map((member) => (
                <div key={member.user_id} className="bg-[#16181f] border border-gray-800 rounded-xl p-3.5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#20242f] text-[#f5a623] font-bold flex items-center justify-center text-xs">
                      {member.name ? member.name.substring(0, 2).toUpperCase() : "EW"}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-200">{member.name || "Member"}</div>
                      <div className="text-[10px] text-gray-500">{member.user_id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">Active</span>
                    <span className="text-[10px] text-gray-400 block mt-1">₹{member.balance || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: Income Details */}
      {activeModal === "income" && (
        <div className="fixed inset-0 bg-[#0e1014] z-50 flex flex-col max-w-md mx-auto">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-sm">Income Details</span>
            <div className="w-5" />
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-[#16181f] border border-gray-800 rounded-xl p-3.5 flex justify-between items-center">
              <span className="text-xs text-gray-400">Referral Bonus</span>
              <span className="text-xs font-bold text-white">0.00 INR</span>
            </div>
            <div className="bg-[#16181f] border border-gray-800 rounded-xl p-3.5 flex justify-between items-center">
              <span className="text-xs text-gray-400">Trading Commission</span>
              <span className="text-xs font-bold text-white">368.89 INR</span>
            </div>
            <div className="bg-[#16181f] border border-gray-800 rounded-xl p-3.5 flex justify-between items-center">
              <span className="text-xs text-gray-400">Daily IB Bonus</span>
              <span className="text-xs font-bold text-white">0.00 INR</span>
            </div>
            <div className="bg-[#16181f] border border-[#f5a623]/30 rounded-xl p-4 flex justify-between items-center mt-4">
              <span className="text-xs font-bold text-[#f5a623]">Total Income</span>
              <span className="text-base font-black text-[#f5a623]">368.89 INR</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Subordinate Data */}
      {activeModal === "subordinate" && (
        <div className="fixed inset-0 bg-[#0e1014] z-50 flex flex-col max-w-md mx-auto">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-sm">Subordinate Data</span>
            <div className="w-5" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2 flex items-center gap-2">
                <Search size={14} className="text-gray-500" />
                <input placeholder="UID or name" className="bg-transparent text-xs outline-none w-full" />
              </div>
              <button className="bg-[#16181f] border border-gray-700/60 rounded-xl px-3 py-2 text-xs flex items-center gap-1 text-gray-400">
                <Calendar size={14} /> Sep 30
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-[#16181f] p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-500 block">Deposit Amount</span>
                <span className="text-sm font-bold">0.00 INR</span>
              </div>
              <div className="bg-[#16181f] p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-500 block">Total Bet Amount</span>
                <span className="text-sm font-bold text-[#f5a623]">2,274.00 INR</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
