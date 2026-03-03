import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/features/staff/domain/entities/staff.dart';
import 'package:agendly_app/features/staff/domain/repositories/staff_repository.dart';
import 'package:agendly_app/features/staff/infrastructure/repositories/staff_repository_impl.dart';
import 'package:agendly_app/features/staff/infrastructure/datasources/staff_datasource_impl.dart';
import 'package:agendly_app/features/shared/infrastructure/services/dio_client.dart';
import 'package:agendly_app/features/shared/infrastructure/services/key_value_storage_service.dart';
import 'package:agendly_app/features/shared/infrastructure/services/key_value_storage_service_impl.dart';

// Provider del Storage Service
final keyValueStorageServiceProvider = Provider<KeyValueStorageService>((ref) {
  return KeyValueStorageServiceImpl();
});

// Provider del Staff Repository
final staffRepositoryProvider = Provider<StaffRepository>((ref) {
  final storageService = ref.watch(keyValueStorageServiceProvider);
  final dioClient = DioClient(storageService);
  final datasource = StaffDatasourceImpl(dioClient.dio);
  return StaffRepositoryImpl(datasource);
});

// Estado del Staff
class StaffState {
  final List<Staff> staff;
  final Staff? selectedStaff;
  final bool isLoading;
  final String? errorMessage;

  StaffState({
    this.staff = const [],
    this.selectedStaff,
    this.isLoading = false,
    this.errorMessage,
  });

  StaffState copyWith({
    List<Staff>? staff,
    Staff? selectedStaff,
    bool? isLoading,
    String? errorMessage,
  }) {
    return StaffState(
      staff: staff ?? this.staff,
      selectedStaff: selectedStaff,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}

// StateNotifier para Staff
class StaffNotifier extends StateNotifier<StaffState> {
  final StaffRepository repository;

  StaffNotifier(this.repository) : super(StaffState()) {
    loadStaff();
  }

  Future<void> loadStaff() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    
    try {
      final staffList = await repository.getAll();
      state = state.copyWith(
        staff: staffList,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> loadStaffById(String id) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    
    try {
      final staff = await repository.getById(id);
      state = state.copyWith(
        selectedStaff: staff,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<bool> createStaff(Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final newStaff = await repository.create(data);
      state = state.copyWith(
        staff: [...state.staff, newStaff],
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
      return false;
    }
  }

  Future<bool> updateStaff(String id, Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final updatedStaff = await repository.update(id, data);
      final updatedList = state.staff.map((staff) {
        return staff.id == id ? updatedStaff : staff;
      }).toList();
      
      state = state.copyWith(
        staff: updatedList,
        selectedStaff: updatedStaff,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
      return false;
    }
  }

  Future<bool> deleteStaff(String id) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await repository.delete(id);
      final updatedList = state.staff.where((staff) => staff.id != id).toList();
      state = state.copyWith(
        staff: updatedList,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
      return false;
    }
  }
}

// Provider del StaffNotifier
final staffProvider = StateNotifierProvider<StaffNotifier, StaffState>((ref) {
  final repository = ref.watch(staffRepositoryProvider);
  return StaffNotifier(repository);
});
