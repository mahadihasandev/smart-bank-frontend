"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { DollarSign, Calendar, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function ApplyLoanPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<number | "">("");
  const [termMonths, setTermMonths] = useState<number>(12);
  const [error, setError] = useState("");

  const applyMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/loans", { amount: Number(amount), termMonths });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myloans"] });
      router.push("/dashboard");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to apply for loan.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 100) {
      setError("Please enter an amount of at least $100");
      return;
    }
    setError("");
    applyMutation.mutate();
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />
      
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col md:flex-row gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 w-fit border border-blue-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Application</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Fund your next big <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">opportunity.</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-lg">
            Get instant decisions on personal and business loans. Transparent rates, flexible terms, and no hidden fees.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="p-3 glass rounded-xl text-primary"><DollarSign className="w-5 h-5"/></div>
              <div>
                <h3 className="font-semibold text-white">Competitive Rates</h3>
                <p className="text-sm text-muted-foreground">Starting at just 5.5% APR based on your credit profile.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 glass rounded-xl text-primary"><Calendar className="w-5 h-5"/></div>
              <div>
                <h3 className="font-semibold text-white">Flexible Repayment</h3>
                <p className="text-sm text-muted-foreground">Choose a term from 6 to 60 months that fits your budget.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2"
        >
          <div className="glass p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <h2 className="text-2xl font-bold mb-6 relative">Loan Application Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">How much do you need?</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    min="100"
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || "")}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Term Duration (Months)</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {[6, 12, 24, 36, 60].map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setTermMonths(months)}
                      className={`py-3 rounded-xl border font-medium transition-all ${
                        termMonths === months 
                          ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                          : "glass text-muted-foreground hover:text-white"
                      }`}
                    >
                      {months}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Math preview */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated APR</span>
                  <span className="font-medium">5.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Payment</span>
                  <span className="font-bold text-lg text-primary">
                    ${amount ? ((Number(amount) * (1 + 0.055)) / termMonths).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={applyMutation.isPending}
                className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-4"
              >
                {applyMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
