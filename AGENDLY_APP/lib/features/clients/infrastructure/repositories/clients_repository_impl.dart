import 'package:dio/dio.dart';
import 'package:agendly_app/features/clients/domain/entities/client.dart';
import 'package:agendly_app/features/clients/domain/repositories/clients_repository.dart';
import 'package:agendly_app/features/clients/infrastructure/datasources/clients_datasource_impl.dart';

class ClientsRepositoryImpl extends ClientsRepository {
  final ClientsDatasourceImpl datasource;

  ClientsRepositoryImpl(Dio dio) : datasource = ClientsDatasourceImpl(dio);

  @override
  Future<List<Client>> getByBusiness(String businessId) {
    return datasource.getByBusiness(businessId);
  }

  @override
  Future<List<Client>> search(String query) {
    return datasource.search(query);
  }

  @override
  Future<Client> getById(String id) {
    return datasource.getById(id);
  }

  @override
  Future<Client> create(Map<String, dynamic> data) {
    return datasource.create(data);
  }

  @override
  Future<Client> update(String id, Map<String, dynamic> data) {
    return datasource.update(id, data);
  }

  @override
  Future<void> delete(String id) {
    return datasource.delete(id);
  }
}
