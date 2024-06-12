import React from "react";
import { View, StyleSheet } from "react-native";
import { List, Avatar } from "react-native-paper";
import { Link } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader style={styles.subheader}>Account</List.Subheader>
        <Link href="/profile" style={styles.link}>
          <List.Item
            title="Profile"
            titleStyle={styles.titleStyle}
            left={() => (
              <Avatar.Icon
                size={32}
                icon="account"
                style={[styles.avatarIcon, { backgroundColor: "#282828" }]}
                color="#ffffff"
              />
            )}
          />
        </Link>
        <Link href="/passwordChange" style={styles.link}>
          <List.Item
            title="Change Password"
            titleStyle={styles.titleStyle}
            left={() => (
              <FontAwesome5
                name="lock"
                size={24}
                color="#ffffff"
                style={[styles.icon, { backgroundColor: "#282828" }]} // Update background color
              />
            )}
          />
        </Link>
      </List.Section>
      <CustomButton
        title="Logout"
        handlePress={() => {}}
        containerStyles={styles.logoutButton}
        textStyles={styles.logoutButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#161622",
  },
  subheader: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: "#ffffff",
  },
  link: {
    textDecorationLine: "none",
  },
  avatarIcon: {
    backgroundColor: "#282828",
  },
  titleStyle: {
    color: "#ffffff", // Make the text white for better visibility
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
    backgroundColor: "#282828", // Match the background color with #282828
    borderRadius: 16,
    padding: 4,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
