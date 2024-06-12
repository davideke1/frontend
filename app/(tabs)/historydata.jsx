import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView, StatusBar, Text, ScrollView, Platform } from 'react-native';
import { Button, Snackbar, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { getUser } from '../../utils/storage';
import axiosService from '../../helpers/axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const Create = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [publicId, setPublicId] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [clickedValue, setClickedValue] = useState(null);
  const [showValueSnackbar, setShowValueSnackbar] = useState(false);

  useEffect(() => {
    const fetchPublicId = async () => {
      try {
        const user = await getUser();
        if (user && user.id) {
          setPublicId(user.id);
        }
      } catch (err) {
        setError('Error fetching user data');
        setOpenSnackbar(true);
        console.error(err);
      }
    };

    fetchPublicId();
  }, []);

  useEffect(() => {
    if (publicId && startDate && endDate) {
      fetchHistoricalData(publicId);
    }
  }, [publicId, startDate, endDate]);

  const fetchHistoricalData = async (userId) => {
    const params = {
      user_id: userId,
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
    };

    try {
      const response = await axiosService.get('user-sensor-data/user_historical_data/', { params });
      console.log('Received historical data:', response.data);
      setHistoricalData(response.data);
    } catch (error) {
      setError('There was an error fetching the historical data!');
      setOpenSnackbar(true);
      console.error(error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleExportUserHistoryData = async () => {
    if (isSharing) {
      setError('A sharing operation is already in progress.');
      setOpenSnackbar(true);
      return;
    }

    setIsSharing(true);

    const params = {
      publicId,
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
    };

    try {
      const response = await axiosService.get('user-sensor-data/export_sensor_data/', { params });
      const fileUri = `${FileSystem.documentDirectory}sensor_data.csv`;
      await FileSystem.writeAsStringAsync(fileUri, response.data, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error exporting sensor data:', error);
      if (error.message.includes('Another share request is being processed now')) {
        setError('Please wait for the current sharing operation to complete.');
      } else {
        setError('Error exporting sensor data!');
      }
      setOpenSnackbar(true);
    } finally {
      setIsSharing(false);
    }
  };

  const calculateDailyAverage = (data, parameter) => {
    const groupedData = data.reduce((acc, entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      const value = parseFloat(entry[parameter]);
      if (value !== 0) {
        acc[date].push(value);
      }
      return acc;
    }, {});

    const dailyAverages = Object.keys(groupedData).map((date) => {
      const values = groupedData[date];
      const nonZeroValues = values.filter((value) => value !== 0);
      const average =
        nonZeroValues.length > 0
          ? nonZeroValues.reduce((sum, value) => sum + value, 0) / nonZeroValues.length
          : null;
      return average !== null ? { date, average } : null; // Only include days with non-zero averages
    }).filter(entry => entry !== null); // Filter out null entries

    return dailyAverages;
  };

  const limitDataPoints = (data, maxPoints) => {
    const factor = Math.ceil(data.length / maxPoints);
    return data.filter((_, index) => index % factor === 0);
  };

  const handleDataPointClick = (data) => {
    setShowValueSnackbar(false); // Dismiss the Snackbar if it's already visible
    setClickedValue(data.value);
    setShowValueSnackbar(true); // Show the Snackbar again with the new value
  };

  const renderChart = (parameter) => {
    const dailyAverages = calculateDailyAverage(historicalData, parameter);
    const limitedData = limitDataPoints(dailyAverages, 10); // Limit to 10 points for example

    const chartData = {
      labels: limitedData.map(entry => entry.date),
      datasets: [
        {
          data: limitedData.map(entry => entry.average),
        },
      ],
    };

    return (
      <View key={parameter} style={styles.chartWrapper}>
        <Text style={styles.chartTitle}>{parameter.toUpperCase()}</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          withVerticalLines={false}
          withHorizontalLines={false}
          withDots={true}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          onDataPointClick={handleDataPointClick}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container}>
        <View style={styles.datePickers}>
          <Button onPress={() => setShowStartDatePicker(true)}
            labelStyle={{ color: "#161622" }}
            style={styles.button}
            >Select Start Date</Button>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
            />
          )}
          <Button onPress={() => setShowEndDatePicker(true)}
             labelStyle={{ color: "#161622" }}
             style={styles.button}
            >Select End Date</Button>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
            />
          )}
        </View>
        <Button
          mode="contained"
          onPress={handleExportUserHistoryData}
          labelStyle={{ color: "#161622" }}
          style={styles.exportButton}

        >
          Export Historical Data
        </Button>
        <View style={styles.chartsContainer}>
          {['temperature', 'humidity', 'PH', 'tds', 'do'].map((param, index) => (
            <View key={index} style={styles.chartContainer}>
              {historicalData.length ? (
                renderChart(param)
              ) : (
                <Text style={styles.noDataText}>No data available for {param}</Text>
              )}
            </View>
          ))}
        </View>
        <Snackbar
          visible={openSnackbar}
          onDismiss={handleCloseSnackbar}
          action={{
            label: 'Dismiss',
            onPress: handleCloseSnackbar,
          }}
        >
          <HelperText type="error">{error}</HelperText>
        </Snackbar>
        {/* <Snackbar
          visible={showValueSnackbar}
          onDismiss={() => setShowValueSnackbar(false)}
          duration={3000}
        >
          <Text style={{ color: 'white' }}>Value: {clickedValue}</Text>
        </Snackbar> */}
      </ScrollView>
      <Snackbar
          visible={showValueSnackbar}
          onDismiss={() => setShowValueSnackbar(false)}
          duration={Snackbar.DURATION_SHORT}
        >
          <Text style={{ color: 'white' }}>Value: {clickedValue}</Text>
        </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#161622', // Match the container's background color
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Add padding for Android devices
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#161622',
  },
  datePickers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: '#FFA001',
  },
  exportButton: {
    marginBottom: 16,
    backgroundColor: '#FFA001',
  },
  chartsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  chartContainer: {
    padding: 8,
  },
  noDataText: {
    color: '#fff',
    textAlign: 'center',
  },
  chartWrapper: {
    marginBottom: 16,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default Create;
