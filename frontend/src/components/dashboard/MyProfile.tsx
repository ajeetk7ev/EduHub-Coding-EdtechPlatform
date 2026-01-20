import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Mail, Phone, Calendar, User as UserIcon, Briefcase } from "lucide-react";
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from "react-router-dom";
import StatsOverview from "./StatsOverview";
import { motion } from "framer-motion";

// formattedDate utility
const formattedDate = (date: any) => {
  if (!date) return 'Not Provided';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function MyProfile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-8 min-h-screen transition-all duration-300 w-full animate-in fade-in duration-700">
      <div className="space-y-8 w-full max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              My <span className="text-blue-500">Profile</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
              Manage your personal information and see your progress
            </p>
          </div>
          <Button
            onClick={() => navigate('/dashboard/settings')}
            className="w-fit h-12 px-6 rounded-2xl bg-white text-[#050816] font-black hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Basic Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 rounded-[2.5rem] border-4 border-white/10 shadow-2xl mb-6">
                <AvatarImage src={user?.image || `https://ui-avatars.com/api/?name=${user?.firstname}+${user?.lastname}&background=random`} />
                <AvatarFallback className="bg-blue-600 text-3xl font-black">
                  {user?.firstname?.[0]}{user?.lastname?.[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-black text-white">{user?.firstname} {user?.lastname}</h2>
              <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-1">{user?.role}</p>

              <div className="w-full h-px bg-white/5 my-8" />

              <div className="w-full space-y-4">
                <div className="flex items-center gap-4 text-gray-400 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{user?.contactNo || 'No phone added'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - About & Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* About Card */}
            <div className="glass p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                About Me
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed italic">
                {user?.about || "This user hasn't written an about section yet. A few words here can help others know you better!"}
              </p>
            </div>

            {/* Personal Details */}
            <div className="glass p-10 rounded-[2.5rem] border-white/5">
              <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                Personal Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  { label: "First Name", value: user?.firstname, icon: <UserIcon /> },
                  { label: "Last Name", value: user?.lastname, icon: <UserIcon /> },
                  { label: "Gender", value: user?.gender || "Not Specified", icon: <UserIcon /> },
                  { label: "Date of Birth", value: formattedDate(user?.dob), icon: <Calendar /> },
                  { label: "Email", value: user?.email, icon: <Mail /> },
                  { label: "Role", value: user?.role, icon: <Briefcase /> }
                ].map((detail, i) => (
                  <div key={i} className="group">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">{detail.label}</p>
                    <div className="w-full px-5 py-3.5 bg-white/2 border border-white/5 rounded-2xl text-gray-200 font-bold group-hover:bg-white/5 transition-colors">
                      {detail.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
