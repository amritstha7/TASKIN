import { Redirect, router, Tabs } from 'expo-router';
import { History, Image as ImageIcon, LayoutDashboard, Plus, Settings } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/providers/auth-provider';

const ACTIVE_COLOR = '#FF5500';
const INACTIVE_COLOR = '#9a9a9e';

export default function TabsLayout() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const { urgentTasksCount } = useTabBadges();

  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          height: 58 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
          backgroundColor: 'transparent',
          position: Platform.OS === 'ios' ? 'absolute' : undefined,
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarBackground: () => <View className="flex-1 border-t border-black/5 bg-surface dark:border-white/5 dark:bg-surface-dark" />,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add-task"
        options={{
          title: '',
          tabBarIcon: () => (
            <View className="-mt-6 h-14 w-14 items-center justify-center rounded-full bg-brand shadow-lg">
              <Plus color="#fff" size={26} />
            </View>
          ),
          tabBarLabelStyle: { height: 0 },
        }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push('/modals/add-task');
          },
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Media',
          tabBarIcon: ({ color, size }) => <ImageIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          tabBarBadge: urgentTasksCount > 0 ? urgentTasksCount : undefined,
        }}
      />
    </Tabs>
  );
}

// TanStack Query dedupes this against the same ['tasks', branchId] query the
// Dashboard/task screens already use, so this doesn't add an extra fetch.
function useTabBadges() {
  const { tasks } = useTasks();
  return { urgentTasksCount: tasks.filter((t) => t.is_urgent && !t.completed).length };
}
