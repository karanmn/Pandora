"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Form Fields
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Send OTP Function
  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address first.");
      return;
    }
    setErrorMsg("");
    setOtpLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setServerOtp(data.debugOtp);
        setSuccessMsg(`OTP sent! (Test OTP: ${data.debugOtp})`);
      } else {
        setErrorMsg(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to OTP service.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (serverOtp && otp.trim() !== serverOtp.trim()) {
      setErrorMsg("Invalid OTP entered!");
      return;
    }

    setLoading(true);

    try {
      // 1. Check if Phone or Email already registered
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .or(`phone.eq.${phone.trim()},email.eq.${email.trim()}`)
        .maybeSingle();

      if (existingUser) {
        setErrorMsg("Phone number or Email already registered.");
        setLoading(false);
        return;
      }

      // 2. Generate Random Unique User ID (e.g. EW584920)
      const generatedUserId = `EW${Math.floor(100000 + Math.random() * 900000)}`;

      // 3. Insert new user with Referral/Direct Team relationship
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            user_id: generatedUserId,
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            password_hash: password,
            balance: 100.0, // Registration bonus
            referred_by: inviteCode.trim() ? inviteCode.trim() : null,
          },
        ])
        .select()
        .single();

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // 4. Save session and redirect
      localStorage.setItem(
        "pandora_user",
        JSON.stringify({
          id: data.id,
          user_id: data.user_id,
          name: data.name,
          balance: data.balance,
        })
      );

      alert(`Account Created! Your User ID is: ${generatedUserId}`);
      router.push("/user/select-panel");
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1014] text-white flex flex-col justify-center items-center px-4 py-8">
      {/* Brand */}
      <div className="flex flex-col items-center mb-5">
        <div className="w-12 h-12 rounded-full border border-teal-500/50 bg-[#161922] flex items-center justify-center mb-1">
          <span className="text-xl">🌐</span>
        </div>
        <h1 className="text-base font-bold tracking-widest uppercase">Pandora</h1>
      </div>

      <div className="w-full max-w-sm bg-[#16181f] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold text-center mb-1">Sign Up</h2>
        <p className="text-xs text-gray-400 text-center mb-4">Create an account to get started with us.</p>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-2.5 rounded-xl mb-3 text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/40 text-green-400 text-xs p-2.5 rounded-xl mb-3 text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-300 block mb-1">Invite Code</label>
            <input
              type="text"
              placeholder="e.g. EW00022233"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623] outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623] outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Phone</label>
            <input
              type="tel"
              placeholder="e.g. 1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623] outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="e.g. john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623] outline-none"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="px-3 py-1.5 border border-[#f5a623] text-[#f5a623] text-xs font-semibold rounded-xl hover:bg-[#f5a623]/10 disabled:opacity-50"
              >
                {otpLoading ? "Sending..." : otpSent ? "Resend" : "Verify"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">OTP</label>
            <input
              type="text"
              placeholder="e.g. 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623] outline-none"
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
                required
                className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#101217] border border-gray-700/60 rounded-xl px-3 py-2 text-sm focus:border-[#f5a623] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f5a623] text-black font-semibold py-2.5 rounded-xl text-sm transition mt-2 hover:bg-[#e0961f] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating Account..." : "Sign Up"}
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
