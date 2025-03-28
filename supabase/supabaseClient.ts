import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://mock-iris-app.supabase.co';
const SUPABASE_ANON_KEY = 'mock-key-for-development-only';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: AsyncStorage,
  },
});

export const mockLogin = async (email: string, password: string) => {
  try {
    const mockUser = {
      id: 'mock-user-id',
      email: email,
      app_metadata: {},
      user_metadata: { full_name: 'Usuário Teste' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    // Armazenar credenciais fictícias no AsyncStorage
    await AsyncStorage.setItem(
      'supabase.auth.token',
      JSON.stringify({
        currentSession: {
          access_token: 'mock-token',
          user: mockUser,
        },
      }),
    );

    const originalGetUser = supabase.auth.getUser;
    supabase.auth.getUser = async () => {
      return { data: { user: mockUser }, error: null };
    };

    // Retornar os dados mockados
    return { data: { user: mockUser }, error: null };
  } catch (error) {
    console.error('Erro ao criar sessão mockada:', error);
    return { data: null, error };
  }
};

// Mock simples de médicos
export async function mockMedicos() {
  return [
    { id: 1, nome: 'Dr. Mock 1', especialidade: 'Oftalmologista' },
    { id: 2, nome: 'Dr. Mock 2', especialidade: 'Optometrista' },
  ];
}
