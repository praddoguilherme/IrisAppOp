import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../../styles/colors';
import { supabase } from '../../../supabase/supabaseClient';

type RootStackParamList = {
  EditProfile: undefined;
  Profile: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
};

type UserProfileType = {
  fullName: string;
  email: string;
  phone: string;
};

type LanguageType = 'pt-br' | 'en-us' | 'es';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [userProfile, setUserProfile] = useState<UserProfileType>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguageType>('pt-br');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserProfile({
            fullName: data.full_name || 'Usuário',
            email: user.email || '',
            phone: data.phone || '',
          });
        }
      }
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim, sair',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Erro ao fazer logout:', error);
          }
        },
      },
    ]);
  };

  const handleChangePassword = (): void => {
    Alert.alert(
      'Alterar Senha',
      'Um link para alteração de senha será enviado para seu e-mail.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.resetPasswordForEmail(
                userProfile.email,
                {
                  redirectTo: 'com.example.irisapp://reset-password',
                },
              );

              if (error) throw error;

              Alert.alert(
                'Sucesso',
                'Enviamos um e-mail para você redefinir sua senha.',
              );
            } catch (error: any) {
              console.error('Erro ao solicitar redefinição de senha:', error);
              Alert.alert(
                'Erro',
                'Não foi possível enviar o e-mail de redefinição de senha.',
              );
            }
          },
        },
      ],
    );
  };

  const toggleDarkMode = (): void => {
    setIsDarkMode(!isDarkMode);
  };

  const changeLanguage = (lang: LanguageType): void => {
    setLanguage(lang);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
        </View>

        {/* Perfil do usuário */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <MaterialCommunityIcons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userProfile.fullName}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
        </View>

        {/* Seção: Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <MaterialCommunityIcons
                name="account-edit"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.menuItemText}>Editar Perfil</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#999"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleChangePassword}
            >
              <MaterialCommunityIcons
                name="lock-reset"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.menuItemText}>Alterar Senha</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção: Preferências */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.menuItemText}>Modo Escuro</Text>
              <Switch
                trackColor={{ false: '#ddd', true: colors.primaryLight }}
                thumbColor={isDarkMode ? colors.primary : '#f4f4f4'}
                onValueChange={toggleDarkMode}
                value={isDarkMode}
              />
            </View>

            <View style={styles.menuItem}>
              <MaterialCommunityIcons
                name="translate"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.menuItemText}>Idioma</Text>
              <View style={styles.languageSelector}>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'pt-br' && styles.languageOptionSelected,
                  ]}
                  onPress={() => changeLanguage('pt-br')}
                >
                  <Text
                    style={
                      language === 'pt-br' ? { color: colors.primary } : {}
                    }
                  >
                    PT
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'en-us' && styles.languageOptionSelected,
                  ]}
                  onPress={() => changeLanguage('en-us')}
                >
                  <Text
                    style={
                      language === 'en-us' ? { color: colors.primary } : {}
                    }
                  >
                    EN
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'es' && styles.languageOptionSelected,
                  ]}
                  onPress={() => changeLanguage('es')}
                >
                  <Text
                    style={language === 'es' ? { color: colors.primary } : {}}
                  >
                    ES
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Seção: Sobre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <MaterialCommunityIcons
                name="information"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.menuItemText}>Sobre o Aplicativo</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#999"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <MaterialCommunityIcons
                name="help-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  languageSelector: {
    flexDirection: 'row',
  },
  languageOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 40,
    color: '#999',
    fontSize: 12,
  },
});
