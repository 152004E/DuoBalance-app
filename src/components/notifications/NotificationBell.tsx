import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { useWorkspace } from '@/hooks/use-workspace';
import { useSettlementSuggestions } from '@/hooks/use-settlement-suggestions';
import { usePendingIncomingPayments } from '@/hooks/use-pending-incoming-payments';
import { useInAppNotifications } from '@/hooks/use-in-app-notifications';
import { useSnoozedDues } from '@/hooks/use-snoozed-dues';
import { usePendingExpenses } from '@/hooks/use-pending-expenses';
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

  const { data: inAppNotifications = [], unreadCount, markAsRead, refetch: refetchInApp } = useInAppNotifications();
  const { activeDuesCount, markDuesAsViewed } = useSnoozedDues(dues);
  
  const { pendingExpenses, refetch: refetchPendingExpenses, approve, reject } = usePendingExpenses(user?.id);

  const [sheetVisible, setSheetVisible] = useState(false);

  const pendingCount = activeDuesCount + incomingPayments.length + unreadCount + pendingExpenses.length;

  const handleOpenSheet = useCallback(() => {
    // Refetch data when opening to ensure it's fresh
    refetchDues();
    refetchIncoming();
    refetchInApp();
    refetchPendingExpenses();
    markDuesAsViewed();
    setSheetVisible(true);
  }, [refetchDues, refetchIncoming, refetchInApp, refetchPendingExpenses, markDuesAsViewed]);

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
        inAppNotifications={inAppNotifications}
        pendingExpenses={pendingExpenses}
        onApproveExpense={async (id) => { await approve(id); }}
        onRejectExpense={async (id) => { await reject(id); }}
        markAsRead={markAsRead}
      />
    </>
  );
}
