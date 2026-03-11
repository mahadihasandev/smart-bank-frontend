"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Briefcase, Car, Home as HomeIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none" />
      
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        {/* HERO SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-sm md:text-base font-medium mb-10 text-primary border border-primary/20">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-foreground font-semibold">Next-Generation Banking & Loans</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            Empower Your Future with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-400">
              Smart Lending.
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-3xl text-muted-foreground mb-14 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Experience lightning-fast approvals, ultra-transparent rates, and a beautifully crafted dashboard designed to put you in complete control of your financial destiny.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground font-bold rounded-full flex items-center justify-center gap-3 hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all active:scale-95 text-xl group"
            >
              Apply for a Loan Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-10 py-5 glass text-foreground font-bold rounded-full flex items-center justify-center hover:bg-white/10 dark:hover:bg-white/5 transition-all text-xl border border-white/20 dark:border-white/10"
            >
              Access Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* LOAN OPTIONS SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-40 relative z-10"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Tailored Loan Options</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Choose from a variety of flexible financing solutions designed specifically for your unique needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <HomeIcon className="w-10 h-10 text-blue-400" />, title: "Home Loans", desc: "Buy your dream home with low rates." },
              { icon: <Car className="w-10 h-10 text-green-400" />, title: "Auto Loans", desc: "Get on the road faster with quick approvals." },
              { icon: <Briefcase className="w-10 h-10 text-purple-400" />, title: "Business Loans", desc: "Fuel your company's growth and expansion." },
              { icon: <Zap className="w-10 h-10 text-yellow-400" />, title: "Personal Loans", desc: "Fund vacations, medical bills, or emergencies." },
            ].map((option, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass p-8 rounded-3xl group border border-white/10 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/5 dark:bg-black/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{option.title}</h3>
                <p className="text-muted-foreground text-lg">{option.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* HOW IT WORKS SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-40 relative z-10 glass p-12 md:p-20 rounded-[3rem]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Fast, Simple, and <br/> Fully Transparent.</h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">We&apos;ve revolutionized the borrowing experience. No more hidden fees or endless paperwork. Just a seamless journey from application to funding.</p>
              
              <div className="space-y-6">
                {[
                  "Fill out a quick 3-minute application",
                  "Get an instant AI-driven credit decision",
                  "Review your personalized loan offers",
                  "Receive funds in your account within 24 hours"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0" />
                    <span className="text-xl font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-blue-500/30 rounded-3xl blur-2xl transform rotate-3" />
               <div className="glass p-8 rounded-3xl relative border border-white/20 shadow-2xl">
                 <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                   <div>
                     <p className="text-sm text-muted-foreground mb-1">Approved Amount</p>
                     <p className="text-4xl font-bold">$45,000</p>
                   </div>
                   <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                     <ShieldCheck className="w-8 h-8 text-green-400" />
                   </div>
                 </div>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center bg-black/10 dark:bg-white/5 p-4 rounded-xl">
                     <span className="text-muted-foreground">Interest Rate</span>
                     <span className="font-bold text-lg">4.5% APR</span>
                   </div>
                   <div className="flex justify-between items-center bg-black/10 dark:bg-white/5 p-4 rounded-xl">
                     <span className="text-muted-foreground">Term Length</span>
                     <span className="font-bold text-lg">36 Months</span>
                   </div>
                 </div>
                 <button className="w-full mt-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-lg hover:bg-primary/90 transition-colors">
                   Accept Offer
                 </button>
               </div>
            </div>
          </div>
        </motion.div>

        {/* CORE FEATURES SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 relative z-10"
        >
          {[
            {
              icon: <ShieldCheck className="w-10 h-10 text-green-400" />,
              title: "Bank-Grade Security",
              description: "Your personal and financial data is encrypted and protected with industry-leading security protocols.",
            },
            {
              icon: <Zap className="w-10 h-10 text-yellow-400" />,
              title: "Instant Decisions",
              description: "Our advanced algorithm provides instant loan decisions and comprehensive credit scoring.",
            },
            {
              icon: <TrendingUp className="w-10 h-10 text-blue-400" />,
              title: "Growth Focused",
              description: "Competitive interest rates and flexible terms designed to help you grow, not hold you back.",
            },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="glass p-10 rounded-[2.5rem] group"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

