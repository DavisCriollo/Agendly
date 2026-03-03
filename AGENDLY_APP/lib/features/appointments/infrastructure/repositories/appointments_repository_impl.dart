import 'package:dio/dio.dart';
import 'package:agendly_app/features/appointments/domain/entities/appointment.dart';
import 'package:agendly_app/features/appointments/domain/repositories/appointments_repository.dart';
import 'package:agendly_app/features/appointments/infrastructure/datasources/appointments_datasource_impl.dart';

class AppointmentsRepositoryImpl extends AppointmentsRepository {
  final AppointmentsDatasourceImpl datasource;

  AppointmentsRepositoryImpl(Dio dio) : datasource = AppointmentsDatasourceImpl(dio);

  @override
  Future<List<Appointment>> getByBusiness(String businessId) {
    return datasource.getByBusiness(businessId);
  }

  @override
  Future<List<Appointment>> getByDateRange(DateTime startDate, DateTime endDate) {
    return datasource.getByDateRange(startDate, endDate);
  }

  @override
  Future<List<Appointment>> getByDate(DateTime date) {
    return datasource.getByDate(date);
  }

  @override
  Future<List<Appointment>> getByStaff(String staffId) {
    return datasource.getByStaff(staffId);
  }

  @override
  Future<List<Appointment>> getByClient(String clientId) {
    return datasource.getByClient(clientId);
  }

  @override
  Future<Appointment> getById(String id) {
    return datasource.getById(id);
  }

  @override
  Future<Appointment> create(Map<String, dynamic> data) {
    return datasource.create(data);
  }

  @override
  Future<Appointment> update(String id, Map<String, dynamic> data) {
    return datasource.update(id, data);
  }

  @override
  Future<Appointment> updateStatus(String id, String status) {
    return datasource.updateStatus(id, status);
  }

  @override
  Future<void> cancel(String id, String reason) {
    return datasource.cancel(id, reason);
  }

  @override
  Future<void> delete(String id) {
    return datasource.delete(id);
  }
}
