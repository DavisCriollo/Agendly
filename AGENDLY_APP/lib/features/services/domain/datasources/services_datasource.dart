import 'package:agendly_app/features/services/domain/entities/service.dart';

abstract class ServicesDatasource {
  Future<List<Service>> getAll();
  Future<List<Service>> getByBusiness(String businessId);
  Future<Service> getById(String id);
  Future<Service> create(Map<String, dynamic> data);
  Future<Service> update(String id, Map<String, dynamic> data);
  Future<void> delete(String id);
}
