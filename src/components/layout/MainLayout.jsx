import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import UnifiedSidebar from '../ui/UnifiedSidebar';
import AILoader from '../ui/AILoader';

const MainLayout = ({ children }) => {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white transition-colors duration-500">
            <div className="flex flex-1 relative min-h-screen">
                <UnifiedSidebar />

                <main
                    className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'sm:ml-16' : 'sm:ml-[260px]'
                        }`}
                >
                    <div className="flex-1 w-full pt-[var(--header-height)] pb-[var(--bottom-nav-height)] md:pb-0">
                        <div className="mx-auto w-full px-3 sm:px-6 lg:px-10 py-4 sm:py-10 max-w-[1800px]">
                            <Suspense fallback={
                                <div className="flex flex-col items-center justify-center py-32">
                                    <AILoader variant="neural" text="Syncing Sector..." />
                                </div>
                            }>
                                {children || <Outlet />}
                            </Suspense>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
