import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:agendly_app/features/shared/infrastructure/services/key_value_storage_service.dart';

class KeyValueStorageServiceImpl extends KeyValueStorageService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  @override
  Future<T?> getValue<T>(String key) async {
    final value = await _storage.read(key: key);
    if (value == null) return null;
    
    // Convertir según el tipo
    if (T == String) return value as T;
    if (T == int) return int.parse(value) as T;
    if (T == double) return double.parse(value) as T;
    if (T == bool) return (value == 'true') as T;
    
    return value as T;
  }

  @override
  Future<bool> removeKey(String key) async {
    try {
      await _storage.delete(key: key);
      return true;
    } catch (e) {
      return false;
    }
  }

  @override
  Future<void> setKeyValue<T>(String key, T value) async {
    await _storage.write(key: key, value: value.toString());
  }

  @override
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
