import 'package:agendly_app/features/staff/domain/entities/staff.dart';

abstract class StaffDatasource {
  Future<List<Staff>> getAll();
  Future<Staff> getById(String id);
  Future<Staff> create(Map<String, dynamic> data);
  Future<Staff> update(String id, Map<String, dynamic> data);
  Future<void> delete(String id);
}
