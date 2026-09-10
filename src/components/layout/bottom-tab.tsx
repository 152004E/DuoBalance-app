import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import { useAuth } from '@/hooks/use-auth';

const USER_TABS = [
  { name: 'index', label: 'Inicio', icon: 'house' },
  { name: 'gastos', label: 'Gastos', icon: 'receipt' },
  { name: 'grupos', label: 'Grupos', icon: 'users' },
  { name: 'reportes', label: 'Reportes', icon: 'chart-pie' },
  { name: 'perfil', label: 'Perfil', icon: 'user' },
];

const ADMIN_TABS = [
  { name: 'admin/index', label: 'Inicio', icon: 'house' },
  { name: 'admin/users', label: 'Usuarios', icon: 'users-gear' },
  { name: 'admin/reportes', label: 'Reportes', icon: 'chart-line' },
  { name: 'perfil', label: 'Perfil', icon: 'user' },
];

const NESTED_TABS = ['gastos', 'grupos', 'perfil', 'admin/users', 'admin/reportes'];

export default function BottomTab({ state, navigation, insets }: any) {
  const { user } = useAuth();
  const activeTabs = user?.role === 'SUPER_ADMIN' ? ADMIN_TABS : USER_TABS;
  return (
    <View
      style={{ paddingBottom: insets.bottom }}
      className="border-t border-slate-200 bg-white"
    >
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 8,
        }}
        className="h-[74px] flex-row"
      >
        {activeTabs.map((tab, index) => {
          const route = state.routes.find((r: any) => r.name === tab.name);
          if (!route) return null;
          
          const routeIndex = state.routes.indexOf(route);
          const isFocused = state.index === routeIndex;
          const color = isFocused ? '#10B981' : '#94A3B8';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              const hasNestedStack = NESTED_TABS.includes(route.name);
              navigation.navigate(
                route.name,
                hasNestedStack ? { screen: 'index' } : undefined,
              );
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center justify-center"
            >
              <FontAwesome6 name={tab.icon} size={22} color={color} />
              <Text
                className="mt-0.5 text-[11px]"
                style={{ color, fontFamily: 'System' }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
