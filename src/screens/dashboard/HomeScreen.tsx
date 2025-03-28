import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import colors from '../../styles/colors';
import { supabase } from '../../../supabase/supabaseClient';
import AppointmentCard from '../../components/appointment/AppointmentCard';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchAppointments();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserName(data.full_name || 'Paciente');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Buscar próximas consultas
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', user.id)
          .gt('appointment_date', new Date().toISOString())
          .order('appointment_date', { ascending: true })
          .limit(3);

        if (data) {
          setUpcomingAppointments(data);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {userName}</Text>
          <Text style={styles.subtitle}>
            Bem-vindo(a) ao seu painel de saúde ocular
          </Text>
        </View>

        {/* Próximas Consultas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas Consultas</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Appointments')}
            >
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onPress={() =>
                  navigation.navigate('AppointmentDetails', {
                    id: appointment.id,
                  })
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Você não tem consultas agendadas.
              </Text>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={() => navigation.navigate('ScheduleAppointment')}
              >
                <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Saúde Visual - Pode ser expandido depois */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sua Saúde Visual</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dicas para cuidar da sua visão</Text>
            <Text style={styles.cardText}>
              Faça pausas durante o uso de telas, mantenha uma boa iluminação ao
              ler e proteja seus olhos da luz solar direta.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  scheduleButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.primary,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
});
