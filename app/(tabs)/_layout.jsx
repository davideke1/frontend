import { Image, Text, View } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";


const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Dashboard",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="historydata"
          options={{
            title: "History Data",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.clock}
                color={color}
                name="history data"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="feedback"
          options={{
            title: "Feedback",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.feedback}
                color={color}
                name="Feedback"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="notification"
          options={{
            title: "Notifications",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bell}
                color={color}
                name="notifications"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings" // Set the name for the settings screen
          // component={SettingsScreen} // Provide the SettingsScreen component
          options={{
            title: "Settings", // Set the title for the settings tab
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.setting} // Provide the icon for the settings tab
                color={color}
                name="Settings" // Set the name for the settings tab
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
