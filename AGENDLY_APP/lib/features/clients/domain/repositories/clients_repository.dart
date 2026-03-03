import 'package:agendly_app/features/clients/domain/entities/client.dart';

abstract class ClientsRepository {
  Future<List<Client>> getByBusiness(String businessId);
  Future<List<Client>> search(String query);
  Future<Client> getById(String id);
  Future<Client> create(Map<String, dynamic> data);
  Future<Client> update(String id, Map<String, dynamic> data);
  Future<void> delete(String id);
}
