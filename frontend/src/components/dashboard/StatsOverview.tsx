import { useAuthStore } from "@/store/authStore";
import { useCoursesStore } from "@/store/courseStore";
import { BookOpen, GraduationCap, TrendingUp, Users, DollarSign, Clock } from "lucide-react";
import { motion } from "framer-motion";

const StatsOverview = () => {
    const { user } = useAuthStore();
    const { courses } = useCoursesStore();

    const isInstructor = user?.role === "instructor";

    // Mock or calculated stats
    const stats = isInstructor
        ? [
            {
                label: "Total Students",
                value: courses.reduce((acc, curr) => acc + (curr.studentsEnrolled?.length || 0), 0),
                icon: <Users className="w-6 h-6 text-blue-400" />,
                color: "blue"
            },
            {
                label: "Active Courses",
                value: courses.filter(c => c.instructor?._id === user?._id).length,
                icon: <BookOpen className="w-6 h-6 text-purple-400" />,
                color: "purple"
            },
            {
                label: "Total Earnings",
                value: `₹${courses.reduce((acc, curr) => acc + (curr.price * (curr.studentsEnrolled?.length || 0)), 0)}`,
                icon: <DollarSign className="w-6 h-6 text-green-400" />,
                color: "green"
            },
            {
                label: "Avg. Rating",
                value: "4.8",
                icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
                color: "amber"
            }
        ]
        : [
            {
                label: "Enrolled Courses",
                value: courses.filter(c => c.studentsEnrolled?.includes(user?._id as any)).length,
                icon: <BookOpen className="w-6 h-6 text-blue-400" />,
                color: "blue"
            },
            {
                label: "Completed",
                value: "2",
                icon: <GraduationCap className="w-6 h-6 text-green-400" />,
                color: "green"
            },
            {
                label: "Hours Spent",
                value: "12h",
                icon: <Clock className="w-6 h-6 text-purple-400" />,
                color: "purple"
            },
            {
                label: "Points",
                value: "1250",
                icon: <TrendingUp className="w-6 h-6 text-pink-400" />,
                color: "pink"
            }
        ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsOverview;
