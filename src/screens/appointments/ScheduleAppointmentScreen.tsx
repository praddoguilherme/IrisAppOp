import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import colors from '../../styles/colors';
import { supabase } from '../../../supabase/supabaseClient';

export default function ScheduleAppointmentScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('consulta');
  const [notes, setNotes] = useState('');
  const [availableTimes, setAvailableTimes] = useState([
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
  ]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialty')
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        setDoctors(data);
        setSelectedDoctor(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de médicos.');
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const handleScheduleAppointment = async () => {
    if (!selectedDoctor || !selectedTime || !selectedType) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Usuário não autenticado');

      const doctor = doctors.find((doc) => doc.id === selectedDoctor);
      const doctorName = doctor ? doctor.name : 'Médico não especificado';

      const formattedDate = selectedDate.toISOString().split('T')[0];

      const { data, error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        doctor_id: selectedDoctor,
        doctor_name: doctorName,
        appointment_date: formattedDate,
        appointment_time: selectedTime,
        appointment_type: selectedType,
        status: 'pendente',
        notes: notes,
        location: 'Clínica Íris Oftalmologia - Centro',
      });

      if (error) throw error;

      Alert.alert(
        'Sucesso',
        'Consulta agendada com sucesso! Aguarde a confirmação.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      Alert.alert(
        'Erro',
        'Não foi possível agendar a consulta. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Consulta</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Seleção de Médico */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Médico*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDoctor}
              onValueChange={(itemValue) => setSelectedDoctor(itemValue)}
              style={styles.picker}
            >
              {doctors.map((doctor) => (
                <Picker.Item
                  key={doctor.id}
                  label={`Dr. ${doctor.name} - ${doctor.specialty}`}
                  value={doctor.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Seleção de Data */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Data*</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formatDate(selectedDate)}</Text>
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Seleção de Horário */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Horário*</Text>
          <View style={styles.timeGrid}>
            {availableTimes.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  selectedTime === time && styles.selectedTimeButton,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    selectedTime === time && styles.selectedTimeButtonText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tipo de Consulta */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de Consulta*</Text>
          <View style={styles.typeButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'consulta' && styles.selectedTypeButton,
              ]}
              onPress={() => setSelectedType('consulta')}
            >
              <MaterialCommunityIcons
                name="eye-outline"
                size={20}
                color={selectedType === 'consulta' ? 'white' : colors.primary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === 'consulta' && styles.selectedTypeButtonText,
                ]}
              >
                Consulta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'retorno' && styles.selectedTypeButton,
              ]}
              onPress={() => setSelectedType('retorno')}
            >
              <MaterialCommunityIcons
                name="calendar-check"
                size={20}
                color={selectedType === 'retorno' ? 'white' : colors.primary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === 'retorno' && styles.selectedTypeButtonText,
                ]}
              >
                Retorno
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'exame' && styles.selectedTypeButton,
              ]}
              onPress={() => setSelectedType('exame')}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={20}
                color={selectedType === 'exame' ? 'white' : colors.primary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === 'exame' && styles.selectedTypeButtonText,
                ]}
              >
                Exame
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Observações */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Informe alguma observação importante (opcional)"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Botão Agendar */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleScheduleAppointment}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.submitButtonText}>Aguarde...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Confirmar Agendamento</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: '30%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedTimeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeButtonText: {
    color: '#444',
  },
  selectedTimeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 6,
  },
  selectedTypeButtonText: {
    color: 'white',
  },
  notesInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
