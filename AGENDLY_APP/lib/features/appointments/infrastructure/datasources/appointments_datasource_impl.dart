import 'package:dio/dio.dart';
import 'package:agendly_app/features/appointments/domain/datasources/appointments_datasource.dart';
import 'package:agendly_app/features/appointments/domain/entities/appointment.dart';
import 'package:agendly_app/features/appointments/infrastructure/mappers/appointment_mapper.dart';

class AppointmentsDatasourceImpl extends AppointmentsDatasource {
  final Dio dio;

  AppointmentsDatasourceImpl(this.dio);

  @override
  Future<List<Appointment>> getByBusiness(String businessId) async {
    try {
      final response = await dio.get('/appointments');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final List appointmentsList = data['data'] ?? [];
          return appointmentsList.map((json) => AppointmentMapper.fromJson(json)).toList();
        }
      }
      
      throw Exception('Error al obtener citas');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<List<Appointment>> getByDateRange(DateTime startDate, DateTime endDate) async {
    try {
      final response = await dio.get('/appointments/date-range', queryParameters: {
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
      });
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final List appointmentsList = data['data'] ?? [];
          return appointmentsList.map((json) => AppointmentMapper.fromJson(json)).toList();
        }
      }
      
      throw Exception('Error al obtener citas por rango de fechas');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<List<Appointment>> getByDate(DateTime date) async {
    try {
      final startOfDay = DateTime(date.year, date.month, date.day);
      final endOfDay = DateTime(date.year, date.month, date.day, 23, 59, 59);
      return getByDateRange(startOfDay, endOfDay);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  @override
  Future<List<Appointment>> getByStaff(String staffId) async {
    try {
      final response = await dio.get('/appointments/staff/$staffId');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final List appointmentsList = data['data'] ?? [];
          return appointmentsList.map((json) => AppointmentMapper.fromJson(json)).toList();
        }
      }
      
      throw Exception('Error al obtener citas del staff');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<List<Appointment>> getByClient(String clientId) async {
    try {
      final response = await dio.get('/appointments/client/$clientId');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final List appointmentsList = data['data'] ?? [];
          return appointmentsList.map((json) => AppointmentMapper.fromJson(json)).toList();
        }
      }
      
      throw Exception('Error al obtener citas del cliente');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Appointment> getById(String id) async {
    try {
      final response = await dio.get('/appointments/$id');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return AppointmentMapper.fromJson(data['data']);
        }
      }
      
      throw Exception('Error al obtener cita');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Appointment> create(Map<String, dynamic> data) async {
    try {
      final response = await dio.post('/appointments', data: data);
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = response.data;
        if (responseData['success'] == true) {
          return AppointmentMapper.fromJson(responseData['data']);
        }
      }
      
      throw Exception('Error al crear cita');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Appointment> update(String id, Map<String, dynamic> data) async {
    try {
      final response = await dio.put('/appointments/$id', data: data);
      
      if (response.statusCode == 200) {
        final responseData = response.data;
        if (responseData['success'] == true) {
          return AppointmentMapper.fromJson(responseData['data']);
        }
      }
      
      throw Exception('Error al actualizar cita');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Appointment> updateStatus(String id, String status) async {
    try {
      final response = await dio.patch('/appointments/$id/status', data: {'status': status});
      
      if (response.statusCode == 200) {
        final responseData = response.data;
        if (responseData['success'] == true) {
          return AppointmentMapper.fromJson(responseData['data']);
        }
      }
      
      throw Exception('Error al actualizar estado de cita');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<void> cancel(String id, String reason) async {
    try {
      final response = await dio.post('/appointments/$id/cancel', data: {'reason': reason});
      
      if (response.statusCode != 200) {
        throw Exception('Error al cancelar cita');
      }
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<void> delete(String id) async {
    try {
      final response = await dio.delete('/appointments/$id');
      
      if (response.statusCode != 200) {
        throw Exception('Error al eliminar cita');
      }
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }
}
