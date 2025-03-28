import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import colors from '../../styles/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  // Dados mockados para teste
  const mockCredentials = {
    email: 'teste@iris.com',
    password: '123456',
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      // Verificar se as credenciais correspondem às mockadas
      if (
        email === mockCredentials.email &&
        password === mockCredentials.password
      ) {
        // Login mockado para desenvolvimento
        console.log(
          'Credenciais mockadas detectadas, realizando login mockado',
        );
        await login(email, password);
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
      } else {
        Alert.alert(
          'Erro de Login',
          'Email ou senha incorretos.\n\nDica: Use teste@iris.com / 123456',
        );
      }
    } catch (error) {
      console.error('Erro durante login:', error);
      Alert.alert('Erro', 'Ocorreu um problema ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.actionButtonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.mockCredentialsContainer}>
        <Text style={styles.mockCredentialsText}>
          Para testar, use: teste@iris.com / 123456
        </Text>
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <MaterialCommunityIcons
          name="google"
          size={20}
          color="#EA4335"
          style={styles.googleLogo}
        />
        <Text style={styles.googleButtonText}>Continuar com o Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: 'rgba(74,144,160,0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    color: colors.foreground,
    backgroundColor: '#fff',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 14,
  },
  actionButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  mockCredentialsContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  mockCredentialsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleLogo: {
    marginRight: 8,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
