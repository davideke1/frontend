import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Snackbar, useTheme } from 'react-native-paper';
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import axiosService from '../../helpers/axios';

const FeedbackScreen = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarDismiss = () => setSnackbarVisible(false);

  const initialValues = {
    message: "",
  };

  const validationSchema = yup.object().shape({
    message: yup.string().required("Required"),
  });

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axiosService.post("feedback/", values);
      setSnackbarMessage("Feedback submitted");
      setSnackbarSeverity("success");
      setSnackbarVisible(true);
      resetForm();
    } catch (error) {
      console.error(error);
      setSnackbarMessage(error.response?.data?.error || "Something went wrong!");
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
          <Text style={styles.header}>Feedback</Text>
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
                  title="Feedback"
                  value={values.message}
                  placeholder="Enter your feedback"
                  handleChangeText={handleChange('message')}
                  onBlur={handleBlur("message")}
                  error={touched.message && errors.message}
                  otherStyles="mt-2"
                  multiline
                  numberOfLines={4}
                />
                {touched.message && errors.message && (
                  <Text style={styles.errorText}>{errors.message}</Text>
                )}
                <CustomButton
                  title="Submit Feedback"
                  handlePress={handleSubmit}
                  isLoading={isSubmitting}
                  containerStyles="mt-4"
                  textStyles="text-lg"
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
          backgroundColor: snackbarSeverity === "success" ? "#4caf50" : "#f44336",
        }}
      >
        {snackbarMessage}
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

export default FeedbackScreen;
