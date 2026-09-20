export function getUserDisplayName(
  user?: { firstName?: string; nickname?: string | null; useNickname?: boolean } | null
): string {
  if (!user) return 'Usuario';
  if (user.useNickname && user.nickname && user.nickname.trim() !== '') {
    return user.nickname.trim();
  }
  return user.firstName || 'Usuario';
}

export function getUserFullName(
  user?: { firstName?: string; lastName?: string; nickname?: string | null; useNickname?: boolean } | null
): string {
  if (!user) return 'Usuario';
  if (user.useNickname && user.nickname && user.nickname.trim() !== '') {
    return user.nickname.trim();
  }
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario';
}

export function getUserInitials(
  user?: { firstName?: string; lastName?: string; nickname?: string | null; useNickname?: boolean } | null
): string {
  if (!user) return 'U';
  if (user.useNickname && user.nickname && user.nickname.trim() !== '') {
    return user.nickname.trim().substring(0, 2).toUpperCase();
  }
  const f = user.firstName?.[0] || '';
  const l = user.lastName?.[0] || '';
  return (f + l).toUpperCase() || 'U';
}
