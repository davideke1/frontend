import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import SignIn from '../(auth)/sign-in';
import SignUp from '../app/(auth)/sign-up';

const AuthLayout = () => {
  return (
   <>
   <Stack>
    <Stack.Screen
   name="sign-in" component={SignIn}
    options={{
        headerShown:false
    }}
    />
    <Stack.Screen
    name="sign-up" component={SignUp}
    options={{
        headerShown:false
    }}
    />
   </Stack>
   <StatusBar backgroundColor='#161622' style='light' />
   </>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})

