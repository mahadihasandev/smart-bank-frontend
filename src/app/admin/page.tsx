"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ShieldCheck, Users, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push("/login");
    } else if (user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const { data: allLoans, isLoading } = useQuery({
    queryKey: ["allLoans"],
    queryFn: async () => {
      const { data } = await api.get("/loans");
      return data;
    },
    enabled: !!user && user.role === "admin",
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/loans/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLoans"] });
    },
  });

  const handleUpdate = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (!mounted || !user || user.role !== "admin") return null;

  const pendingLoans = allLoans?.filter((l: any) => l.status === "pending") || [];
  const approvedLoans = allLoans?.filter((l: any) => l.status === "approved") || [];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[120px] pointer-events-none" />
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold mb-3 border border-red-500/20 tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              ADMIN PORTAL
            </div>
            <h1 className="text-3xl font-bold mb-1">Lending Command Center</h1>
            <p className="text-muted-foreground">Review and manage client loan applications.</p>
          </div>
        </motion.div>

        {/* Top Cards for Admin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Pending Reviews</p>
            <h2 className="text-4xl font-bold tracking-tight text-yellow-400">{pendingLoans.length}</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Active Loans Overview</p>
            <h2 className="text-4xl font-bold tracking-tight">${approvedLoans.reduce((acc: number, l: any) => acc + l.amount, 0).toLocaleString()}</h2>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Loan Records</p>
            <h2 className="text-4xl font-bold tracking-tight">{allLoans?.length || 0}</h2>
          </motion.div>
        </div>

        {/* Applications Review */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Application Queue</h3>
          </div>
          
          <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
            {isLoading ? (
              <div className="p-10 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : allLoans?.length === 0 ? (
              <div className="p-16 text-center text-muted-foreground">
                No loan applications exist in the system yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-muted-foreground uppercase bg-white/5">
                    <tr>
                      <th className="px-6 py-4 font-medium">Applicant</th>
                      <th className="px-6 py-4 font-medium">Credit Score</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Terms</th>
                      <th className="px-6 py-4 font-medium">Status & Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allLoans?.map((loan: any) => (
                      <tr key={loan._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{loan.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{loan.user?.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${loan.user?.creditScore >= 700 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {loan.user?.creditScore || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold">${loan.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {loan.termMonths}mo @ {loan.interestRate}%
                          <div className="text-xs mt-0.5">{format(new Date(loan.createdAt), "MMM dd")}</div>
                        </td>
                        <td className="px-6 py-4">
                          {loan.status === "pending" ? (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleUpdate(loan._id, "approved")}
                                disabled={updateStatusMutation.isPending}
                                className="group p-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20 disabled:opacity-50"
                              >
                                {updateStatusMutation.isPending && updateStatusMutation.variables?.id === loan._id && updateStatusMutation.variables?.status === "approved" ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <button 
                                onClick={() => handleUpdate(loan._id, "rejected")}
                                disabled={updateStatusMutation.isPending}
                                className="group p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 disabled:opacity-50"
                              >
                                {updateStatusMutation.isPending && updateStatusMutation.variables?.id === loan._id && updateStatusMutation.variables?.status === "rejected" ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              loan.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                              loan.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                              'bg-neutral-500/10 text-neutral-400 border border-white/10'
                            }`}>
                              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                            </span>
                          )}
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
