import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import axios from "axios";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { saveUserData } from "../../utils/storage";
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '../../reducers';

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post("http://172.26.224.232:8000/api/user-auth/login/", {
        email: form.email,
        password: form.password,
      });

      const data = response.data;

      if (response.status === 200) {
        await saveUserData(data);
        dispatch(setIsLoggedIn(true));
        router.replace("/home");
      } else {
        const errorMessages = Object.values(data).join("\n");
        Alert.alert("Error", errorMessages);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        const errorMessages = Object.values(error.response.data).join("\n");
        Alert.alert("Error", errorMessages);
      } else if (error.request) {
        Alert.alert("Error", "No response received from the server");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center min-h-[85vh] px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
          tabIndex={0}
        >
          <Image
            source={images.logoshome}
            resizeMode="contain"
            className="w-[115px] h-[40px]"
          />
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to AquaWatch
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            isPassword
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;