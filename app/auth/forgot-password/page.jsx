"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen bg-[#0e1014] text-white flex flex-col justify-center items-center px-4 py-8">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full border border-teal-500/50 bg-[#161922] flex items-center justify-center mb-2">
          <span className="text-xl">🌐</span>
        </div>
        <h1 className="text-base font-bold tracking-widest uppercase">Pandora</h1>
      </div>

      <div className="w-full max-w-sm bg-[#16181f] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold text-center mb-1">Forgot Password</h2>
        <p className="text-xs text-gray-400 text-center mb-6">Enter your email and OTP to reset your password.</p>

        <form onSubmit={(e) => { e.preventDefault(); router.push("/auth/sign-in"); }} className="space-y-4">
          <div>
            <label className="text-xs text-gray-300 block mb-1">Email</label>
            <div className="flex gap-2">
              <input type="email" placeholder="e.g. john@doe.com" required className="flex-1 bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623]" />
              <button type="button" className="px-3 py-2 border border-[#f5a623] text-[#f5a623] text-xs font-semibold rounded-xl hover:bg-[#f5a623]/10">
                Send
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">OTP</label>
            <input type="text" placeholder="e.g. 123456" required className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623]" />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Password</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} placeholder="••••••••" required className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623]" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-xl text-sm transition mt-2">
            Submit
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/auth/sign-in" className="text-xs text-[#f5a623] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
