import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/features/clients/domain/entities/client.dart';
import 'package:agendly_app/features/clients/infrastructure/repositories/clients_repository_impl.dart';
import 'package:agendly_app/features/shared/infrastructure/services/dio_client.dart';

final clientsRepositoryProvider = Provider((ref) {
  final dio = ref.watch(dioProvider);
  return ClientsRepositoryImpl(dio);
});

final clientsProvider = StateNotifierProvider<ClientsNotifier, ClientsState>((ref) {
  final repository = ref.watch(clientsRepositoryProvider);
  return ClientsNotifier(repository);
});

class ClientsState {
  final List<Client> clients;
  final bool isLoading;
  final String? errorMessage;
  final Client? selectedClient;

  ClientsState({
    this.clients = const [],
    this.isLoading = false,
    this.errorMessage,
    this.selectedClient,
  });

  ClientsState copyWith({
    List<Client>? clients,
    bool? isLoading,
    String? errorMessage,
    Client? selectedClient,
  }) {
    return ClientsState(
      clients: clients ?? this.clients,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      selectedClient: selectedClient,
    );
  }
}

class ClientsNotifier extends StateNotifier<ClientsState> {
  final ClientsRepositoryImpl repository;

  ClientsNotifier(this.repository) : super(ClientsState());

  Future<void> loadClients() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final clients = await repository.getByBusiness('');
      state = state.copyWith(clients: clients, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> searchClients(String query) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final clients = await repository.search(query);
      state = state.copyWith(clients: clients, isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> loadClientById(String clientId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final client = await repository.getById(clientId);
      state = state.copyWith(
        selectedClient: client,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<bool> createClient(Map<String, dynamic> clientData) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final newClient = await repository.create(clientData);
      state = state.copyWith(
        clients: [...state.clients, newClient],
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

  Future<bool> updateClient(String clientId, Map<String, dynamic> clientData) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final updatedClient = await repository.update(clientId, clientData);
      final updatedClients = state.clients.map((client) {
        return client.id == clientId ? updatedClient : client;
      }).toList();
      
      state = state.copyWith(
        clients: updatedClients,
        selectedClient: updatedClient,
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

  Future<bool> deleteClient(String clientId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await repository.delete(clientId);
      final updatedClients = state.clients.where((client) => client.id != clientId).toList();
      state = state.copyWith(
        clients: updatedClients,
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

  void clearSelectedClient() {
    state = state.copyWith(selectedClient: null);
  }
}
