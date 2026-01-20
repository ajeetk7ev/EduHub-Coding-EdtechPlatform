import { useEffect, useState } from "react";
import { Users, BookOpen, IndianRupee, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface InstructorStats {
    _id: string;
    courseName: string;
    totalStudentsEnrolled: number;
    totalAmountGenerated: number;
    [key: string]: any;
}

const InstructorAnalytics = () => {
    const { token } = useAuthStore();
    const [stats, setStats] = useState<InstructorStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_URL}/instructor/instructor-stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setStats(res.data.courses);
                }
            } catch (error) {
                console.error("Error fetching instructor stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const totalStudents = stats.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0);
    const totalEarnings = stats.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0);

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    if (loading) {
        return (
            <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-3xl bg-white/5" />
                    ))}
                </div>
                <Skeleton className="h-[400px] rounded-[2.5rem] bg-white/5" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-10 space-y-12 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />

            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                    Instructor <span className="text-blue-500">Analytics</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                    Track your performance and course engagement
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6"
                >
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Total Courses</p>
                        <p className="text-3xl font-black text-white">{stats.length}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6"
                >
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Total Students</p>
                        <p className="text-3xl font-black text-white">{totalStudents}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6"
                >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <IndianRupee size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Total Earnings</p>
                        <p className="text-3xl font-black text-white">₹{totalEarnings.toLocaleString()}</p>
                    </div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Earnings Breakdown */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="text-blue-500" />
                        <h2 className="text-xl font-black text-white">Earnings per Course</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="courseName" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1rem', color: '#fff' }}
                                />
                                <Bar dataKey="totalAmountGenerated" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Student Distribution */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <PieChartIcon className="text-purple-500" />
                        <h2 className="text-xl font-black text-white">Student Distribution</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="totalStudentsEnrolled"
                                >
                                    {stats.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1rem', color: '#fff' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Detailed Course Performance Table */}
            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <h2 className="text-xl font-black text-white">Course Performance Details</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="p-6 text-gray-500 text-xs font-black uppercase tracking-widest">Course Name</th>
                                <th className="p-6 text-gray-500 text-xs font-black uppercase tracking-widest">Students</th>
                                <th className="p-6 text-gray-500 text-xs font-black uppercase tracking-widest text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((course) => (
                                <tr key={course._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 font-bold text-gray-200">{course.courseName}</td>
                                    <td className="p-6 font-black text-white">{course.totalStudentsEnrolled}</td>
                                    <td className="p-6 font-black text-blue-400 text-right">₹{course.totalAmountGenerated.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InstructorAnalytics;
