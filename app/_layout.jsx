// app/_layout.js
import React, { useEffect, useState } from 'react';
import { SplashScreen, Stack, Slot, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import store from '../store';  // Adjust the path as necessary
import { setIsLoggedIn } from '../reducers';  // Adjust the path as necessary
import jwtDecode from 'jwt-decode';  // Make sure this is installed

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem('userData');
        if (userDataJson) {
          const userData = JSON.parse(userDataJson);
          if (isTokenValid(userData.refreshToken)) {
            dispatch(setIsLoggedIn(true));
            router.replace('/(tabs)/home');
          } else {
            navigateToLogin();
          }
        } else {
          navigateToLogin();
        }
      } catch (error) {
        console.error('Error checking user data:', error);
        navigateToLogin();
      } finally {
        setIsLoading(false);
      }
    };

    checkUserData();
  }, [dispatch]);

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, isLoading]);

  const navigateToLogin = () => {
    router.replace('/sign-in');
  };

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <Stack>
      <Slot />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <Stack.Screen
        name="passwordChange"
        options={{
          headerShown: true,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
    </Stack>
  );
};

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token); // You need to install jwt-decode package
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff', // Set the background color of the header
  },
  headerTitle: {
    color: '#000000', // Set the color of the header title
    fontWeight: 'bold', // Make the header title bold
    fontSize: 18, // Set the font size of the header title
  },
});

const App = () => (
  <Provider store={store}>
    <RootLayout />
  </Provider>
);

export default App;
