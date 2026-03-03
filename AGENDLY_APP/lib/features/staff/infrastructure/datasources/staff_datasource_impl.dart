import 'package:dio/dio.dart';
import 'package:agendly_app/features/staff/domain/datasources/staff_datasource.dart';
import 'package:agendly_app/features/staff/domain/entities/staff.dart';
import 'package:agendly_app/features/staff/infrastructure/mappers/staff_mapper.dart';

class StaffDatasourceImpl extends StaffDatasource {
  final Dio dio;

  StaffDatasourceImpl(this.dio);

  @override
  Future<List<Staff>> getAll() async {
    try {
      final response = await dio.get('/staff');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final List staffList = data['data'] ?? [];
          return staffList.map((json) => StaffMapper.fromJson(json)).toList();
        }
      }
      
      throw Exception('Error al obtener staff');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Staff> getById(String id) async {
    try {
      final response = await dio.get('/staff/$id');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return StaffMapper.fromJson(data['data']);
        }
      }
      
      throw Exception('Error al obtener staff');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Staff> create(Map<String, dynamic> data) async {
    try {
      final response = await dio.post('/staff', data: data);
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = response.data;
        if (responseData['success'] == true) {
          return StaffMapper.fromJson(responseData['data']);
        }
      }
      
      throw Exception('Error al crear staff');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Staff> update(String id, Map<String, dynamic> data) async {
    try {
      final response = await dio.put('/staff/$id', data: data);
      
      if (response.statusCode == 200) {
        final responseData = response.data;
        if (responseData['success'] == true) {
          return StaffMapper.fromJson(responseData['data']);
        }
      }
      
      throw Exception('Error al actualizar staff');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<void> delete(String id) async {
    try {
      final response = await dio.delete('/staff/$id');
      
      if (response.statusCode != 200) {
        throw Exception('Error al eliminar staff');
      }
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }
}
