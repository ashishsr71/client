"use client";

import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Fetch full profile data
      fetch(`/api/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.message) {
            setProfileData({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              bio: data.bio || "",
            });
          }
        })
        .catch((err) => console.error("Could not fetch user profile", err));
    }
  }, [isAuthenticated, user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const onUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setSavingProfile(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          bio: profileData.bio,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      
      toast.success("Profile updated successfully!");
      // Optionally trigger checkAuth to let store know name changed
      checkAuth();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSavingProfile(false);
    }
  };

  const onUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch(`/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");

      toast.success("Password updated successfully! Please re-login.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Force logout to necessitate using new password
      logout();
      router.push("/login");

    } catch (err: any) {
      toast.error(err.message || "Failed to submit password change.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-24">Loading your profile...</div>;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
         <h1 className="text-2xl font-semibold mb-4 text-zinc-800">Please Sign In</h1>
         <p className="text-zinc-500 mb-6">You must be signed in to manage your profile.</p>
         <button onClick={() => router.push("/login")} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 border-b border-zinc-100 pb-6">
        <h1 className="text-3xl font-semibold text-zinc-800 tracking-tight">Account Settings</h1>
        <p className="text-zinc-500 mt-2">Manage your profile information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Profile Details Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-800">
            Personal Details
          </h2>
          <form onSubmit={onUpdateProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-500 rounded-md text-sm cursor-not-allowed"
              />
              <span className="text-[11px] text-zinc-400">Email addresses cannot be changed directly.</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="+1 234 567 890"
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Bio / Extra Details</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder="A short description about yourself or specific delivery instructions..."
                rows={4}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className={`mt-4 w-full py-2.5 rounded-md font-semibold text-white transition-opacity ${savingProfile ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {savingProfile ? "Saving..." : "Save Profile Details"}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 h-max">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-800">
            Security & Password
          </h2>
          <form onSubmit={onUpdatePassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="w-full border-t border-zinc-100 my-2"></div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className={`mt-4 w-full py-2.5 rounded-md font-semibold text-white transition-opacity ${savingPassword ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
