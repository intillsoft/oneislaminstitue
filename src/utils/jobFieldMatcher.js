/**
 * Utility functions for matching jobs to user fields and preferences
 */

export const detectUserField = (user) => {
    if (!user) return 'General';

    const title = user.profile?.title || '';
    const skills = user.profile?.skills || [];

    if (title.toLowerCase().includes('developer') || title.toLowerCase().includes('engineer')) return 'Engineering';
    if (title.toLowerCase().includes('designer') || title.toLowerCase().includes('creative')) return 'Design';
    if (title.toLowerCase().includes('manager') || title.toLowerCase().includes('director')) return 'Management';
    if (title.toLowerCase().includes('writer') || title.toLowerCase().includes('editor')) return 'Writing';
    if (title.toLowerCase().includes('marketer') || title.toLowerCase().includes('marketing')) return 'Marketing';

    return 'General';
};

export const isJobInField = (job, field) => {
    if (!field || field === 'General') return true;
    // Simple rudimentary check
    return job.category === field || job.title?.includes(field);
};

export const matchesJobTitle = (jobTitle, userTitle) => {
    if (!jobTitle || !userTitle) return false;
    return jobTitle.toLowerCase().includes(userTitle.toLowerCase());
};

export const shouldExcludeJob = (job, user) => {
    // Add logic to exclude jobs based on user constraints
    return false;
};

export default {
    detectUserField,
    isJobInField,
    matchesJobTitle,
    shouldExcludeJob
};
