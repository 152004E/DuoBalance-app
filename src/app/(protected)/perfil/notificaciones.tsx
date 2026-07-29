import { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/screen-header';

interface NotificationOption {
  icon: string;
  label: string;
  description: string;
  key: string;
}

const notificationOptions: NotificationOption[] = [
  {
    icon: 'bell',
    label: 'Gastos compartidos',
    description: 'Cuando alguien agregue un gasto en un grupo',
    key: 'expenses',
  },
  {
    icon: 'money-bill-transfer',
    label: 'Pagos',
    description: 'Cuando recibas o realices un pago',
    key: 'payments',
  },
  {
    icon: 'user-plus',
    label: 'Invitaciones',
    description: 'Cuando te inviten a un grupo',
    key: 'invitations',
  },
  {
    icon: 'chart-line',
    label: 'Resumen semanal',
    description: 'Resumen de gastos cada semana',
    key: 'weekly',
  },
  {
    icon: 'bell',
    label: 'Recordatorios',
    description: 'Recordatorio de gastos pendientes',
    key: 'reminders',
  },
];

export default function NotificacionesScreen() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    expenses: true,
    payments: true,
    invitations: true,
    weekly: false,
    reminders: true,
  });

  const toggle = (key: string) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#E8E4F0', '#F4F2F7', '#F8FAFC']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title="Notificaciones"
            subtitle="Gestiona qué notificaciones quieres recibir"
            onBack={() => router.back()}
            actionIcon="bell"
          />

          <View className="mx-5 mt-4 rounded-2xl bg-white shadow-sm">
            {notificationOptions.map((option, index) => (
              <View
                key={option.key}
                className={`flex-row items-center justify-between px-4 py-4 ${
                  index < notificationOptions.length - 1
                    ? 'border-b border-[#F1F5F9]'
                    : ''
                }`}
              >
                <View className="flex-1 flex-row items-center gap-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#10B98126]">
                    <FontAwesome6
                      name={option.icon as any}
                      size={16}
                      color="#10B981"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-[#0F172A]">
                      {option.label}
                    </Text>
                    <Text className="text-sm text-[#64748B]">
                      {option.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={enabled[option.key]}
                  onValueChange={() => toggle(option.key)}
                  trackColor={{ false: '#E2E8F0', true: '#10B98180' }}
                  thumbColor={enabled[option.key] ? '#10B981' : '#CBD5E1'}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
