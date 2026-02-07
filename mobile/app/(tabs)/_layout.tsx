import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { useRole } from '../../src/hooks/useRole';

export default function TabLayout() {
  const router = useRouter();
  const { isInstructor, isAdmin } = useRole();

  const HeaderRight = () => (
    <TouchableOpacity
      onPress={() => router.push('/notifications')}
      className="mr-4 relative"
    >
      <Ionicons name="notifications-outline" size={24} color="#0f172a" />
      <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center border-2 border-white">
        <AppText className="text-[8px] text-white font-bold">2</AppText>
      </View>
    </TouchableOpacity>
  );

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#4f46e5',
      headerRight: () => <HeaderRight />,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color }) => <Ionicons name="layers-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="teaching"
        options={{
          title: 'Teaching',
          tabBarIcon: ({ color }) => <Ionicons name="school-outline" size={24} color={color} />,
          href: isInstructor ? '/teaching' : null,
        }}
      />
      <Tabs.Screen
        name="assignments"
        options={{
          title: 'Assignments',
          tabBarIcon: ({ color }) => <Ionicons name="clipboard-outline" size={24} color={color} />,
          href: (isInstructor || isAdmin) ? null : '/assignments',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
