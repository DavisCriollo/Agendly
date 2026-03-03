import 'package:dio/dio.dart';
import 'package:agendly_app/features/clients/domain/datasources/clients_datasource.dart';
import 'package:agendly_app/features/clients/domain/entities/client.dart';
import 'package:agendly_app/features/clients/infrastructure/mappers/client_mapper.dart';

class ClientsDatasourceImpl extends ClientsDatasource {
  final Dio dio;

  ClientsDatasourceImpl(this.dio);

  @override
  Future<List<Client>> getByBusiness(String businessId) async {
    try {
      final response = await dio.get('/clients/business/$businessId');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final List clientsList = data['data'] ?? [];
          return clientsList.map((json) => ClientMapper.fromJson(json)).toList();
        }
      }
      
      throw Exception('Error al obtener clientes');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Client> getById(String id) async {
    try {
      final response = await dio.get('/clients/$id');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return ClientMapper.fromJson(data['data']);
        }
      }
      
      throw Exception('Error al obtener cliente');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Client> create(Map<String, dynamic> data) async {
    try {
      final response = await dio.post('/clients', data: data);
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = response.data;
        if (responseData['success'] == true) {
          return ClientMapper.fromJson(responseData['data']);
        }
      }
      
      throw Exception('Error al crear cliente');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Client> update(String id, Map<String, dynamic> data) async {
    try {
      final response = await dio.put('/clients/$id', data: data);
      
      if (response.statusCode == 200) {
        final responseData = response.data;
        if (responseData['success'] == true) {
          return ClientMapper.fromJson(responseData['data']);
        }
      }
      
      throw Exception('Error al actualizar cliente');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<void> delete(String id) async {
    try {
      final response = await dio.delete('/clients/$id');
      
      if (response.statusCode != 200) {
        throw Exception('Error al eliminar cliente');
      }
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<List<Client>> search(String query) async {
    try {
      final response = await dio.get('/clients/search', queryParameters: {'q': query});
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final List clientsList = data['data'] ?? [];
          return clientsList.map((json) => ClientMapper.fromJson(json)).toList();
        }
      }
      
      throw Exception('Error al buscar clientes');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }
}
