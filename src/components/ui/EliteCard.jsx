/**
 * Elite Card Component - Premium Dashboard UI Pattern
 * Matches the design aesthetic from the Elite Dashboard Metamorphosis
 */

import React from 'react';
import { motion } from 'framer-motion';

export const EliteCard = ({
    children,
    className = '',
    hover = true,
    onClick = null,
    ...props
}) => {
    return (
        <motion.div
            onClick={onClick}
            className={`
                bg-white/[0.02] 
                dark:bg-emerald-500/[0.02]
                border border-emerald-500/20 
                dark:border-emerald-500/10
                rounded-2xl 
                p-4 sm:p-5
                transition-all
                duration-300
                ${onClick ? 'cursor-pointer hover:border-emerald-500/40 active:scale-[0.98]' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const EliteStatCard = ({
    icon: Icon,
    label,
    value,
    trend = null,
    trendDirection = 'up', // 'up', 'down', 'neutral'
    color = 'blue', // 'blue', 'green', 'amber', 'red'
    className = '',
    ...props
}) => {
    const colorClasses = {
        blue: {
            bg: 'bg-workflow-primary/10 dark:bg-workflow-primary/20',
            icon: 'text-workflow-primary',
            text: 'text-workflow-primary dark:text-workflow-primary/80'
        },
        green: {
            bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
            icon: 'text-emerald-500',
            text: 'text-emerald-500 dark:text-emerald-400'
        },
        amber: {
            bg: 'bg-amber-500/10 dark:bg-amber-500/20',
            icon: 'text-amber-500',
            text: 'text-amber-500 dark:text-amber-400'
        },
        red: {
            bg: 'bg-red-500/10 dark:bg-red-500/20',
            icon: 'text-red-500',
            text: 'text-red-500 dark:text-red-400'
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;
    const displayLabel = label || props.title;
    const trendValue = typeof trend === 'object' ? trend?.value : trend;
    const trendIsPositive = typeof trend === 'object' ? trend?.isPositive === true : trendDirection === 'up';
    const trendIsNegative = typeof trend === 'object' ? trend?.isPositive === false : trendDirection === 'down';

    return (
        <EliteCard className={`${className} border-emerald-500/20 hover:border-emerald-500/40`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2 font-mono">
                        {displayLabel}
                    </p>
                    <p className="text-2xl font-black text-white tracking-tighter">
                        {value}
                    </p>
                    {trend && (
                        <p className={`text-[11px] font-black mt-2 flex items-center gap-1 uppercase tracking-wider ${trendIsPositive ? 'text-emerald-500' :
                                trendIsNegative ? 'text-rose-500' :
                                    'text-slate-500'
                            } `}>
                            {trendIsPositive && <Icon name="TrendingUp" size={12} />}
                            {trendIsNegative && <Icon name="TrendingDown" size={12} />}
                            {trendValue}
                        </p>
                    )}
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-emerald-500/40`}>
                    <Icon className={`${colors.icon}`} size={typeof window !== 'undefined' && window.innerWidth < 640 ? 18 : 20} />
                </div>
            </div>
        </EliteCard>
    );
};

export const EliteProgressBar = ({
    label,
    value,
    max = 100,
    color = 'blue',
    showPercentage = true,
    className = ''
}) => {
    const percentage = Math.round((value / max) * 100);

    const colorClasses = {
        blue: 'bg-workflow-primary',
        green: 'bg-emerald-500',
        amber: 'bg-amber-500',
        red: 'bg-red-500',
        gradient: 'bg-gradient-to-r from-workflow-primary via-workflow-accent to-workflow-accent'
    };

    const bgColor = colorClasses[color] || colorClasses.blue;

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {label}
                </span>
                {showPercentage && (
                    <span className="text-[10px] font-black text-emerald-500 mb-0.5">
                        {percentage}%
                    </span>
                )}
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-emerald-500/20">
                <motion.div
                    className={`h-full ${bgColor} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
};

export const ElitePageHeader = ({
    greeting,
    title,
    subtitle,
    description,
    badge = null,
    children
}) => {
    const mainTitle = greeting || title;
    const subTitle = subtitle || description;
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                {badge && (
                    <span className="px-3 py-1 rounded-full bg-workflow-primary/10 border border-workflow-primary/20 text-xs font-black uppercase tracking-wider text-workflow-primary">
                        {badge}
                    </span>
                )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-2 tracking-tight">
                {mainTitle}
            </h1>
            {subTitle && (
                <p className="text-text-secondary text-lg font-medium">
                    {subTitle}
                </p>
            )}
            {children}
        </div>
    );
};

export default EliteCard;
