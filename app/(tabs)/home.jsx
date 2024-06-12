import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { Card, Title, Paragraph } from "react-native-paper";
import { Dimensions } from "react-native";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { getUser } from "../../utils/storage";
import { images } from "../../constants";

const { width } = Dimensions.get("window");

const parameters = ["temperature", "do", "tds", "humidity", "PH"];

const Home = () => {
  const [sensorData, setSensorData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      const sensorDataSocket = new W3CWebSocket(
        `ws://172.26.224.232:8000/ws/sensor-data/user/${userData.id}/`
      );

      sensorDataSocket.onopen = () => {
        console.log("Successfully connected to the WebSocket.");
      };

      sensorDataSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log("Received data:", data);

        if (Array.isArray(data)) {
          setSensorData((prevData) => [...prevData, ...data]);
        } else {
          setSensorData((prevData) => [...prevData, data]);
        }
      };

      sensorDataSocket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      sensorDataSocket.onclose = (e) => {
        console.error("Sensor data socket closed unexpectedly:", e);
      };

      return () => {
        sensorDataSocket.close();
      };
    }
  }, [userData]);

  if (!Array.isArray(sensorData) || sensorData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const getValue = (parameter) => {
    return sensorData.length > 0
      ? parseFloat(sensorData[sensorData.length - 1][parameter]).toFixed(2)
      : "N/A";
  };

  const getChartData = (parameter) => {
    const displayData = sensorData.slice(-10); // Display only the last 10 data points
    const data = displayData.map((d) => parseFloat(d[parameter]));
    const labels = displayData.map((d, index) => {
      const date = new Date(d.timestamp);
      if (index % Math.ceil(displayData.length / 5) === 0) { // Display fewer labels
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      } else {
        return "";
      }
    });

    return {
      labels,
      datasets: [
        {
          data,
          color: () => `rgba(134, 65, 244, 1)`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const handleDataPointClick = ({ dataset, index, x, y }) => {
    setTooltipData({
      value: dataset.data[index],
      x,
      y,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.userText}>{userData.first_name}</Text>
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={images.logoshome}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          {parameters.map((parameter) => (
            <Card key={parameter} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={styles.title}>{parameter.toUpperCase()}</Title>
                  <Paragraph style={styles.value}>{getValue(parameter)}</Paragraph>
                </View>
                <LineChart
                  data={getChartData(parameter)}
                  width={width - 40}
                  height={200}
                  chartConfig={{
                    backgroundGradientFrom: "#1E2923",
                    backgroundGradientTo: "#08130D",
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 10,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#ffa726",
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: "", // Set line style
                      strokeWidth: 0.5, // Set line width
                    },
                    useShadowColorFromDataset: false,
                    withInnerLines: false,
                    withOuterLines: false,
                    formatXLabel: (label) => (label.trim() === "" ? "" : label),
                    decimalPlaces: 2,
                  }}
                  bezier
                  style={styles.chartStyle}
                  onDataPointClick={handleDataPointClick}
                />
              </Card.Content>
            </Card>
          ))}
        </View>

        {tooltipData && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={tooltipData !== null}
            onRequestClose={() => setTooltipData(null)}
          >
<View style={styles.tooltipContainer}>
  <View style={styles.tooltip}>
    <Text style={styles.tooltipText}>
      Time: <Text>{new Date(tooltipData.x).toLocaleTimeString()}</Text>
    </Text>
    <Text style={styles.tooltipText}>
      Value: <Text>{tooltipData.value}</Text>
    </Text>
    <TouchableOpacity onPress={() => setTooltipData(null)}>
      <Text style={styles.closeTooltip}>Close</Text>
    </TouchableOpacity>
  </View>
</View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontFamily: "sans-serif-medium", // Assuming 'font-pmedium' is a sans-serif medium font
    fontSize: 14,
    color: "#9CA3AF", // text-gray-100
  },
  userText: {
    fontSize: 24, // text-2xl
    fontFamily: "sans-serif-semi-bold", // Assuming 'font-psemibold' is a sans-serif semibold font
    color: "#FFFFFF", // text-white
  },
  logoContainer: {
    marginTop: 6, // mt-1.5
  },
  logo: {
    width: 36, // w-9
    height: 40, // h-10
  },
  cardContainer: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#FFA001",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 10,
  },
  tooltipContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tooltip: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  tooltipText: {
    color: '#000',
  },
  closeTooltip: {
    marginTop: 10,
    color: 'blue',
  },
});

export default Home;
