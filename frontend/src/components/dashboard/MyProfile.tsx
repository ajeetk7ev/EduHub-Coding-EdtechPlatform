import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useAuthStore } from '@/store/authStore';
import { useDashboardCollapsedStore } from "@/store/dashboardCollapsedStore";
import { useNavigate } from "react-router-dom";

// formattedDate utility
const formattedDate = (date: any) => {
  if (!date) return 'Add Date Of Birth';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function MyProfile() {
  const { user } = useAuthStore();
  const { collapsed } = useDashboardCollapsedStore();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 min-h-screen transition-all duration-300 w-full">
      <div className={`space-y-8 w-full ${collapsed ? 'max-w-6xl' : 'max-w-4xl'}`}>

        {/* Welcome Board */}
        <div className="rounded-xl p-6 sm:p-8 shadow-lg bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, {user?.firstname}!</h2>
          <p className="text-sm sm:text-base font-medium text-gray-200">Manage your profile details and settings here.</p>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 p-4 sm:p-6 md:p-8 gap-4 md:gap-6 w-full">

          {/* Avatar & Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.image || "https://github.com/shadcn.png"} alt={`${user?.firstname} ${user?.lastname}`} />
              <AvatarFallback>{`${user?.firstname?.[0]}${user?.lastname?.[0]}`}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <p className="text-lg sm:text-xl font-semibold text-gray-100">{`${user?.firstname} ${user?.lastname}`}</p>
              <p className="text-sm sm:text-base text-gray-400 break-words">{user?.email}</p>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            className="mt-4 md:mt-0 rounded-full border-purple-500 text-purple-400 hover:bg-purple-700 hover:text-white transition-all self-center md:self-auto"
            onClick={() => navigate('/dashboard/settings')}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        </div>


        {/* About Card */}
        <div className="my-6 sm:my-10 flex flex-col gap-6 sm:gap-10 rounded-md border border-zinc-700 bg-zinc-800 p-6 sm:p-8">
          <div className="flex flex-row items-center  justify-between ">
            <p className="text-lg font-semibold text-gray-100">About</p>
            <Button
              variant="outline"
              className="rounded-full border-purple-500 text-purple-400 hover:bg-purple-700 hover:text-white transition-all self-start sm:self-auto"
              onClick={() => navigate('/dashboard/settings')}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>
          <p className={`text-sm sm:text-base font-medium ${user?.about ? 'text-gray-100' : 'text-gray-400'}`}>
            {user?.about || 'Write Something About Yourself'}
          </p>
        </div>

        {/* Personal Details Card */}
        <div className="my-6 sm:my-10 flex flex-col gap-6 sm:gap-10 rounded-md border border-zinc-700 bg-zinc-800 p-6 sm:p-8">
          <div className="flex fflex-row items-center justify-between ">
            <p className="text-lg font-semibold text-gray-100">Personal Details</p>
            <Button
              variant="outline"
              className="rounded-full border-purple-500 text-purple-400 hover:bg-purple-700 hover:text-white transition-all self-start sm:self-auto"
              onClick={() => navigate('/dashboard/settings')}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-6 sm:gap-x-12">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">First Name</p>
              <p className="text-sm sm:text-base font-medium text-gray-100">{user?.firstname}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Last Name</p>
              <p className="text-sm sm:text-base font-medium text-gray-100">{user?.lastname}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-sm sm:text-base font-medium text-gray-100">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Phone Number</p>
              <p className="text-sm sm:text-base font-medium text-gray-100">{user?.contactNo || 'Add Contact Number'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Gender</p>
              <p className="text-sm sm:text-base font-medium text-gray-100">{user?.gender || 'Add Gender'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Date Of Birth</p>
              <p className="text-sm sm:text-base font-medium text-gray-100">{formattedDate(user?.dob)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
