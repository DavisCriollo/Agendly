import 'package:agendly_app/features/appointments/domain/entities/appointment.dart';

abstract class AppointmentsRepository {
  Future<List<Appointment>> getByBusiness(String businessId);
  Future<List<Appointment>> getByDateRange(DateTime startDate, DateTime endDate);
  Future<List<Appointment>> getByDate(DateTime date);
  Future<List<Appointment>> getByStaff(String staffId);
  Future<List<Appointment>> getByClient(String clientId);
  Future<Appointment> getById(String id);
  Future<Appointment> create(Map<String, dynamic> data);
  Future<Appointment> update(String id, Map<String, dynamic> data);
  Future<Appointment> updateStatus(String id, String status);
  Future<void> cancel(String id, String reason);
  Future<void> delete(String id);
}
