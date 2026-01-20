import { useEffect, useState } from "react";
import { Search, Trash2, UserCog, Mail, ShieldAlert, BadgeCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    image?: string;
}

const UserManagement = () => {
    const { token, user: currentUser } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            const res = await axios.put(`${API_URL}/admin/update-role`,
                { userId, role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            console.error("Error updating role", error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await axios.delete(`${API_URL}/admin/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-10 space-y-6">
                <Skeleton className="h-12 w-1/3 rounded-2xl bg-white/5" />
                <Skeleton className="h-[500px] rounded-[2.5rem] bg-white/5" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">User <span className="text-blue-500">Management</span></h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Total Members: {users.length}</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="p-6 text-gray-500 text-[10px] font-black uppercase tracking-widest">User Details</th>
                                <th className="p-6 text-gray-500 text-[10px] font-black uppercase tracking-widest">Role</th>
                                <th className="p-6 text-gray-500 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredUsers.map((u) => (
                                    <motion.tr
                                        key={u._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 overflow-hidden ring-2 ring-white/5">
                                                    {u.image ? <img src={u.image} alt="" className="w-full h-full object-cover" /> : <Mail size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white leading-tight">{u.firstname} {u.lastname}</p>
                                                    <p className="text-gray-500 text-xs mt-0.5">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                        u.role === 'instructor' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                                                            'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                    }`}>
                                                    {u.role === 'admin' ? <ShieldAlert size={12} /> : u.role === 'instructor' ? <BadgeCheck size={12} /> : null}
                                                    {u.role}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="relative group/role">
                                                    <button className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-blue-500 hover:text-white transition-all">
                                                        <UserCog size={18} />
                                                    </button>
                                                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover/role:block bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl p-2 z-50 w-32">
                                                        <button onClick={() => handleRoleUpdate(u._id, 'student')} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Make Student</button>
                                                        <button onClick={() => handleRoleUpdate(u._id, 'instructor')} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Make Instructor</button>
                                                        <button onClick={() => handleRoleUpdate(u._id, 'admin')} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Make Admin</button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    disabled={u._id === currentUser?._id}
                                                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
