/**
 * Elite Card Component - Bold Blue + White Theme
 * Clean white cards with blue accents for the Hope Dawah Institute platform
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
                bg-white
                border border-[#E2E8F0]
                rounded-2xl 
                p-4 sm:p-5
                transition-all
                duration-300
                ${onClick ? 'cursor-pointer hover:border-[#0078D4]/40 active:scale-[0.98]' : ''}
                ${className}
            `}
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
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
        blue:  { icon: '#0078D4', bg: '#EFF6FF', border: '#C8E0F4' },
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
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.15em] mb-2">
                        {displayLabel}
                    </p>
                    <p className="text-2xl font-extrabold text-[#0F172A] tracking-tighter">
                        {value}
                    </p>
                    {trend && (
                        <p className={`text-[11px] font-bold mt-2 flex items-center gap-1 uppercase tracking-wider ${
                            trendIsPositive ? 'text-[#107C10]' :
                            trendIsNegative ? 'text-[#D13438]' :
                            'text-[#94A3B8]'
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
        blue: 'bg-[#0078D4]',
        green: 'bg-[#107C10]',
        amber: 'bg-[#C05400]',
        red: 'bg-[#D13438]',
        gradient: 'bg-gradient-to-r from-[#0078D4] to-[#4BA8E8]'
    };

    const bgColor = colorClasses[color] || colorClasses.blue;

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                    {label}
                </span>
                {showPercentage && (
                    <span className="text-[10px] font-bold text-[#0078D4]">
                        {percentage}%
                    </span>
                )}
            </div>
            <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
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
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                        style={{ background: '#EFF6FF', color: '#0078D4', border: '1px solid #C8E0F4' }}
                    >
                        {badge}
                    </span>
                )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] mb-2 tracking-tight">
                {mainTitle}
            </h1>
            {subTitle && (
                <p className="text-[#475569] text-lg font-medium">
                    {subTitle}
                </p>
            )}
            {children}
        </div>
    );
};

export default EliteCard;
