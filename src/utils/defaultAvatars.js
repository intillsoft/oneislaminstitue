export const defaultAvatars = [
  { id: 'avatar-1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop', name: 'Professional 1' },
  { id: 'avatar-2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', name: 'Professional 2' },
  { id: 'avatar-3', url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop', name: 'Professional 3' },
  { id: 'avatar-4', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', name: 'Professional 4' },
  { id: 'avatar-5', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', name: 'Professional 5' },
  { id: 'avatar-6', url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop', name: 'Professional 6' },
  { id: 'avatar-7', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop', name: 'Professional 7' },
  { id: 'avatar-8', url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop', name: 'Professional 8' },
  { id: 'avatar-9', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', name: 'Professional 9' },
  { id: 'avatar-10', url: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=400&h=400&fit=crop', name: 'Professional 10' },
  { id: 'avatar-11', url: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=400&h=400&fit=crop', name: 'Professional 11' },
  { id: 'avatar-12', url: 'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?w=400&h=400&fit=crop', name: 'Professional 12' },
  { id: 'avatar-13', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', name: 'Professional 13' },
  { id: 'avatar-14', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', name: 'Professional 14' },
  { id: 'avatar-15', url: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=400&h=400&fit=crop', name: 'Professional 15' },
  { id: 'avatar-16', url: 'https://images.unsplash.com/photo-1522075469751-3a3694c60e9e?w=400&h=400&fit=crop', name: 'Professional 16' },
  { id: 'avatar-17', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', name: 'Professional 17' },
  { id: 'avatar-18', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', name: 'Professional 18' },
  { id: 'avatar-19', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop', name: 'Professional 19' },
  { id: 'avatar-20', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', name: 'Professional 20' }
];

export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex].url;
};

export const getAvatarUrl = (user, profile) => {
  if (profile?.avatar_url) return profile.avatar_url;
  if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
  return getRandomAvatar(); // Fallback to random if nothing fails
};
