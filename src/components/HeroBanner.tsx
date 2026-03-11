import React from 'react';
import { Shirt, Palette, Globe, MapPin, Activity, ArrowRight } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-black shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] mb-12 flex flex-col font-sans transition-all duration-700 ease-in-out hover:shadow-[0_20px_80px_rgba(8,_112,_184,_0.2)] p-[2px] group">
      {/* Animated gradient border effect */ }
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-1000 animate-pulse"></div>
      
      {/* Main Inner Container (Glassmorphism)*/}
      <div className="relative z-10 w-full h-full rounded-[2rem] md:rounded-[3rem] p-6 lg:p-10 flex flex-col gap-8 bg-zinc-950/80 backdrop-blur-2xl border border-white/5 overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>

        {/* Header Section */}
        <div className="text-center w-full relative z-20 transform transition-transform duration-700 hover:scale-[1.02]">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-indigo-200 tracking-tight drop-shadow-sm mb-2">
            Sehlangia Sports Wear
          </h1>
          <p className="text-cyan-400 font-medium tracking-[0.2em] text-sm md:text-base uppercase flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-cyan-500/50"></span>
            Manufacturing
            <span className="w-8 h-[1px] bg-cyan-500/50"></span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch flex-1 relative z-20">
          
          {/* Left Column - Grow Your Game */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 w-max text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              Grow Your Game
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { icon: Shirt, color: "text-cyan-400", title: "Customised", sub: "Sports Wear" },
                { icon: Shirt, color: "text-indigo-400", title: "Sublimation", sub: "Sports Wear" },
                { icon: Palette, color: "text-fuchsia-400", title: "Choose Your Style", sub: "& Design" }
              ].map((item, idx) => (
                <div key={idx} className="group/card flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden relative">
                   {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${item.color} group-hover/card:scale-110 transition-transform duration-300`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white leading-tight">{item.title}</h3>
                    <p className="text-sm text-zinc-400">{item.sub}</p>
                  </div>
                  <ArrowRight className="ml-auto text-zinc-600 group-hover/card:text-white group-hover/card:translate-x-1 transition-all duration-300" size={20} />
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - Details */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="group/featured relative flex-1 rounded-3xl overflow-hidden p-[1px] bg-gradient-to-b from-white/10 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 group-hover/featured:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full rounded-[23px] bg-zinc-900/90 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center">
                <h2 className="text-xl font-bold text-white mb-2 leading-tight">All Sports Wear Available Online</h2>
                <p className="text-zinc-400 text-sm mb-4">Customized Products At Affordable Prices. Jersey T-Shirts, Tracksuits & More!</p>
                <div className="inline-block rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 border border-cyan-500/20">
                  Volleyball & Net Available
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-5 text-center backdrop-blur-md">
              < Globe className="mx-auto mb-2 text-indigo-400" size={24} />
              <h3 className="text-sm font-medium text-indigo-100 mb-1">Worldwide Shipping Facility</h3>
              <p className="text-xs text-zinc-400">Order Now: Manjeet - <span className="text-white font-medium">8053902959</span></p>
              <p className="text-xs text-indigo-300/80 mt-1">manjeet.sehlangia.08@gmail.com</p>
            </div>
          </div>

          {/* Right Column - Visual Graphic elements (iPhone style Floating 3D feel) */}
          <div className="md:col-span-4 relative rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent overflow-hidden flex items-center justify-center p-8 group overflow-hidden">
            {/* Fluid animated shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-colors duration-700"></div>
            
            <div className="relative z-10 w-full aspect-square max-w-[200px] flex items-center justify-center">
                {/* Floating objects with different animation timings */}
               <div className="absolute animate-[bounce_4s_ease-in-out_infinite]">
                 <Shirt size={120} fill="currentColor" className="text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.3)] filter" />
               </div>
               <div className="absolute -bottom-8 -right-8 animate-[bounce_5s_ease-in-out_infinite_0.5s]">
                 <Shirt size={70} fill="currentColor" className="text-cyan-500 drop-shadow-[0_10px_20px_rgba(6,182,212,0.5)] -rotate-12" />
               </div>
                <div className="absolute -top-4 -left-4 animate-[bounce_6s_ease-in-out_infinite_1s]">
                 <Shirt size={50} fill="currentColor" className="text-indigo-500 drop-shadow-[0_10px_20px_rgba(99,102,241,0.5)] rotate-12" />
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 flex items-center justify-center relative overflow-hidden backdrop-blur-md">
           <MapPin className="text-zinc-400 mr-2" size={18} />
           <p className="text-center font-medium text-sm md:text-base text-zinc-300 tracking-wide">
             Sehlang, Mahendergarh, Haryana (India)
           </p>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
