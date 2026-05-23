/**
 * Elite Card Component - Premium Theme-Aware
 * Dynamic cards that adapt to light/dark mode via CSS variables
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
                bg-[var(--card)]
                border border-[var(--border)]
                rounded-2xl 
                p-4 sm:p-5
                transition-all
                duration-300
                ${onClick ? 'cursor-pointer hover:border-[var(--primary)]/40 active:scale-[0.98]' : ''}
                ${className}
            `}
            style={{ boxShadow: 'var(--shadow-card)' }}
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
    trendDirection = 'up',
    color = 'blue',
    className = '',
    ...props
}) => {
    const colorMap = {
        blue:  { icon: 'var(--primary)', bg: 'var(--secondary)', border: 'var(--border)' },
        green: { icon: '#107C10', bg: '#E6F4E6', border: '#B8E6B8' },
        amber: { icon: '#C05400', bg: '#FFF4CE', border: '#FFE0A0' },
        red:   { icon: '#D13438', bg: '#FDE7E9', border: '#F5C0C2' },
    };

    const colors = colorMap[color] || colorMap.blue;
    const displayLabel = label || props.title;
    const trendValue = typeof trend === 'object' ? trend?.value : trend;
    const trendIsPositive = typeof trend === 'object' ? trend?.isPositive === true : trendDirection === 'up';
    const trendIsNegative = typeof trend === 'object' ? trend?.isPositive === false : trendDirection === 'down';

    return (
        <EliteCard className={className}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-[0.15em] mb-2">
                        {displayLabel}
                    </p>
                    <p className="text-2xl font-extrabold text-[var(--foreground)] tracking-tighter">
                        {value}
                    </p>
                    {trend && (
                        <p className={`text-[11px] font-bold mt-2 flex items-center gap-1 uppercase tracking-wider ${
                            trendIsPositive ? 'text-[#107C10]' :
                            trendIsNegative ? 'text-[#D13438]' :
                            'text-[var(--muted-foreground)]'
                        }`}>
                            {trendValue}
                        </p>
                    )}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
                >
                    <Icon style={{ color: colors.icon }} size={typeof window !== 'undefined' && window.innerWidth < 640 ? 18 : 20} />
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
        blue: 'bg-[var(--primary)]',
        green: 'bg-[#107C10]',
        amber: 'bg-[#C05400]',
        red: 'bg-[#D13438]',
        gradient: 'bg-gradient-to-r from-[var(--primary)] to-[var(--ring)]'
    };

    const bgColor = colorClasses[color] || colorClasses.blue;

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                    {label}
                </span>
                {showPercentage && (
                    <span className="text-[10px] font-bold text-[var(--primary)]">
                        {percentage}%
                    </span>
                )}
            </div>
            <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden border border-[var(--border)]">
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
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--secondary)] text-[var(--primary)] border border-[var(--border)]">
                        {badge}
                    </span>
                )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--foreground)] mb-2 tracking-tight">
                {mainTitle}
            </h1>
            {subTitle && (
                <p className="text-[var(--muted-foreground)] text-lg font-medium">
                    {subTitle}
                </p>
            )}
            {children}
        </div>
    );
};

export default EliteCard;
