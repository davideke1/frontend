import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Snackbar, useTheme } from 'react-native-paper';
import * as yup from 'yup';
import { Formik } from 'formik';
import axiosService from '../helpers/axios';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const PasswordChange = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarDismiss = () => setSnackbarVisible(false);
  const router = useRouter();
  const initialValues = {
    oldpassword: "",
    newpassword: "",
    confirmnewpassword: "",
  };

  const validationSchema = yup.object().shape({
    oldpassword: yup.string().required("Required"),
    newpassword: yup.string().required("Required"),
    confirmnewpassword: yup
      .string()
      .oneOf([yup.ref("newpassword"), null], "Passwords must match")
      .required("Required"),
  });

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axiosService.post("/password-change/", values);
      setSnackbarMessage(response.data.detail);
      setSnackbarSeverity("success");
      setSnackbarVisible(true);
      resetForm();

      // Delay navigation for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear user data and navigate to the sign-in screen
      await AsyncStorage.removeItem('userData');
      router.push('/(auth)/sign-in');
    } catch (error) {
      console.error(error);
      setSnackbarMessage(error.response?.data?.error || "An error occurred");
      setSnackbarSeverity("error");
      setSnackbarVisible(true);
    } finally {
      setSubmitting(false);
    }
  };


  const theme = useTheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.header}>Ensure Strong Password</Text>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <View style={styles.form}>
                <FormField
                  title="Old Password"
                  value={values.oldpassword}
                  handleChangeText={handleChange("oldpassword")}
                  placeholder="Enter old password"
                  isPassword
                  otherStyles="mb-4"
                />
                {touched.oldpassword && errors.oldpassword && (
                  <Text style={styles.errorText}>{errors.oldpassword}</Text>
                )}
                <FormField
                  title="New Password"
                  value={values.newpassword}
                  handleChangeText={handleChange("newpassword")}
                  placeholder="Enter new password"
                  isPassword
                  otherStyles="mb-4"
                />
                {touched.newpassword && errors.newpassword && (
                  <Text style={styles.errorText}>{errors.newpassword}</Text>
                )}
                <FormField
                  title="Confirm New Password"
                  value={values.confirmnewpassword}
                  handleChangeText={handleChange("confirmnewpassword")}
                  placeholder="Confirm new password"
                  isPassword
                  otherStyles="mb-4"
                />
                {touched.confirmnewpassword && errors.confirmnewpassword && (
                  <Text style={styles.errorText}>{errors.confirmnewpassword}</Text>
                )}
                <CustomButton
                  title={isSubmitting ? "Submitting..." : "Change Password"}
                  handlePress={handleSubmit}
                  isLoading={isSubmitting}
                />
              </View>
            )}
          </Formik>
          
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={handleSnackbarDismiss}
        duration={Snackbar.DURATION_SHORT}
        style={{
          backgroundColor: snackbarSeverity === 'success' ? '#4caf50' : '#f44336',
        }}
      >
        <Text>{snackbarMessage}</Text> 
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#161622',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  form: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 10,
  },
  errorText: {
    color: '#ff0033',
    marginBottom: 10,
  },
});

export default PasswordChange;
