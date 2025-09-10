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
    <div className="flex min-h-screen bg-[#0d1b2a] text-gray-200">

      {/* Desktop sidebar */}
      <div className="sm:fixed sm:top-0 sm:left-0 sm:bottom-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div
        className="flex-1 overflow-y-auto  sm:p-8 pb-20 sm:pb-8 transition-all duration-300"
        style={{
          marginLeft: isDesktop ? (collapsed ? '5rem' : '16rem') : '0',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
