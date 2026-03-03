import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/features/services/domain/entities/service.dart';
import 'package:agendly_app/features/services/infrastructure/repositories/services_repository_impl.dart';
import 'package:agendly_app/features/shared/infrastructure/services/dio_client.dart';

final servicesRepositoryProvider = Provider((ref) {
  final dio = ref.watch(dioProvider);
  return ServicesRepositoryImpl(dio);
});

final servicesProvider = StateNotifierProvider<ServicesNotifier, ServicesState>((ref) {
  final repository = ref.watch(servicesRepositoryProvider);
  return ServicesNotifier(repository);
});

class ServicesState {
  final List<Service> services;
  final bool isLoading;
  final String? errorMessage;
  final Service? selectedService;

  ServicesState({
    this.services = const [],
    this.isLoading = false,
    this.errorMessage,
    this.selectedService,
  });

  ServicesState copyWith({
    List<Service>? services,
    bool? isLoading,
    String? errorMessage,
    Service? selectedService,
  }) {
    return ServicesState(
      services: services ?? this.services,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      selectedService: selectedService,
    );
  }
}

class ServicesNotifier extends StateNotifier<ServicesState> {
  final ServicesRepositoryImpl repository;

  ServicesNotifier(this.repository) : super(ServicesState());

  Future<void> loadServices() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final services = await repository.getByBusiness('');
      state = state.copyWith(services: services, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> loadServiceById(String serviceId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final service = await repository.getById(serviceId);
      state = state.copyWith(
        selectedService: service,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<bool> createService(Map<String, dynamic> serviceData) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final newService = await repository.create(serviceData);
      state = state.copyWith(
        services: [...state.services, newService],
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

  Future<bool> updateService(String serviceId, Map<String, dynamic> serviceData) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final updatedService = await repository.update(serviceId, serviceData);
      final updatedServices = state.services.map((service) {
        return service.id == serviceId ? updatedService : service;
      }).toList();
      
      state = state.copyWith(
        services: updatedServices,
        selectedService: updatedService,
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

  Future<bool> deleteService(String serviceId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await repository.delete(serviceId);
      final updatedServices = state.services.where((service) => service.id != serviceId).toList();
      state = state.copyWith(
        services: updatedServices,
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

  void clearSelectedService() {
    state = state.copyWith(selectedService: null);
  }
}
