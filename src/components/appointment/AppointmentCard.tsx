import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../styles/colors';

// Tipo para estrutura de dados da consulta
type Appointment = {
  id: string;
  appointment_date: string;
  doctor_name: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  location?: string;
};

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
}

export default function AppointmentCard({
  appointment,
  onPress,
}: AppointmentCardProps) {
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const getAppointmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'consulta':
        return 'eye-outline';
      case 'exame':
        return 'file-document-outline';
      case 'retorno':
        return 'calendar-check';
      default:
        return 'calendar';
    }
  };

  // Escolher cor com base no status da consulta
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmado':
        return '#4CAF50'; // verde
      case 'pendente':
        return '#FF9800'; // laranja
      case 'cancelado':
        return '#F44336'; // vermelho
      default:
        return '#9E9E9E'; // cinza
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={getAppointmentIcon(appointment.appointment_type)}
          size={24}
          color={colors.primary}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.doctorName}>{appointment.doctor_name}</Text>
        <Text style={styles.appointmentType}>
          {appointment.appointment_type}
        </Text>
        <View style={styles.dateTimeContainer}>
          <MaterialCommunityIcons name="calendar" size={14} color="#666" />
          <Text style={styles.dateTime}>
            {formatDate(appointment.appointment_date)} às{' '}
            {appointment.appointment_time}
          </Text>
        </View>

        {appointment.location && (
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
            <Text style={styles.location}>{appointment.location}</Text>
          </View>
        )}
      </View>

      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(appointment.status) },
          ]}
        />
        <Text style={styles.statusText}>{appointment.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
});
