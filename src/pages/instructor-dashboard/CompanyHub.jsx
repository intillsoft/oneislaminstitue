import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import CompanyManagementSection from './components/CompanyManagementSection';
import { ElitePageHeader } from '../../components/ui/EliteCard';

const CompanyHub = () => {
    return (
        <div className="p-8 space-y-8">
            <ElitePageHeader
                title="Company Excellence Hub"
                subtitle="Manage your corporate identity and brand governance."
                icon="Building2"
            />

            <CompanyManagementSection />
        </div>
    );
};

export default CompanyHub;
