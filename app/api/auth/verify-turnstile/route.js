import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();

    const secretKey =
      process.env.CLOUDFLARE_SECRET_KEY ||
      "0x4AAAAAAFLWzXTCrgSEXMeyPkhAX42h3Gg";

    // Cloudflare verification endpoint call karein
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Cloudflare verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
