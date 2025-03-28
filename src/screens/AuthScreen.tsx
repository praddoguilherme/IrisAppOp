import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import colors from '../styles/colors';
import EyeIcon from '../components/EyeIcon';
import LoginForm from './forms/LoginForm';
import RegisterForm from './forms/RegisterForm';
import { supabase } from '../../supabase/supabaseClient';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  async function handleRegister() {
    const email = 'exemplo@dominio.com';
    const password = 'suaSenha';
    const confirmPassword = 'suaSenha';

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else if (data?.user) {
      alert('Conta criada com sucesso!');
    }
  }

  const renderForm = () => {
    if (activeTab === 'login') {
      return <LoginForm />;
    } else {
      return <RegisterForm onRegister={handleRegister} />;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1564866657313-0f2b11e688d8?fit=crop&w=800&q=80',
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <View style={styles.topSection}>
              <View style={styles.iconTextContainer}>
                <EyeIcon />
                <Text style={styles.title}>Íris</Text>
              </View>
              <Text style={styles.subtitle}>
                Sistema de Gestão para Clínicas Oftalmológicas
              </Text>
            </View>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'login' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('login')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'login' && styles.activeTabText,
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'register' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('register')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'register' && styles.activeTabText,
                  ]}
                >
                  Registro
                </Text>
              </TouchableOpacity>
            </View>
            {renderForm()}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2023 - Sua Empresa. Todos os direitos reservados.
              </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Termos de Uso</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Antes: 'rgba(20, 20, 30, 0.6)'
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333', // Antes: '#fff'
    textAlign: 'center',
    maxWidth: 300,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 247, 250, 0.85)',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
  },
  tabText: {
    fontSize: 16,
    color: colors.primary,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    padding: 10,
  },
  footerText: {
    color: '#333',
    fontSize: 12,
  },
  footerLink: {
    marginTop: 4,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
