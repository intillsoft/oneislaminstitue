import React from 'react';
import Image from '../AppImage';
import { getCompanyInitials, getCompanyTheme } from '../../utils/companyAvatarHelper';

const CompanyAvatar = ({ name, logo, size = '12', className = '' }) => {
    const theme = getCompanyTheme(name);
    const initials = getCompanyInitials(name);

    // Convert size tailwind class (e.g. '12') to actual dimensions if needed, 
    // but we can just use the class directly in the container.

    if (logo) {
        return (
            <div className={`w-${size} h-${size} rounded-xl overflow-hidden border border-white/10 ${className}`}>
                <Image
                    src={logo}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div
            className={`w-${size} h-${size} rounded-xl flex items-center justify-center border font-bold transition-all hover:scale-105 ${className}`}
            style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text,
                fontSize: size > 16 ? '1.5rem' : '1rem'
            }}
        >
            <span className="tracking-tighter">
                {initials}
            </span>
        </div>
    );
};

export default CompanyAvatar;
