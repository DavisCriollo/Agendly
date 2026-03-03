import 'package:dio/dio.dart';
import 'package:agendly_app/features/services/domain/entities/service.dart';
import 'package:agendly_app/features/services/domain/repositories/services_repository.dart';
import 'package:agendly_app/features/services/infrastructure/datasources/services_datasource_impl.dart';

class ServicesRepositoryImpl extends ServicesRepository {
  final ServicesDatasourceImpl datasource;

  ServicesRepositoryImpl(Dio dio) : datasource = ServicesDatasourceImpl(dio);

  @override
  Future<List<Service>> getAll() {
    return datasource.getAll();
  }

  @override
  Future<List<Service>> getByBusiness(String businessId) {
    return datasource.getByBusiness(businessId);
  }

  @override
  Future<Service> getById(String id) {
    return datasource.getById(id);
  }

  @override
  Future<Service> create(Map<String, dynamic> data) {
    return datasource.create(data);
  }

  @override
  Future<Service> update(String id, Map<String, dynamic> data) {
    return datasource.update(id, data);
  }

  @override
  Future<void> delete(String id) {
    return datasource.delete(id);
  }
}
