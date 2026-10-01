"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import BottomNav from "../../../components/BottomNav";

export default function SupportTicketsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-[#0e1014] text-white pb-24 max-w-md mx-auto">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/user/crypto/home" className="text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-sm">Support Tickets</span>
        <div className="w-5" />
      </div>

      <div className="p-4 space-y-4">
        {/* Top Control Bar */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">Total Tickets: 0</div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#f5a623] hover:bg-[#e0961f] text-black font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
          >
            <Plus size={14} /> New
          </button>
        </div>

        {/* Tickets Table */}
        <div className="bg-[#16181f] border border-gray-800 rounded-2xl overflow-x-auto">
          <div className="min-w-[420px]">
            <div className="grid grid-cols-4 p-3 text-[10px] text-gray-500 font-semibold border-b border-gray-800">
              <span>Ticket ID</span>
              <span>Subject</span>
              <span>Issue</span>
              <span className="text-right">Attachment</span>
            </div>
            <div className="p-12 text-center text-xs text-gray-500">
              No results!
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#181a20] rounded-2xl p-5 border border-gray-800 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <span className="font-bold text-sm text-[#f5a623]">Create Ticket</span>
              <button onClick={() => setModalOpen(false)} className="text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Deposit Inquiry"
                className="w-full bg-[#121316] border border-gray-700/60 rounded-xl px-3 py-2 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full bg-[#121316] border border-gray-700/60 rounded-xl px-3 py-2 text-xs outline-none resize-none"
              />
            </div>
            <button
              onClick={() => {
                alert("Support ticket created!");
                setModalOpen(false);
              }}
              className="w-full bg-[#f5a623] text-black font-bold py-2.5 rounded-xl text-xs mt-2"
            >
              Submit Ticket
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
