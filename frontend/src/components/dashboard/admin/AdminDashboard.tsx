import { useEffect, useState } from "react";
import { Users, BookOpen, IndianRupee, TrendingUp, UserCheck, Shield } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminStats {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    totalRevenue: number;
}

interface RevenueData {
    name: string;
    revenue: number;
}

const AdminDashboard = () => {
    const { token } = useAuthStore();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                    setRevenueData(res.data.recentRevenue);
                }
            } catch (error) {
                console.error("Error fetching admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    if (loading) {
        return (
            <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array(4).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-3xl bg-white/5" />
                    ))}
                </div>
                <Skeleton className="h-[400px] rounded-[2.5rem] bg-white/5" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-10 space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />

            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                    Admin <span className="text-blue-500">Dashboard</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                    Platform Overview and Management
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6"
                >
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Users</p>
                        <p className="text-2xl font-black text-white">{stats?.totalUsers}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6"
                >
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Students</p>
                        <p className="text-2xl font-black text-white">{stats?.totalStudents}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6"
                >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Shield size={28} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Instructors</p>
                        <p className="text-2xl font-black text-white">{stats?.totalInstructors}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6"
                >
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <IndianRupee size={28} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Revenue</p>
                        <p className="text-2xl font-black text-white">₹{stats?.totalRevenue.toLocaleString()}</p>
                    </div>
                </motion.div>
            </div>

            {/* Recent Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-blue-500" />
                        <h2 className="text-xl font-black text-white">Recent Course Revenue</h2>
                    </div>
                </div>
                <div className="h-[400px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                angle={-15}
                                textAnchor="end"
                            />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1rem', color: '#fff' }}
                            />
                            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                {revenueData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-4"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
                        <BookOpen size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white">Course Management</h3>
                    <p className="text-gray-400 max-w-xs">View, monitor and manage all courses published on the platform.</p>
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                        Manage Courses
                    </button>
                </motion.div>

                <motion.div
                    className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-4"
                >
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-2">
                        <Users size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white">User Management</h3>
                    <p className="text-gray-400 max-w-xs">Control user access, update roles, and manage platform members.</p>
                    <button className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-600/20">
                        Manage Users
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
