"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Register API yahan call hogi
    router.push("/user/select-panel");
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-white flex flex-col justify-center items-center px-4 py-8">
      <div className="flex flex-col items-center mb-5">
        <div className="w-12 h-12 rounded-full border border-teal-500/50 bg-[#161922] flex items-center justify-center mb-1">
          <span className="text-xl">🌐</span>
        </div>
        <h1 className="text-base font-bold tracking-widest uppercase">Pandora</h1>
      </div>

      <div className="w-full max-w-sm bg-[#16181f] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold text-center mb-1">Sign Up</h2>
        <p className="text-xs text-gray-400 text-center mb-4">Create an account to get started with us.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-300 block mb-1">Invite Code</label>
            <input type="text" placeholder="e.g. EW000001" className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623]" />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Name</label>
            <input type="text" placeholder="e.g. John Doe" required className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623]" />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Phone</label>
            <input type="text" placeholder="e.g. 1234567890" required className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623]" />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Email</label>
            <div className="flex gap-2">
              <input type="email" placeholder="e.g. john@doe.com" required className="flex-1 bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623]" />
              <button type="button" className="px-3 py-1.5 border border-[#f5a623] text-[#f5a623] text-xs font-semibold rounded-xl hover:bg-[#f5a623]/10">
                Verify
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">OTP</label>
            <input type="text" placeholder="e.g. 123456" className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623]" />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Password</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} placeholder="••••••••" required className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623]" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Confirm Password</label>
            <div className="relative">
              <input type={showConfirmPass ? "text" : "password"} placeholder="••••••••" required className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623]" />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-2.5 text-gray-400">
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#f5a623] text-black font-semibold py-2.5 rounded-xl text-sm transition mt-2">
            Sign Up
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-[#f5a623] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
