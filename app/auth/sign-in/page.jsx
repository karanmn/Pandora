"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // API Call yahan lagegi (e.g. POST /api/auth/login)
    router.push("/user/select-panel");
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-white flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 rounded-full border border-teal-500/50 bg-[#161922] flex items-center justify-center mb-2 shadow-lg shadow-teal-500/10">
          <span className="text-2xl">🌐</span>
        </div>
        <h1 className="text-lg font-bold tracking-widest uppercase text-gray-200">Pandora</h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-[#16181f] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold text-center mb-1">Sign In</h2>
        <p className="text-xs text-gray-400 text-center mb-6">Sign in to your account to continue.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-300 block mb-1">Phone</label>
            <input
              type="text"
              placeholder="e.g. 1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#f5a623]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#f5a623]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-xs text-[#f5a623] hover:underline">
              Forgot Password
            </Link>
          </div>

          {/* Cloudflare Mock Badge */}
          <div className="bg-white text-gray-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <ShieldCheck size={18} />
              <span>Success!</span>
            </div>
            <span className="text-[10px] text-gray-500 font-semibold tracking-wider">CLOUDFLARE</span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#f5a623] hover:bg-[#e0961f] text-black font-semibold py-3 rounded-xl text-sm transition shadow-md"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-5">
          Don't have any account?{" "}
          <Link href="/auth/sign-up" className="text-[#f5a623] font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
