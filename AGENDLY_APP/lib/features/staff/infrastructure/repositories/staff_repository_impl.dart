import 'package:agendly_app/features/staff/domain/datasources/staff_datasource.dart';
import 'package:agendly_app/features/staff/domain/entities/staff.dart';
import 'package:agendly_app/features/staff/domain/repositories/staff_repository.dart';

class StaffRepositoryImpl extends StaffRepository {
  final StaffDatasource datasource;

  StaffRepositoryImpl(this.datasource);

  @override
  Future<List<Staff>> getAll() {
    return datasource.getAll();
  }

  @override
  Future<Staff> getById(String id) {
    return datasource.getById(id);
  }

  @override
  Future<Staff> create(Map<String, dynamic> data) {
    return datasource.create(data);
  }

  @override
  Future<Staff> update(String id, Map<String, dynamic> data) {
    return datasource.update(id, data);
  }

  @override
  Future<void> delete(String id) {
    return datasource.delete(id);
  }
}
