import 'package:dio/dio.dart';
import 'package:agendly_app/features/services/domain/datasources/services_datasource.dart';
import 'package:agendly_app/features/services/domain/entities/service.dart';
import 'package:agendly_app/features/services/infrastructure/mappers/service_mapper.dart';

class ServicesDatasourceImpl extends ServicesDatasource {
  final Dio dio;

  ServicesDatasourceImpl(this.dio);

  @override
  Future<List<Service>> getAll() async {
    try {
      final response = await dio.get('/services');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final List servicesList = data['data'] ?? [];
          return servicesList.map((json) => ServiceMapper.fromJson(json)).toList();
        }
      }
      
      throw Exception('Error al obtener servicios');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<List<Service>> getByBusiness(String businessId) async {
    return getAll();
  }

  @override
  Future<Service> getById(String id) async {
    try {
      final response = await dio.get('/services/$id');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return ServiceMapper.fromJson(data['data']);
        }
      }
      
      throw Exception('Error al obtener servicio');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Service> create(Map<String, dynamic> data) async {
    try {
      final response = await dio.post('/services', data: data);
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = response.data;
        if (responseData['success'] == true) {
          return ServiceMapper.fromJson(responseData['data']);
        }
      }
      
      throw Exception('Error al crear servicio');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Service> update(String id, Map<String, dynamic> data) async {
    try {
      final response = await dio.put('/services/$id', data: data);
      
      if (response.statusCode == 200) {
        final responseData = response.data;
        if (responseData['success'] == true) {
          return ServiceMapper.fromJson(responseData['data']);
        }
      }
      
      throw Exception('Error al actualizar servicio');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<void> delete(String id) async {
    try {
      final response = await dio.delete('/services/$id');
      
      if (response.statusCode != 200) {
        throw Exception('Error al eliminar servicio');
      }
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }
}
