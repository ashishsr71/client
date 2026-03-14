"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Step 1 Payload
  const [email, setEmail] = useState("");

  // Step 2 Payload
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to request OTP");
      }

      toast.success("If an account exists, an OTP has been sent!");
      
      // For dev purposes, if API returned _devOtp, show it in toast
      if (data._devOtp) {
        toast.info(`[DEV] OTP is: ${data._devOtp}`, { autoClose: 10000 });
      }

      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to verify OTP or reset password");
      }

      toast.success("Password reset successfully! Please sign in.");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      toast.error(err.message || "OTP verification failed. Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white border text-center border-zinc-200 shadow-md p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">
          {step === 1 ? "Forgot Password?" : "Secure Password Reset"}
        </h1>
        <p className="text-sm text-zinc-500 mb-8">
          {step === 1 
            ? "Enter your email and we'll send you a 6-digit OTP to reset your password." 
            : "Enter the OTP sent to your email and your new password."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2.5 rounded-lg font-semibold transition-opacity ${loading ? "bg-cyan-400 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"}`}
            >
              {loading ? "Sending..." : "Send Reset OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                maxLength={6}
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm text-center tracking-widest font-mono font-bold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                required
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                required
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2.5 rounded-lg mt-2 font-semibold transition-opacity ${loading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {loading ? "Verifying..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setOtp(""); }}
              className="w-full text-zinc-600 text-sm py-2 hover:bg-zinc-100 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </form>
        )}

        <div className="mt-8 border-t border-zinc-100 pt-4 text-sm text-zinc-500">
          Remember your password?{" "}
          <Link href="/login" className="text-cyan-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
