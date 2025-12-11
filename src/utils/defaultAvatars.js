/**
 * Default Avatar Options
 * Provides 10+ default avatar options for users who haven't uploaded their own
 */

export const defaultAvatars = [
  {
    id: 'avatar-1',
    url: 'https://ui-avatars.com/api/?name=User&background=0046FF&color=fff&size=128&bold=true',
    name: 'Blue Professional'
  },
  {
    id: 'avatar-2',
    url: 'https://ui-avatars.com/api/?name=User&background=059669&color=fff&size=128&bold=true',
    name: 'Green Professional'
  },
  {
    id: 'avatar-3',
    url: 'https://ui-avatars.com/api/?name=User&background=DC2626&color=fff&size=128&bold=true',
    name: 'Red Professional'
  },
  {
    id: 'avatar-4',
    url: 'https://ui-avatars.com/api/?name=User&background=7C3AED&color=fff&size=128&bold=true',
    name: 'Purple Professional'
  },
  {
    id: 'avatar-5',
    url: 'https://ui-avatars.com/api/?name=User&background=EA580C&color=fff&size=128&bold=true',
    name: 'Orange Professional'
  },
  {
    id: 'avatar-6',
    url: 'https://ui-avatars.com/api/?name=User&background=0891B2&color=fff&size=128&bold=true',
    name: 'Cyan Professional'
  },
  {
    id: 'avatar-7',
    url: 'https://ui-avatars.com/api/?name=User&background=BE185D&color=fff&size=128&bold=true',
    name: 'Pink Professional'
  },
  {
    id: 'avatar-8',
    url: 'https://ui-avatars.com/api/?name=User&background=92400E&color=fff&size=128&bold=true',
    name: 'Brown Professional'
  },
  {
    id: 'avatar-9',
    url: 'https://ui-avatars.com/api/?name=User&background=1E40AF&color=fff&size=128&bold=true',
    name: 'Navy Professional'
  },
  {
    id: 'avatar-10',
    url: 'https://ui-avatars.com/api/?name=User&background=065F46&color=fff&size=128&bold=true',
    name: 'Teal Professional'
  },
  {
    id: 'avatar-11',
    url: 'https://ui-avatars.com/api/?name=User&background=991B1B&color=fff&size=128&bold=true',
    name: 'Dark Red Professional'
  },
  {
    id: 'avatar-12',
    url: 'https://ui-avatars.com/api/?name=User&background=581C87&color=fff&size=128&bold=true',
    name: 'Dark Purple Professional'
  }
];

/**
 * Get default avatar for a user based on their name/email
 */
export function getDefaultAvatar(name, email) {
  const userName = name || email?.split('@')[0] || 'User';
  const index = userName.charCodeAt(0) % defaultAvatars.length;
  return defaultAvatars[index].url;
}

/**
 * Get avatar URL - returns user's avatar or default
 */
export function getAvatarUrl(user, profile) {
  if (profile?.avatar_url) return profile.avatar_url;
  if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
  
  const name = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  return getDefaultAvatar(name, user?.email);
}

export default {
  defaultAvatars,
  getDefaultAvatar,
  getAvatarUrl
};









