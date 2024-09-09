import React, { useEffect, useState, ReactNode } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
type GuardProps = {
  children: ReactNode; // Define que o Guard pode receber children como props
};

export default function Guard({ children }: GuardProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigation: any = useNavigation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigation.navigate("login");
        }
      } catch (error) {
        console.error('Failed to check authentication', error);
        setIsAuthenticated(false);
        navigation.navigate("login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!isAuthenticated) {
    return (
      <View>
        <Text>Redirecting to login...</Text>
      </View>
    );
  }

  return <>{children}</>; // Renderiza os children se o usuário estiver autenticado
}
