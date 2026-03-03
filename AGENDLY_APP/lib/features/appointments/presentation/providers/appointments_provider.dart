import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/features/appointments/domain/entities/appointment.dart';
import 'package:agendly_app/features/appointments/infrastructure/repositories/appointments_repository_impl.dart';
import 'package:agendly_app/features/shared/infrastructure/services/dio_client.dart';

final appointmentsRepositoryProvider = Provider((ref) {
  final dio = ref.watch(dioProvider);
  return AppointmentsRepositoryImpl(dio);
});

final appointmentsProvider = StateNotifierProvider<AppointmentsNotifier, AppointmentsState>((ref) {
  final repository = ref.watch(appointmentsRepositoryProvider);
  return AppointmentsNotifier(repository);
});

class AppointmentsState {
  final List<Appointment> appointments;
  final bool isLoading;
  final String? errorMessage;
  final Appointment? selectedAppointment;
  final DateTime? selectedDate;

  AppointmentsState({
    this.appointments = const [],
    this.isLoading = false,
    this.errorMessage,
    this.selectedAppointment,
    this.selectedDate,
  });

  AppointmentsState copyWith({
    List<Appointment>? appointments,
    bool? isLoading,
    String? errorMessage,
    Appointment? selectedAppointment,
    DateTime? selectedDate,
  }) {
    return AppointmentsState(
      appointments: appointments ?? this.appointments,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      selectedAppointment: selectedAppointment,
      selectedDate: selectedDate ?? this.selectedDate,
    );
  }
}

class AppointmentsNotifier extends StateNotifier<AppointmentsState> {
  final AppointmentsRepositoryImpl repository;

  AppointmentsNotifier(this.repository) : super(AppointmentsState());

  Future<void> loadAppointments() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final appointments = await repository.getByBusiness('');
      state = state.copyWith(appointments: appointments, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> loadAppointmentsByDate(DateTime date) async {
    state = state.copyWith(isLoading: true, errorMessage: null, selectedDate: date);
    try {
      final appointments = await repository.getByDate(date);
      state = state.copyWith(appointments: appointments, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> loadAppointmentsByStaff(String staffId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final appointments = await repository.getByStaff(staffId);
      state = state.copyWith(appointments: appointments, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> loadAppointmentsByClient(String clientId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final appointments = await repository.getByClient(clientId);
      state = state.copyWith(appointments: appointments, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> loadAppointmentById(String appointmentId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final appointment = await repository.getById(appointmentId);
      state = state.copyWith(
        selectedAppointment: appointment,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<bool> createAppointment(Map<String, dynamic> appointmentData) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final newAppointment = await repository.create(appointmentData);
      state = state.copyWith(
        appointments: [...state.appointments, newAppointment],
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
      return false;
    }
  }

  Future<bool> updateAppointment(String appointmentId, Map<String, dynamic> appointmentData) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final updatedAppointment = await repository.update(appointmentId, appointmentData);
      final updatedAppointments = state.appointments.map((appointment) {
        return appointment.id == appointmentId ? updatedAppointment : appointment;
      }).toList();
      
      state = state.copyWith(
        appointments: updatedAppointments,
        selectedAppointment: updatedAppointment,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
      return false;
    }
  }

  Future<bool> updateAppointmentStatus(String appointmentId, String status) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final updatedAppointment = await repository.updateStatus(appointmentId, status);
      final updatedAppointments = state.appointments.map((appointment) {
        return appointment.id == appointmentId ? updatedAppointment : appointment;
      }).toList();
      
      state = state.copyWith(
        appointments: updatedAppointments,
        selectedAppointment: updatedAppointment,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
      return false;
    }
  }

  Future<bool> deleteAppointment(String appointmentId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await repository.delete(appointmentId);
      final updatedAppointments = state.appointments.where((appointment) => appointment.id != appointmentId).toList();
      state = state.copyWith(
        appointments: updatedAppointments,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
      return false;
    }
  }

  void clearSelectedAppointment() {
    state = state.copyWith(selectedAppointment: null);
  }

  void setSelectedDate(DateTime date) {
    state = state.copyWith(selectedDate: date);
  }
}
