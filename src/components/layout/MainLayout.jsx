import React, { useState } from 'react';
import UnifiedSidebar from '../ui/UnifiedSidebar';

const MainLayout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0A0E27] overflow-hidden font-sans text-slate-900 dark:text-slate-100">
            <UnifiedSidebar
                isCollapsed={isSidebarCollapsed}
                onCollapseChange={setIsSidebarCollapsed}
            />

            <main
                className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out relative ${isSidebarCollapsed ? 'lg:ml-[64px]' : 'lg:ml-[260px]'
                    }`}
            >
                {/* Fixed Header Height Spacer - using padding on content instead of main to allow full bg colors if needed */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-thin pt-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
