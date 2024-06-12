// navigators/tabs/_layout.js
import { Image, Text, View } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";
import { FontAwesome5 } from "@expo/vector-icons";

import Home from '../(tabs)/home';
import Feedback from '../(tabs)/feedback';
import HistoryData from '../(tabs)/historydata';
import Notification from '../(tabs)/notification';


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

  
const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="home" component={Home} options={{ headerShown: false }} />
      <Tabs.Screen name="feedback" component={Feedback} options={{ headerShown: false }} />
      <Tabs.Screen name="historydata" component={HistoryData} options={{ headerShown: false }} />
      <Tabs.Screen name="notification" component={Notification} options={{ headerShown: false }} />
    </Tabs>
  );
};

export default TabsLayout;