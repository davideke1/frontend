import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add this import
import { saveUserData, clearUserData } from "../utils/storage";

const API_URL = "http://10.2.136.64:8000/api"; // Change to your server URL

const useUserActions = () => {
  const navigation = useNavigation();

  const login = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/user-auth/login/`, data);
      await saveUserData(res.data);
    //   navigation.navigate("home");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/user-auth/register/`, data);
      await saveUserData(res.data);
    //   navigation.navigate("home");
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

//   const logout = async () => {
//     try {
//       await clearUserData();
//     //   navigation.navigate("Login");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   // Get the user
//   const getUser = async () => {
//     try {
//       const userDataJson = await AsyncStorage.getItem("userData");
//       if (userDataJson) {
//         const userData = JSON.parse(userDataJson);
//         return userData.user;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error getting user:", error);
//       return null;
//     }
//   };
  
//   // Get the access token
//   const getAccessToken = async () => {
//     try {
//       const userDataJson = await AsyncStorage.getItem("userData");
//       if (userDataJson) {
//         const userData = JSON.parse(userDataJson);
//         return userData.access;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error getting access token:", error);
//       return null;
//     }
//   };
  
//   // Get the refresh token
//   const getRefreshToken = async () => {
//     try {
//       const userDataJson = await AsyncStorage.getItem("userData");
//       if (userDataJson) {
//         const userData = JSON.parse(userDataJson);
//         return userData.refresh;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error getting refresh token:", error);
//       return null;
//     }
//   };

  return { login, register};
};

export default useUserActions;
