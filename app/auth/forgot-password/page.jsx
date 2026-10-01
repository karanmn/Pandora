"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Real Email OTP Send Function
  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address first.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setOtpLoading(true);

    try {
      // Pehle check karein ki ye email registered hai ya nahi
      const { data: user, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (error || !user) {
        setErrorMsg("This email is not registered with us.");
        setOtpLoading(false);
        return;
      }

      // API route ko call karke real email bhejein
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setServerOtp(data.otpHash);
        setSuccessMsg("OTP sent to your email! Please check Inbox/Spam.");
      } else {
        setErrorMsg(data.error || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to email service.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Reset Password & Update Supabase
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!serverOtp) {
      setErrorMsg("Please request an OTP first by clicking Send.");
      return;
    }

    if (otp.trim() !== serverOtp.trim()) {
      setErrorMsg("Invalid OTP entered. Please check your email.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Supabase me naya password update karein
      const { error } = await supabase
        .from("users")
        .update({ password_hash: newPassword })
        .eq("email", email.trim().toLowerCase());

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      alert("Password reset successfully! Please login with your new password.");
      router.push("/auth/sign-in");
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
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

      {/* Forgot Password Card */}
      <div className="w-full max-w-sm bg-[#16181f] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold text-center mb-1">Forgot Password</h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          Enter your email and OTP to reset your password.
        </p>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-2.5 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/40 text-green-400 text-xs p-2.5 rounded-xl mb-4 text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Email + Send OTP Button */}
          <div>
            <label className="text-xs text-gray-300 block mb-1">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="e.g. john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2.5 text-sm focus:border-[#f5a623] outline-none"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="px-3 py-2 border border-[#f5a623] text-[#f5a623] text-xs font-semibold rounded-xl hover:bg-[#f5a623]/10 disabled:opacity-50"
              >
                {otpLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>

          {/* OTP Input */}
          <div>
            <label className="text-xs text-gray-300 block mb-1">OTP</label>
            <input
              type="text"
              placeholder="e.g. 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm focus:border-[#f5a623] outline-none"
            />
          </div>

          {/* New Password Input */}
          <div>
            <label className="text-xs text-gray-300 block mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3.5 py-2.5 text-sm focus:border-[#f5a623] outline-none"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f5a623] hover:bg-[#e0961f] text-black font-semibold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Updating Password..." : "Submit"}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link href="/auth/sign-in" className="text-xs text-[#f5a623] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
