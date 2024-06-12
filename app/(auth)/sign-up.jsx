import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import axios from 'axios';
import { Link, router } from "expo-router";
import { Snackbar, ActivityIndicator } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const SignUp = () => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  };

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  const submit = async (values, actions) => {
    try {
      const response = await axios.post('http://172.26.224.232:8000/api/activations/register/', {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        username: values.username,
        password: values.password
      });

      setSnackbarMessage("Email verification sent");
      setSnackbarType('success');
      setSnackbarVisible(true);

      router.replace("/sign-in");
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "An error occurred");
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#161622" }}>
      <ScrollView>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            minHeight: Dimensions.get("window").height - 100,
            paddingHorizontal: 16,
            marginVertical: 16,
          }}
        >
          <Image
            source={images.logoshome}
            resizeMode="contain"
            style={{ width: 115, height: 40 }}
          />

          <Text style={{ fontSize: 24, fontWeight: "600", color: "white", marginTop: 40 }}>
            Sign up to AquaWatch
          </Text>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <>
                <FormField
                  title="First Name"
                  value={values.firstName}
                  handleChangeText={handleChange('firstName')}
                  otherStyles="mt-2"
                />
                {touched.firstName && errors.firstName && (
                  <Text style={{ color: 'red', marginBottom: 8 }}>{errors.firstName}</Text>
                )}
                <FormField
                  title="Last Name"
                  value={values.lastName}
                  handleChangeText={handleChange('lastName')}
                  otherStyles="mt-2"
                />
                {touched.lastName && errors.lastName && (
                  <Text style={{ color: 'red', marginBottom: 8 }}>{errors.lastName}</Text>
                )}
                <FormField
                  title="Email"
                  value={values.email}
                  handleChangeText={handleChange('email')}
                  otherStyles="mt-2"
                  keyboardType="email-address"
                />
                {touched.email && errors.email && (
                  <Text style={{ color: 'red', marginBottom: 8 }}>{errors.email}</Text>
                )}
                <FormField
                  title="Username"
                  value={values.username}
                  handleChangeText={handleChange('username')}
                  otherStyles="mt-2"
                />
                {touched.username && errors.username && (
                  <Text style={{ color: 'red', marginBottom: 8 }}>{errors.username}</Text>
                )}
                <FormField
                  title="Password"
                  value={values.password}
                  handleChangeText={handleChange('password')}
                  otherStyles="mt-2"
                  isPassword
                />
                {touched.password && errors.password && (
                  <Text style={{ color: 'red', marginBottom: 8 }}>{errors.password}</Text>
                )}
                <FormField
                  title="Confirm Password"
                  value={values.confirmPassword}
                  handleChangeText={handleChange('confirmPassword')}
                  otherStyles="mt-2"
                  isPassword
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={{ color: 'red', marginBottom: 8 }}>{errors.confirmPassword}</Text>
                )}
                <CustomButton
                  title="Sign Up"
                  handlePress={handleSubmit}
                  containerStyles="mt-4"
                  isLoading={isSubmitting}
                />
              </>
            )}
          </Formik>

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>

          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            style={{
              backgroundColor: snackbarType === 'success' ? '#4caf50' : '#f44336',
            }}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
