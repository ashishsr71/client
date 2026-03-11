import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 relative w-full overflow-hidden rounded-[2rem] bg-black shadow-[0_-10px_40px_rgba(8,_112,_184,_0.1)] mb-8 p-[1px] group">
      {/* Animated gradient top border effect */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      {/* Main Inner Container (Glassmorphism) */}
      <div className="relative z-10 w-full h-full rounded-[2rem] bg-zinc-950/80 backdrop-blur-2xl border border-white/5 p-8 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-zinc-400">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group/logo">
              <div className="relative p-2 rounded-xl bg-white/5 border border-white/10 group-hover/logo:border-cyan-500/50 transition-colors">
                 <Image src="/logo.png" alt="Sehlangia Sports" width={32} height={32} className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 group-hover/logo:to-cyan-400 transition-all">
                SEHLANGIA SPORTS
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Elevate your style with our premium sportswear. Manufacturing excellence meets modern design.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 transform hover:-translate-y-1">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-cyan-400 font-semibold tracking-wider text-sm uppercase mb-2">Shop Links</h3>
            {['All Products', 'New Arrivals', 'Best Sellers', 'Trending Items'].map((link) => (
              <Link key={link} href="/" className="text-zinc-400 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></span>
                {link}
              </Link>
            ))}
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-cyan-400 font-semibold tracking-wider text-sm uppercase mb-2">Company</h3>
            {['About Us', 'Contact', 'Terms of Service', 'Privacy Policy'].map((link) => (
              <Link key={link} href="/" className="text-zinc-400 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></span>
                {link}
              </Link>
            ))}
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-cyan-400 font-semibold tracking-wider text-sm uppercase mb-2">Contact Us</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 group/contact">
                <MapPin className="text-zinc-500 group-hover/contact:text-cyan-400 transition-colors mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-zinc-400 leading-relaxed">Sehlang, Mahendergarh,<br/>Haryana (India)</p>
              </div>
              <div className="flex items-center gap-3 group/contact">
                <Phone className="text-zinc-500 group-hover/contact:text-cyan-400 transition-colors shrink-0" size={18} />
                <p className="text-sm text-zinc-400">8053902959</p>
              </div>
              <div className="flex items-center gap-3 group/contact">
                <Mail className="text-zinc-500 group-hover/contact:text-cyan-400 transition-colors shrink-0" size={18} />
                <p className="text-sm text-zinc-400">manjeet.sehlangia.08@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Sehlangia Sports. All rights reserved.
          </p>
          <div className="font-mono text-xs text-zinc-600 flex items-center gap-2">
            Built with <span className="animate-pulse text-cyan-500">♥</span> for Performance
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
