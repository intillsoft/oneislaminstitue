import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';
import { ElitePageHeader, EliteCard } from '../../components/ui/EliteCard';

const AchievementsPage = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ coin_balance: 0, total_xp: 0 });
  const [allBadges, setAllBadges] = useState([]);
  const [userBadgeIds, setUserBadgeIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Load User Stats
      const { data: userData, error: userErr } = await supabase
        .from('users')
        .select('coin_balance, coins, total_xp')
        .eq('id', user.id)
        .single();
        
      if (!userErr && userData) {
        setStats({
          coin_balance: userData.coin_balance || userData.coins || 0,
          total_xp: userData.total_xp || 0
        });
      }

      // 2. Load All Badges
      const { data: badgesData, error: badgesErr } = await supabase
        .from('badges')
        .select('*')
        .order('requirement_value', { ascending: true });
        
      if (!badgesErr && badgesData) {
        setAllBadges(badgesData);
      }

      // 3. Load User Badges
      const { data: userBadgesData, error: userBadgesErr } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);
        
      if (!userBadgesErr && userBadgesData) {
        setUserBadgeIds(new Set(userBadgesData.map(ub => ub.badge_id)));
      }

    } catch (error) {
      console.error('Failed to load achievements data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLevel = (xp) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  };

  const calculateNextLevelXP = (level) => {
    return Math.pow(level, 2) * 100;
  };

  const currentLevel = calculateLevel(stats.total_xp);
  const nextLevelXP = calculateNextLevelXP(currentLevel);
  const prevLevelXP = calculateNextLevelXP(currentLevel - 1);
  const xpProgress = ((stats.total_xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;

  const RarityColor = {
    Common: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    Rare: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Epic: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    Legendary: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
  };

  const filteredBadges = allBadges.filter(badge => {
    if (activeTab === 'unlocked') return userBadgeIds.has(badge.id);
    if (activeTab === 'locked') return !userBadgeIds.has(badge.id);
    return true;
  });

  return (
    <div className="w-full h-full text-text-primary max-w-7xl mx-auto">
      <ElitePageHeader
        title="Scholarly Achievements"
        description="Track your intellectual journey and milestones."
        badge="Dinar & XP"
      />

      {loading ? (
        <div className="p-20 text-center animate-pulse text-slate-500 uppercase tracking-widest text-[10px]">Syncing Knowledge Nodes...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <EliteCard className="p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Icon name="Award" className="text-indigo-400" size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    Scholar Level {currentLevel}
                  </span>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] border-b border-white/5 pb-2 font-black uppercase tracking-widest text-slate-500">Total Scholarly XP</p>
                   <p className="text-4xl font-black text-white">{stats.total_xp.toLocaleString()}</p>
                   
                   <div className="pt-4">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                         <span>Level {currentLevel}</span>
                         <span>{nextLevelXP - stats.total_xp} to Level {currentLevel + 1}</span>
                      </div>
                      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: \`\${Math.min(xpProgress, 100)}%\` }} 
                          className="h-full bg-indigo-500 rounded-full"
                        />
                      </div>
                   </div>
                </div>
             </EliteCard>

             <EliteCard className="p-6 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Icon name="Database" className="text-emerald-400" size={24} />
                  </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Platform Currency
                  </span>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] border-b border-white/5 pb-2 font-black uppercase tracking-widest text-slate-500">Dinar Tokens</p>
                   <p className="text-4xl font-black text-white">{stats.coin_balance.toLocaleString()}</p>
                   <p className="text-[10px] text-slate-400 mt-2">Earned by completing rigorous academic modules.</p>
                </div>
             </EliteCard>

             <EliteCard className="p-6 bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/20 md:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                    <Icon name="Shield" className="text-amber-400" size={24} />
                  </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    Collection
                  </span>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] border-b border-white/5 pb-2 font-black uppercase tracking-widest text-slate-500">Badges Unlocked</p>
                   <p className="text-4xl font-black text-white">
                      {userBadgeIds.size} <span className="text-lg text-slate-500">/ {allBadges.length}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 mt-2">Testaments to your dedication and mastery.</p>
                </div>
             </EliteCard>
          </div>

          {/* Badges Inventory Section */}
          <div className="mt-12">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white uppercase tracking-widest">Badge Archive</h3>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                   {['all', 'unlocked', 'locked'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={\`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all \${activeTab === tab ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}\`}
                      >
                        {tab}
                      </button>
                   ))}
                </div>
             </div>

             {filteredBadges.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                   <p className="text-sm font-black text-slate-500 uppercase tracking-widest">No badges found in this category.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   <AnimatePresence mode="popLayout">
                      {filteredBadges.map(badge => {
                         const isUnlocked = userBadgeIds.has(badge.id);
                         const rarityStyle = RarityColor[badge.rarity] || RarityColor.Common;

                         return (
                            <motion.div 
                               layout
                               initial={{ opacity: 0, scale: 0.9 }}
                               animate={{ opacity: 1, scale: 1 }}
                               exit={{ opacity: 0, scale: 0.9 }}
                               key={badge.id} 
                               className={\`p-6 rounded-3xl border transition-all duration-300 \${isUnlocked ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]' : 'bg-black/20 border-transparent grayscale opacity-60'}\`}
                            >
                               <div className="flex items-start justify-between mb-6">
                                  <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg \${isUnlocked ? rarityStyle : 'bg-white/5 border-white/10 text-slate-600'}\`}>
                                     {badge.icon_url ? (
                                        <img src={badge.icon_url} alt={badge.name} className="w-8 h-8 object-contain" />
                                     ) : (
                                        <Icon name={isUnlocked ? 'Award' : 'Lock'} size={24} />
                                     )}
                                  </div>
                                  <span className={\`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border \${isUnlocked ? rarityStyle : 'bg-white/5 border-white/10 text-slate-500'}\`}>
                                     {badge.rarity}
                                  </span>
                               </div>

                               <h4 className={\`text-sm font-black uppercase tracking-widest mb-2 \${isUnlocked ? 'text-white' : 'text-slate-500'}\`}>{badge.name}</h4>
                               <p className="text-xs text-slate-400 leading-relaxed font-medium mb-4 min-h-[40px]">{badge.description}</p>
                               
                               <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                                  <Icon name={badge.requirement_type === 'courses_completed' ? 'BookOpen' : 'Zap'} size={12} className="text-slate-600" />
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                     Requires {badge.requirement_value} {badge.requirement_type.replace('_', ' ')}
                                  </span>
                               </div>
                            </motion.div>
                         );
                      })}
                   </AnimatePresence>
                </div>
             )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
