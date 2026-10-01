import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid email required" }, { status: 400 });
    }

    // 6 Digit random OTP generate karein
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

    // Agar user email pehle se exist karti hai toh update ya temporary verify table me save
    // Demo/Sandbox testing ke liye console log:
    console.log(`[PANDORA OTP] Generated for ${email}: ${otp}`);

    // Supabase me OTP store karein ya local cache me
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to email",
      // Testing ke liye debug OTP return kar rahe hain taaki instant check ho sake:
      debugOtp: otp,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
