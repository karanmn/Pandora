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

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, ""); // spaces automatically remove kar dega

    if (!gmailUser || !gmailPass) {
      return NextResponse.json(
        { success: false, error: "GMAIL_USER or GMAIL_APP_PASSWORD is not set in Environment Variables." },
        { status: 500 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const mailOptions = {
      from: `"Pandora Security" <${gmailUser}>`,
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
      otpHash: otp,
    });
  } catch (err) {
    console.error("Gmail Error Detail:", err);
    // Real exact error screen par dikhega:
    return NextResponse.json(
      { success: false, error: err.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
