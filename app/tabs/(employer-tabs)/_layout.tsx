import { Tabs } from "expo-router";
import { CustomTabBar } from "@/components/layout/CustomTabBar";
import TabIcons from "@/assets/icons/TabIcons";

export default function EmployerTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <TabIcons.HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="workers"
        options={{
          title: "Applicants",
          tabBarIcon: ({ color, size }) => <TabIcons.PeopleIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="my-jobs"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, size }) => <TabIcons.BagIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => <TabIcons.ChatIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <TabIcons.ProfileIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
