import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// Generate a random 6-digit number
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Please provide an email" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak whether the email exists for security (or do, depending on product reqs)
      return NextResponse.json(
        { message: "If that email exists, an OTP has been sent." },
        { status: 200 }
      );
    }

    // Rate Limiting: max 1 request per 60 seconds
    if (user.lastOtpRequestedAt) {
      const now = new Date();
      const diff = now.getTime() - new Date(user.lastOtpRequestedAt).getTime();
      if (diff < 60000) { // 60 seconds
        return NextResponse.json(
          { message: "Please wait 1 minute before requesting another OTP." },
          { status: 429 }
        );
      }
    }

    // Generate and save OTP
    const otp = generateOTP();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.lastOtpRequestedAt = new Date();
    await user.save();

    // -------------------------------------------------------------
    // IMPORTANT: In a real app, integrate NodeMailer, SendGrid, etc.
    // For this development/mock phase, we console.log it and optionally return it
    // -------------------------------------------------------------
    console.log(`[DEVELOPMENT ONLY] OTP for ${email} is: ${otp}`);

    return NextResponse.json(
      { 
        message: "OTP sent successfully.", 
        // Returning OTP in response for immediate testing ease without console
        _devOtp: process.env.NODE_ENV !== "production" ? otp : undefined 
      },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to process request", error: error.message },
      { status: 500 }
    );
  }
}
