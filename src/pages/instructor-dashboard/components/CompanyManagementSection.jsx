import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { EliteCard } from '../../../components/ui/EliteCard';
import { supabase } from '../../../lib/supabase';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const CompanyManagementSection = () => {
    const { user, profile } = useAuthContext();
    const { success, error: showError } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [companyData, setCompanyData] = useState({
        name: '',
        description: '',
        website: '',
        industry: '',
        size: '',
        location: '',
        logo_url: '',
        cover_url: '',
        verified: false
    });

    useEffect(() => {
        if (user && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
            loadCompanyData();
        } else if (user && profile) {
            setLoading(false);
        }
    }, [user, profile]);

    const loadCompanyData = async () => {
        try {
            setLoading(true);
            // In a real app, we would fetch from a 'companies' table
            // For now, we'll simulate or fetch from a JSON field in profile if available
            const { data, error } = await supabase
                .from('recruiters') // Assuming a recruiters table linking user to company
                .select('*, companies(*)')
                .eq('user_id', user.id)
                .single();

            if (data?.companies) {
                setCompanyData(data.companies);
            } else {
                // Fallback for demo
                setCompanyData({
                    name: profile?.company_name || 'One Islam Academy',
                    description: 'Innovative academic modules for the modern scholar.',
                    website: 'https://oneislam.institute',
                    industry: 'Islamic Studies',
                    size: '11-50 Curator Team Members',
                    location: 'Sydney, Australia',
                    verified: true
                });
            }
        } catch (error) {
            console.error('Error loading company data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Simulate save
            await new Promise(resolve => setTimeout(resolve, 1500));
            success('Academy profile updated successfully');
        } catch (error) {
            showError('Failed to update academy profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <EliteCard className="p-8 border-white/5 bg-white/[0.02] animate-pulse">
                    <div className="h-8 bg-white/5 rounded w-1/4 mb-4" />
                    <div className="h-32 bg-white/5 rounded w-full" />
                </EliteCard>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Branding Section */}
            <EliteCard className="overflow-hidden border-white/5 bg-white/[0.02]">
                <div className="relative h-48 bg-workflow-primary/20">
                    {companyData.cover_url ? (
                        <img src={companyData.cover_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center border-b border-white/5">
                            <Icon name="Image" size={48} className="text-white/10" />
                        </div>
                    )}
                    <button className="absolute bottom-4 right-8 px-4 py-2 bg-black/40 backdrop-blur-md text-white rounded-xl hover:bg-black/60 transition-all font-black uppercase tracking-widest text-[9px] border border-white/10 flex items-center gap-2">
                        <Icon name="Camera" size={12} />
                        Update Cover
                    </button>
                </div>

                <div className="px-8 pb-8 flex flex-col sm:flex-row items-end gap-6 -mt-12">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-bg border-4 border-bg-elevated overflow-hidden flex items-center justify-center shadow-2xl">
                            {companyData.logo_url ? (
                                <img src={companyData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <Icon name="Briefcase" size={32} className="text-workflow-primary" />
                            )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-workflow-primary text-white rounded-lg shadow-xl hover:bg-workflow-primary/80 transition-all">
                            <Icon name="Plus" size={14} />
                        </button>
                    </div>

                    <div className="flex-1 mb-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{companyData.name}</h3>
                            {companyData.verified && (
                                <span className="p-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                    <Icon name="Check" size={12} className="text-emerald-500" />
                                </span>
                            )}
                        </div>
                        <p className="text-text-muted font-medium text-sm">{companyData.industry} • {companyData.location}</p>
                    </div>
                </div>
            </EliteCard>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EliteCard className="p-8 border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-workflow-primary/10 flex items-center justify-center border border-workflow-primary/20">
                            <Icon name="Info" className="w-5 h-5 text-workflow-primary" />
                        </div>
                        <div>
                            <h4 className="text-md font-black text-white uppercase tracking-tight">Academy Intel</h4>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Core Academic Identity</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Academy Name</label>
                            <input
                                type="text"
                                value={companyData.name}
                                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Academic Field</label>
                                <input
                                    type="text"
                                    value={companyData.industry}
                                    onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Curator Team Size</label>
                                <input
                                    type="text"
                                    value={companyData.size}
                                    onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Public Website</label>
                            <div className="relative">
                                <Icon name="Link" size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={companyData.website}
                                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 pl-10 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </EliteCard>

                <EliteCard className="p-8 border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-workflow-accent/10 flex items-center justify-center border border-workflow-accent/20">
                            <Icon name="AlignLeft" className="w-5 h-5 text-workflow-accent" />
                        </div>
                        <div>
                            <h4 className="text-md font-black text-white uppercase tracking-tight">Academic Mission</h4>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Educational Philosophy</p>
                        </div>
                    </div>

                    <div className="space-y-6 h-full flex flex-col">
                        <div className="flex-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Description</label>
                            <textarea
                                value={companyData.description}
                                onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                                rows={8}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-medium text-text-secondary dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-workflow-primary/40 transition-all resize-none"
                            />
                        </div>

                        <div className="pt-4 mt-auto">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full py-4 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-workflow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Icon name="RefreshCw" size={18} className="animate-spin" />
                                        Syncing Data...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="ShieldCheck" size={18} />
                                        Finalize Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </EliteCard>
            </div>
        </div>
    );
};

export default CompanyManagementSection;
