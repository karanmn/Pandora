"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [identifier, setIdentifier] = useState(""); // User ID or Phone
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Real database check (Phone number ya User ID se match karega)
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`user_id.eq.${identifier.trim()},phone.eq.${identifier.trim()}`)
        .single();

      if (error || !data) {
        setErrorMsg("User ID / Phone not found");
        setLoading(false);
        return;
      }

      // Password Verification
      if (data.password_hash !== password) {
        setErrorMsg("Invalid password");
        setLoading(false);
        return;
      }

      // Login Successful -> Session store karein
      localStorage.setItem("pandora_user", JSON.stringify({
        id: data.id,
        user_id: data.user_id,
        balance: data.balance,
      }));

      // Panel par redirect karein
      router.push("/user/select-panel");
    } catch (err) {
      console.error(err);
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
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

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-2.5 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-300 block mb-1">User ID / Phone</label>
            <input
              type="text"
              placeholder="e.g. EW00022233"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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

          {/* Cloudflare Badge */}
          <div className="bg-white text-gray-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <ShieldCheck size={18} />
              <span>Success!</span>
            </div>
            <span className="text-[10px] text-gray-500 font-semibold tracking-wider">CLOUDFLARE</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f5a623] hover:bg-[#e0961f] text-black font-semibold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Verifying..." : "Sign In"}
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
