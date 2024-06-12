import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import axiosService from '../../helpers/axios';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1); // Current page
  const [hasNextPage, setHasNextPage] = useState(false); // Indicates if there are more pages
  const [loading, setLoading] = useState(true); // Loading state

  const theme = useTheme();

  const fetchNotifications = async () => {
    try {
      const response = await axiosService.get(`notifications/?page=${page}`);
      setNotifications(response.data.results);
      setHasNextPage(response.data.next !== null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const nextPage = () => {
    setPage(page + 1);
    setLoading(true);
  };

  const prevPage = () => {
    setPage(page - 1);
    setLoading(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.header}>Notifications</Text>
          {loading ? (
            <ActivityIndicator animating={loading} size="large" />
          ) : (
            notifications.map(notification => (
              <Card key={notification.id} style={styles.card}>
                <Card.Title 
                  title={notification.title} 
                  titleStyle={styles.cardTitle} 
                />
                <Card.Content>
                  <Text style={styles.cardContent}>{notification.subtitle}</Text>
                </Card.Content>
              </Card>
            ))
          )}
          <View style={styles.pagination}>
            <Button
              mode="contained"
              onPress={prevPage}
              disabled={page === 1}
              labelStyle={{ color: "#161622" }}
              style={styles.button}
            >
              Previous
            </Button>
            <Text style={styles.pageNumber}>{page}</Text>
            <Button
              mode="contained"
              onPress={nextPage}
              disabled={!hasNextPage}
              labelStyle={{ color: "#161622" }}
              style={styles.button}
            >
              Next
            </Button>
          </View>
        </View>
      </ScrollView>
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
    textAlign: 'center',
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    padding: 10,
  },
  cardTitle: {
    color: '#FFA001',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: '#FFA001',
  },
  pageNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NotificationScreen;
