"use client";

import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Home, LogOut, Bell, Menu, X, MapPin, Package } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState, Suspense } from "react";

// Use Date object or simple relative time formatting for real notifications
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const Navbar = () => {
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  // Fetch real notifications
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const fetchNotifs = async () => {
        try {
          const res = await fetch(`/api/notifications?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (error) {
          console.error("Failed to fetch notifications");
        }
      };
      
      fetchNotifs();
      // Optional: Polling every 30s for real-time feel
      const interval = setInterval(fetchNotifs, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    // Optimistic UI update
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, markAllRead: true })
      });
    } catch (e) {
      console.error("Failed to mark notifications read");
    }
  };

  return (
    <nav className="w-full flex items-center justify-between border-b border-gray-200 pb-4 mt-4 relative z-50 bg-white">
      {/* LEFT - LOGO */}
      <Link href="/" className="flex items-center z-50" onClick={() => setIsMobileMenuOpen(false)}>
        <Image
          src="/logo.png"
          alt="Sehlangia Sports"
          width={36}
          height={36}
          className="w-8 h-8 md:w-9 md:h-9"
        />
        <p className="hidden xs:block text-md font-medium tracking-wider ml-2 text-zinc-900">
          SEHLANGIA SPORTS.
        </p>
      </Link>
      
      {/* RIGHT - DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-6 z-50">
        <div className="w-64">
           <Suspense fallback={<div className="h-8 w-full bg-gray-100 rounded animate-pulse" />}>
             <SearchBar />
           </Suspense>
        </div>
        <Link href="/">
          <Home className="w-5 h-5 text-gray-600 hover:text-cyan-500 transition-colors"/>
        </Link>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1 text-gray-600 hover:text-cyan-500 transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden transform origin-top-right transition-all">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm">
                <h3 className="font-semibold text-sm text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-cyan-600 hover:text-cyan-800 font-medium">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-cyan-50/30' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-gray-400">{formatTime(notif.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{notif.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        <ShoppingCartIcon/>
        
        {mounted && isAuthenticated ? (
           <div className="flex items-center gap-3">
             <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
               <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold text-sm shadow-sm border border-cyan-200">
                 {user?.name?.charAt(0).toUpperCase()}
               </div>
               <span className="text-sm font-medium text-zinc-700">Profile</span>
             </Link>
             <Link href="/orders" className="text-sm font-medium text-zinc-700 hover:text-cyan-500 transition-colors ml-2">
               Orders
             </Link>
             <Link href="/addresses" className="flex items-center gap-2 hover:opacity-80 transition-opacity ml-2">
               <MapPin className="w-5 h-5 text-gray-600 hover:text-cyan-500 transition-colors" />
               <span className="text-sm font-medium text-zinc-700 hidden lg:inline">Addresses</span>
             </Link>
             <button onClick={() => logout()} title="Logout" className="text-gray-600 hover:text-red-500 transition-colors p-1 ml-1">
               <LogOut className="w-5 h-5" />
             </button>
           </div>
        ) : (
          <Link href="/login" className="text-sm font-medium hover:text-cyan-500 transition-colors">
            Sign in
          </Link>
        )}
      </div>

      {/* RIGHT - MOBILE MENU ICON */}
      <div className="flex md:hidden items-center gap-4 z-50">
        <ShoppingCartIcon />
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 text-gray-600 hover:text-cyan-600 transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full min-h-[calc(100vh-80px)] bg-white/95 backdrop-blur-md flex flex-col p-6 gap-6 z-40 md:hidden animate-in slide-in-from-top-2 duration-300">
          <div className="w-full">
            <Suspense fallback={<div className="h-8 w-full bg-gray-100 rounded animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>
          
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-zinc-700 font-medium text-lg hover:text-cyan-600 transition-colors mt-2">
            <Home className="w-6 h-6 text-zinc-400" /> 
            Home
          </Link>

          {/* Mobile Notifications Toggle */}
          <div className="flex flex-col gap-4">
             <button 
               onClick={() => setShowNotifications(!showNotifications)} 
               className="flex items-center justify-between text-zinc-700 font-medium text-lg hover:text-cyan-600 outline-none w-full text-left"
             >
                <div className="flex items-center gap-4">
                   <div className="relative">
                     <Bell className="w-6 h-6 text-zinc-400" />
                     {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                   </div>
                   Notifications
                </div>
                {unreadCount > 0 && <span className="bg-red-500 text-white font-mono text-xs px-2 py-0.5 rounded-full shadow-sm">{unreadCount} new</span>}
             </button>
             
             {/* Open Mobile Notifications */}
             {showNotifications && (
               <div className="pl-10 flex flex-col gap-4 max-h-60 overflow-y-auto pr-2 border-l-2 border-zinc-100 ml-3 animate-in fade-in duration-200">
                 {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className="flex flex-col gap-1 border-b border-zinc-100 pb-3">
                         <div className="flex justify-between items-center">
                            <span className={`text-[15px] ${!notif.read ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-500'}`}>{notif.title}</span>   
                            <span className="text-[10px] text-zinc-400">{formatTime(notif.createdAt)}</span>
                         </div>
                         <p className="text-xs text-zinc-500 leading-snug">{notif.desc}</p>
                      </div>
                    ))
                 ) : (
                    <span className="text-sm text-zinc-400 italic">No notifications</span>
                 )}
                 {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs text-cyan-600 font-medium text-left pt-1">Mark all as read</button>}
               </div>
             )}
          </div>

          <hr className="border-zinc-200 w-full" />

          {/* Mobile User Controls */}
          {mounted && isAuthenticated ? (
             <div className="flex flex-col gap-6 w-full">
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-zinc-700 font-medium text-lg hover:text-cyan-600 transition-colors">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 font-bold text-sm shadow-sm ring-1 ring-cyan-200">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  Your Profile
                </Link>
                <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-zinc-700 font-medium text-lg hover:text-cyan-600 transition-colors">
                  <Package className="w-6 h-6 text-zinc-400" />
                  Your Orders
                </Link>
                <Link href="/addresses" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-zinc-700 font-medium text-lg hover:text-cyan-600 transition-colors">
                  <MapPin className="w-6 h-6 text-zinc-400" /> 
                  Your Addresses
                </Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 text-red-500 font-medium text-lg text-left hover:text-red-700 transition-colors">
                  <LogOut className="w-6 h-6 text-red-400" /> Sign out
                </button>
             </div>
          ) : (
             <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center w-full py-4 bg-zinc-900 text-white rounded-xl font-semibold text-lg hover:bg-zinc-800 transition-colors shadow-md active:scale-[0.98]">
                Sign In to Account
             </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
