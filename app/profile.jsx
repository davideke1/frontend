import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from 'react-native';
import { Paragraph, Card, Title, ActivityIndicator, Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import axiosService from '../helpers/axios';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';
import { saveUserData, getUserData } from '../utils/storage';

const checkoutSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const Profile = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [loading, setLoading] = useState(true);
  const [userAuth, setUserAuth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserData(); // Call getUserData to retrieve user data
      setUserAuth(data); // Set the user data to state
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosService.patch(`/user/${userAuth.user.id}/`, values);
      
      // Check if the response status is in the success range
      if (response.status >= 200 && response.status < 300) {
        // Update local storage
        const updatedUser = { ...userAuth, user: { ...userAuth.user, ...values } };
        await saveUserData(updatedUser);

        setSnackbarMessage('Profile updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        // Handle other response status codes
        setSnackbarMessage('Failed to update profile. Please try again later.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      // Handle request failure
      let errorMessage = "An unexpected error occurred.";
      if (error.response) {
        // Backend responded with an error
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data) {
          // Try to get the first error message if it's an object of errors
          const data = error.response.data;
          errorMessage = data[Object.keys(data)[0]] || errorMessage;
        }
      } else if (error.message) {
        // General error message
        errorMessage = error.message;
      }
  
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading || !userAuth?.user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content className="w-full flex justify-center min-h-[90vh] px-4">
            {/* <Title style={styles.title}>Profile</Title> */}
            <Paragraph style={styles.subtitle}>Update your personal information</Paragraph>

            <Formik
              onSubmit={handleFormSubmit}
              initialValues={{
                first_name: userAuth.user.first_name || '',
                last_name: userAuth.user.last_name || '',
                username: userAuth.user.username || '',
                email: userAuth.user.email || '',
              }}
              validationSchema={checkoutSchema}
              enableReinitialize
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
                    value={values.first_name}
                    placeholder="Enter your first name"
                    handleChangeText={handleChange('first_name')}
                    isPassword={false}
                    otherStyles="mb-4"
                  />
                  {touched.first_name && errors.first_name && (
                    <Text style={styles.errorText}>{errors.first_name}</Text>
                  )}

                  <FormField
                    title="Last Name"
                    value={values.last_name}
                    placeholder="Enter your last name"
                    handleChangeText={handleChange('last_name')}
                    isPassword={false}
                    otherStyles="mb-4"
                  />
                  {touched.last_name && errors.last_name && (
                    <Text style={styles.errorText}>{errors.last_name}</Text>
                  )}

                  <FormField
                    title="Username"
                    value={values.username}
                    placeholder="Enter your username"
                    handleChangeText={handleChange('username')}
                    isPassword={false}
                    otherStyles="mb-4"
                  />
                  {touched.username && errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}

                  <FormField
                    title="Email"
                    value={values.email}
                    placeholder="Enter your email"
                    handleChangeText={handleChange('email')}
                    isPassword={false}
                    otherStyles="mb-4"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <CustomButton
                    title="Update Profile"
                    handlePress={handleSubmit}
                    containerStyles="mt-7"
                    isLoading={isSubmitting}
                  />
                </>
              )}
            </Formik>
          </Card.Content>
        </Card>

        <Snackbar
          visible={snackbarOpen}
          onDismiss={handleSnackbarClose}
          duration={3000}
          style={{
            backgroundColor: snackbarSeverity === 'success' ? '#4caf50' : '#f44336',
          }}
        >
          <Text>{snackbarMessage}</Text>
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#161622',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161622',
  },
  card: {
    borderRadius: 8,
    elevation: 4,
    marginBottom: 16,
    backgroundColor: '#1E1E2F',
  },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 8,
//   },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#ff0000',
    marginBottom: 8,
  },
});

export default Profile;
