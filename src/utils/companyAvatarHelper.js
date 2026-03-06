/**
 * Company Avatar Helper
 * Generates professional, themed initials-based avatars for companies
 */

const APP_THEME_COLORS = [
    { bg: 'rgba(0, 70, 255, 0.1)', border: 'rgba(0, 70, 255, 0.3)', text: '#0046FF' }, // Primary
    { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#F59E0B' }, // Amber/Accent
    { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#10B981' }, // Emerald
    { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.3)', text: '#6366F1' }, // Indigo
    { bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.3)', text: '#F43F5E' }, // Rose
    { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', text: '#8B5CF6' }, // Violet
    { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)', text: '#06B6D4' }, // Cyan
];

/**
 * Get initials from company name
 */
export const getCompanyInitials = (name) => {
    if (!name) return 'CO';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Get a consistent theme color based on name hashing
 */
export const getCompanyTheme = (name) => {
    if (!name) return APP_THEME_COLORS[0];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % APP_THEME_COLORS.length;
    return APP_THEME_COLORS[index];
};

/**
 * Generate UI Avatar URL as a fallback if needed, 
 * but our local component is preferred for better styling.
 */
export const getUIAvatarUrl = (name, color = '0046FF') => {
    const initials = getCompanyInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=020617&color=${color.replace('#', '')}&size=128&bold=true`;
};
