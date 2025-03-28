import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import { supabase, mockMedicos } from '../../../supabase/supabaseClient';
import AppointmentCard from '../../components/appointment/AppointmentCard';

type Appointment = {
  id: string;
  appointment_date: string;
  doctor_name: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  location?: string;
};

type Medico = {
  id: number;
  nome: string;
  especialidade: string;
};

type AppointmentScreenProps = {
  navigation: any; //
};

export default function AppointmentScreen({
  navigation,
}: AppointmentScreenProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    fetchAppointments();
    fetchMedicos();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchAppointments();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchAppointments = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', user.id)
          .order('appointment_date', { ascending: true });

        if (error) throw error;
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicos = async () => {
    try {
      const data = await mockMedicos();
      setMedicos(data);
    } catch (err) {
      console.error('Erro ao buscar médicos:', err);
    }
  };

  const filteredAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);

      if (activeTab === 'upcoming') {
        return (
          appointmentDate >= today &&
          appointment.status.toLowerCase() !== 'cancelado'
        );
      } else if (activeTab === 'past') {
        return (
          appointmentDate < today ||
          appointment.status.toLowerCase() === 'cancelado'
        );
      }

      return true;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Minhas Consultas</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('ScheduleAppointment')}
          >
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' && styles.activeTabText,
              ]}
            >
              Próximas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'past' && styles.activeTabText,
              ]}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <Text>Carregando...</Text>
          </View>
        ) : filteredAppointments().length > 0 ? (
          <FlatList
            data={filteredAppointments()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AppointmentCard
                appointment={item}
                onPress={() =>
                  navigation.navigate('AppointmentDetails', { id: item.id })
                }
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={64}
              color="#ccc"
            />
            <Text style={styles.emptyText}>
              {activeTab === 'upcoming'
                ? 'Você não tem consultas agendadas.'
                : 'Não há histórico de consultas.'}
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={() => navigation.navigate('ScheduleAppointment')}
              >
                <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Lista de Médicos */}
        <View style={styles.medicosContainer}>
          <Text style={styles.medicosTitle}>Médicos Disponíveis</Text>
          {medicos.map((med) => (
            <Text key={med.id} style={styles.medicoName}>
              {med.nome}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  listContent: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  medicosContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  medicosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  medicoName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
});
