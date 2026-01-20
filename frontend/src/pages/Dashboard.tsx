import Sidebar from '@/components/dashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import { useDashboardCollapsedStore } from '@/store/dashboardCollapsedStore';
import { useEffect, useState } from 'react';

function Dashboard() {
  const { collapsed } = useDashboardCollapsedStore();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);

  // Update isDesktop on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050816] text-gray-200 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />

      {/* Desktop sidebar */}
      <div className="sm:fixed sm:top-0 sm:left-0 sm:bottom-0 z-50">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div
        className="flex-1 overflow-y-auto sm:p-10 pb-24 sm:pb-10 transition-all duration-300 relative z-10"
        style={{
          marginLeft: isDesktop ? (collapsed ? '5rem' : '16rem') : '0',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
