import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address required" },
        { status: 400 }
      );
    }

    // 6-digit random numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Gmail SMTP Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || "your-email@gmail.com", // Aapka Gmail address
        pass: process.env.GMAIL_APP_PASSWORD || "abcd efgh ijkl mnop", // 16-digit App Password
      },
    });

    const mailOptions = {
      from: `"Pandora Security" <${process.env.GMAIL_USER || "your-email@gmail.com"}>`,
      to: email.trim().toLowerCase(),
      subject: `Your Pandora Verification Code: ${otp}`,
      html: `
        <div style="background-color: #0e1014; color: #ffffff; padding: 25px; font-family: Arial, sans-serif; border-radius: 12px; max-width: 450px; margin: 0 auto; border: 1px solid #272a34;">
          <h2 style="color: #f5a623; text-align: center; margin-bottom: 20px;">PANDORA</h2>
          <p style="font-size: 14px; text-align: center; color: #d1d5db;">Use this OTP to complete your registration:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f5a623; background: #16181f; padding: 10px 20px; border-radius: 8px; border: 1px solid #333;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 11px; text-align: center; color: #6b7280;">Valid for 10 minutes. Do not share this code.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to your email!",
      otpHash: otp, // Frontend validation ke liye
    });
  } catch (err) {
    console.error("Gmail SMTP Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send email. Check credentials." },
      { status: 500 }
    );
  }
}
