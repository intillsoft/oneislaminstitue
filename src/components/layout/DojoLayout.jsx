import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * DojoLayout - A standardized 2-column layout for career tools.
 * Enforces 'fit viewport' and internal scrolling.
 * 
 * @param {Object} props
 * @param {string} props.title - The main title in the header.
 * @param {string} props.subtitle - The subtitle in the header.
 * @param {React.ReactNode} props.headerActions - Optional buttons/badges for the right side of header.
 * @param {React.ReactNode} props.sidebarContent - Content for the 4-column sidebar.
 * @param {React.ReactNode} props.mainContent - Content for the 8-column main area.
 * @param {string} props.backPath - Path for the back button.
 */
const DojoLayout = ({
    title,
    subtitle,
    headerActions,
    sidebarContent,
    mainContent,
    children,
    backPath = '/career-training'
}) => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col bg-bg overflow-hidden font-sans relative text-text-primary">
            {/* Minimal Header */}
            <header className="flex-none px-4 py-2 bg-surface/95 backdrop-blur-xl border-b border-border z-20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(backPath)}
                        className="p-1.5 hover:bg-surface-elevated rounded-lg transition-colors text-text-muted hover:text-text-primary"
                        aria-label="Back"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">{title}</h1>
                        {subtitle && <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest hidden sm:inline">• {subtitle}</span>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {headerActions}
                </div>
            </header>

            {/* Main Layout Area */}
            <div className="flex-1 overflow-hidden relative">
                {children ? children : (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                        {/* Left Panel: Sidebar (4 cols) */}
                        <aside className="lg:col-span-4 bg-surface/50 border-r border-border flex flex-col overflow-y-auto custom-scrollbar">
                            <div className="p-6 space-y-6">
                                {sidebarContent}
                            </div>
                        </aside>

                        {/* Right Panel: Main Content (8 cols) */}
                        <main className="lg:col-span-8 flex flex-col bg-bg relative overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-text-muted/10 scrollbar-track-transparent custom-scrollbar">
                                <div className="max-w-5xl mx-auto h-full">
                                    {mainContent}
                                </div>
                            </div>
                        </main>
                    </div>
                )}
            </div>

            {/* Global background effects to match 'Salary Dojo' vibe */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>
    );
};

export default DojoLayout;
