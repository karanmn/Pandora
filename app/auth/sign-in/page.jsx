"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const turnstileContainerRef = useRef(null);

  // Aapki Real Cloudflare Turnstile Public Site Key
  const TURNSTILE_SITE_KEY = "0x4AAAAAAFLWzcOOhbjjGniV";

  const renderTurnstile = () => {
    if (window.turnstile && turnstileContainerRef.current) {
      window.turnstile.render(turnstileContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        callback: (token) => {
          setCaptchaToken(token);
        },
        "expired-callback": () => {
          setCaptchaToken(null);
        },
        "error-callback": () => {
          setErrorMsg("Cloudflare validation failed. Domain check karein.");
        },
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setErrorMsg("Please complete the Cloudflare verification first.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Backend API par Cloudflare token verify karein
      const verifyRes = await fetch("/api/auth/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaToken }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        setErrorMsg("Captcha validation failed on server.");
        setLoading(false);
        return;
      }

      // 2. Supabase DB verify
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

      if (data.password_hash !== password) {
        setErrorMsg("Invalid password");
        setLoading(false);
        return;
      }

      // Session save
      localStorage.setItem(
        "pandora_user",
        JSON.stringify({
          id: data.id,
          user_id: data.user_id,
          balance: data.balance,
        })
      );

      router.push("/user/select-panel");
    } catch (err) {
      console.error(err);
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderTurnstile}
      />

      <div className="min-h-screen bg-[#0e1014] text-white flex flex-col justify-center items-center px-4 py-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full border border-teal-500/50 bg-[#161922] flex items-center justify-center mb-2 shadow-lg shadow-teal-500/10">
            <span className="text-2xl">🌐</span>
          </div>
          <h1 className="text-lg font-bold tracking-widest uppercase text-gray-200">Pandora</h1>
        </div>

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

            {/* Live Cloudflare Turnstile Box */}
            <div className="flex justify-center items-center py-1">
              <div ref={turnstileContainerRef} className="min-h-[65px] flex items-center justify-center"></div>
            </div>

            <button
              type="submit"
              disabled={loading || !captchaToken}
              className="w-full bg-[#f5a623] hover:bg-[#e0961f] text-black font-semibold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
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
    </>
  );
}
