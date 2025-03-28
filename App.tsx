import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedSession = await AsyncStorage.getItem('supabase.auth.token');
        if (storedSession) {
          setHasSession(true);
        }
      } catch (error) {
        console.log('Erro ao checar sessão:', error);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  if (!isReady) {
    return null; // ou Spinner de carregamento
  }

  return (
    // Se hasSession for true, renderiza a tela principal; senão, volta pro AuthScreen
    <AppNavigator hasSession={hasSession} />
  );
}
