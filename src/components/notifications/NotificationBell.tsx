import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { useWorkspace } from '@/hooks/use-workspace';
import { useSettlementSuggestions } from '@/hooks/use-settlement-suggestions';
import { usePendingIncomingPayments } from '@/hooks/use-pending-incoming-payments';
import { NotificationSheet } from './notification-sheet';

export function NotificationBell() {
  const { user } = useAuth();
  const { groups } = useGroups();
  const { workspace } = useWorkspace();

  const { dues, refetch: refetchDues } = useSettlementSuggestions({
    workspace,
    groups,
    userId: user?.id,
  });

  const { incomingPayments, refetch: refetchIncoming } =
    usePendingIncomingPayments({
      workspace,
      groups,
      userId: user?.id,
    });

  const [sheetVisible, setSheetVisible] = useState(false);

  const pendingCount = dues.length + incomingPayments.length;

  const handleOpenSheet = useCallback(() => {
    // Refetch data when opening to ensure it's fresh
    refetchDues();
    refetchIncoming();
    setSheetVisible(true);
  }, [refetchDues, refetchIncoming]);

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenSheet}
        className="relative h-10 w-10 items-center justify-center rounded-full bg-white/10"
        activeOpacity={0.7}
      >
        <FontAwesome6 name="bell" size={20} color="white" />
        {pendingCount > 0 && (
          <View className="absolute right-0 top-0 h-4 w-4 items-center justify-center rounded-full bg-red-500 shadow-sm">
            <Text
              className="text-[10px] font-bold text-white"
              style={{ lineHeight: 12 }}
            >
              {pendingCount > 9 ? '9+' : pendingCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <NotificationSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        dues={dues}
        incomingPayments={incomingPayments}
      />
    </>
  );
}
