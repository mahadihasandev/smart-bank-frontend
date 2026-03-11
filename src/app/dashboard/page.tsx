"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { CreditCard, DollarSign, Activity, Settings, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push("/login");
    } else if (user.role === "admin") {
      router.push("/admin");
    }
  }, [user, router]);

  const { data: loans, isLoading } = useQuery({
    queryKey: ["myloans"],
    queryFn: async () => {
      const { data } = await api.get("/loans/myloans");
      return data;
    },
    enabled: !!user && user.role === "client",
  });

  if (!mounted || !user) return null;

  const totalBorrowed = loans?.filter((l: any) => l.status === "approved").reduce((acc: number, l: any) => acc + l.amount, 0) || 0;
  
  // Dummy data for credit score if not brought deeply via API
  const creditScore = 740;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name.split(" ")[0]}</h1>
            <p className="text-muted-foreground">Here is an overview of your financial status.</p>
          </div>
          <Link 
            href="/apply-loan"
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] shadow-primary/30"
          >
            <Plus className="w-5 h-5" />
            Apply for Loan
          </Link>
        </motion.div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Borrowed</p>
            <h2 className="text-4xl font-bold tracking-tight">${totalBorrowed.toLocaleString()}</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Credit Score</p>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl font-bold tracking-tight text-green-400">{creditScore}</h2>
              <span className="text-sm text-green-400/80 font-medium mb-1 border border-green-400/20 bg-green-400/10 px-2 py-0.5 rounded-md">Excellent</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Active Loans</p>
            <h2 className="text-4xl font-bold tracking-tight">{loans?.filter((l: any) => l.status === "approved").length || 0}</h2>
          </motion.div>
        </div>

        {/* Recent Applications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Your Loan History</h3>
          </div>
          
          <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
            {isLoading ? (
              <div className="p-10 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : loans?.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium mb-2">No loans yet</h4>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">You haven't requested any loans yet. Apply for your first loan to get started.</p>
                <Link href="/apply-loan" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Apply Now →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-muted-foreground uppercase bg-white/5">
                    <tr>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Duration</th>
                      <th className="px-6 py-4 font-medium">Rate</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loans?.map((loan: any) => (
                      <tr key={loan._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white font-medium">
                          {format(new Date(loan.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 font-semibold">${loan.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-muted-foreground">{loan.termMonths} months</td>
                        <td className="px-6 py-4 text-muted-foreground">{loan.interestRate}%</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            loan.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                            loan.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          }`}>
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
