// src/utils/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserData = async (data) => {
    try {
      const userData = {
        access: data.access,
        refresh: data.refresh,
        user: data.user,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('User data saved:', userData); // Logging for debugging
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
  

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
export const getUserData = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem('userData');
      console.log('Retrieved user data JSON:', userDataJson); // Logging for debugging
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        console.log('Parsed user data:', userData); // Logging for debugging
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  };


export const getUser = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem('userData');
      console.log('Retrieved user data JSON:', userDataJson); // Logging for debugging
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        console.log('Parsed user data:', userData); // Logging for debugging
        return userData.user;
      }
      return null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  };

export const getAccessToken = async () => {
  try {
    const userDataJson = await AsyncStorage.getItem("userData");
    if (userDataJson) {
      const userData = JSON.parse(userDataJson);
      console.log(userData.access)
      return userData.access;

    }
    return null;
  } catch (error) {
    console.error("Get access token error:", error);
    return null;
  }
};

// Function to get the refresh token
export const getRefreshToken = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem("userData");
      console.log('Retrieved user data JSON:', userDataJson); // Add this line
      if (userDataJson) {
        const userData = JSON.parse(userDataJson);
        console.log('Parsed user data:', userData); // Add this line
        return userData.refresh;
      }
      return null;
    } catch (error) {
      console.error('Get refresh token error:', error);
      return null;
    }
  };
  

export const isUserLoggedIn = async () => {
    const userData = await getUser();
    return !!userData && !!userData.access;
  };