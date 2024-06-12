import { Text, View, Image, ScrollView } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { images } from "../constants";
import CustomButton from "../components/CustomButton";


const index = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}>
      <ScrollView>
        <View className="w-full flex justify-center items-center min-h-[90vh] px-4">
          <Image
            source={images.logoshome}
            className="w-[200px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={images.homesplash}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Real Time{"\n"}
              Visualization with{" "}
              <Text className="text-secondary-200">AquaWatch</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[185px] h-[20px] absolute -bottom-4 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Dive into AquaWatch: Explore innovation in water quality monitoring, shaping a sustainable future through science, passion, and dedication to clean water
          </Text>
          
          
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>

        <View style={{ position: 'absolute', bottom: 4, left: 0, right: 0 }}>
          <Text className="text-sm font-pregular text-gray-100 mt-2 mb-0 text-center">
            Summer Research Internship IIITH 2024
          </Text>
        </View>

      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  )
}

export default index

