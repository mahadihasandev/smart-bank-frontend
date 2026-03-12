"use client"

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Landmark, LogOut, LayoutDashboard, User } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full glass shadow-xl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Landmark className="w-8 h-8 text-primary" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              SmartBank
            </span>
          </Link>

          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="px-4 py-2 rounded-full border border-white/10 bg-black/20 text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  {user.name}
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
