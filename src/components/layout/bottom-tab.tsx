import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const tabs = [
  { name: 'index', label: 'Inicio', icon: 'house' },
  { name: 'gastos', label: 'Gastos', icon: 'receipt' },
  { name: 'pareja', label: 'Parejas', icon: 'heart' },
  { name: 'reportes', label: 'Reportes', icon: 'chart-pie' },
  { name: 'perfil', label: 'Perfil', icon: 'user' },
];

export default function BottomTab({ state, navigation, insets }: any) {
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
        {state.routes.map(
          (route: { key: string; name: string }, index: number) => {
            const isFocused = state.index === index;
            const tab = tabs.find((t) => t.name === route.name);

            if (!tab) return null;

            const color = isFocused ? '#10B981' : '#94A3B8';

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
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
          },
        )}
      </View>
    </View>
  );
}
