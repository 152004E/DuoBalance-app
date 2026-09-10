import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { UserBrief } from '@/types/api';

export type AdminUserItem = UserBrief & {
  createdAt?: string;
  _count?: {
    members: number;
    expenses: number;
  };
};

interface RecentUsersCardProps {
  title?: string;
  users: AdminUserItem[];
  maxItems?: number;
  onViewAll?: () => void;
  onToggleSuspension?: (user: AdminUserItem) => void;
  onUserPress?: (user: AdminUserItem) => void;
  currentUserId?: string;
}

export function RecentUsersCard({
  title = 'Usuarios Recientes',
  users,
  maxItems,
  onViewAll,
  onToggleSuspension,
  onUserPress,
  currentUserId,
}: RecentUsersCardProps) {
  const visibleUsers =
    maxItems && maxItems > 0 ? users.slice(0, maxItems) : users;

  return (
    <View
      className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
        <Text className="text-[17px] font-bold text-[#0F172A]">
          {title}
        </Text>
        {onViewAll && (
          <Pressable onPress={onViewAll} className="active:opacity-70">
            <Text className="text-sm font-semibold text-[#006c49]">
              Ver todo
            </Text>
          </Pressable>
        )}
      </View>

      {/* Users List */}
      {visibleUsers.map((u, index) => {
        const isMe = currentUserId === u.id;
        const groupsCount = u._count?.members ?? 0;
        const expensesCount = u._count?.expenses ?? 0;

        return (
          <Pressable
            key={u.id}
            onPress={() => onUserPress?.(u)}
            className={`flex-row items-center justify-between px-5 py-4 ${
              index > 0 ? 'border-t border-[#E2E8F0]' : ''
            }`}
          >
            {/* Left: Avatar + Info */}
            <View className="min-w-0 flex-1 flex-row items-center gap-3.5">
              <View
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    u.role === 'SUPER_ADMIN' ? '#FEF3C7' : '#10B9811A',
                }}
              >
                <FontAwesome6
                  name={u.role === 'SUPER_ADMIN' ? 'crown' : 'user'}
                  size={16}
                  color={u.role === 'SUPER_ADMIN' ? '#D97706' : '#10B981'}
                />
              </View>

              <View className="min-w-0 flex-1">
                <View className="flex-row items-center gap-2">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="font-bold text-[#0F172A]"
                  >
                    {u.firstName} {u.lastName}
                  </Text>
                  {u.role === 'SUPER_ADMIN' && (
                    <FontAwesome6 name="crown" size={11} color="#FBBF24" />
                  )}
                  {!u.isActive && (
                    <View className="rounded bg-red-100 px-1.5 py-0.5">
                      <Text className="text-[9px] font-bold text-red-600">
                        SUSPENDIDO
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-xs text-[#64748B]"
                >
                  {u.email}
                </Text>

                <Text className="mt-0.5 text-[10px] text-[#94A3B8]">
                  Grupos: {groupsCount} • Gastos: {expensesCount}
                </Text>
              </View>
            </View>

            {/* Right Action: Suspender / Restaurar button */}
            {!isMe && onToggleSuspension && (
              <Pressable
                onPress={() => onToggleSuspension(u)}
                className={`ml-2 shrink-0 rounded-full px-3 py-1.5 active:opacity-80 ${
                  u.isActive ? 'bg-red-50' : 'bg-green-50'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    u.isActive ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {u.isActive ? 'Suspender' : 'Restaurar'}
                </Text>
              </Pressable>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
