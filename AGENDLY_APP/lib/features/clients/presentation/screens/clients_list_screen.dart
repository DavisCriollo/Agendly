import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/helpers/responsive.dart';
import 'package:agendly_app/config/widgets/custom_text.dart';
import 'package:agendly_app/features/clients/presentation/providers/clients_provider.dart';
import 'package:agendly_app/features/clients/presentation/screens/client_form_screen.dart';

class ClientsListScreen extends ConsumerStatefulWidget {
  const ClientsListScreen({super.key});

  @override
  ConsumerState<ClientsListScreen> createState() => _ClientsListScreenState();
}

class _ClientsListScreenState extends ConsumerState<ClientsListScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(clientsProvider.notifier).loadClients());
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String query) {
    if (query.isEmpty) {
      ref.read(clientsProvider.notifier).loadClients();
    } else {
      ref.read(clientsProvider.notifier).searchClients(query);
    }
  }

  @override
  Widget build(BuildContext context) {
    final clientsState = ref.watch(clientsProvider);
    final responsive = Responsive.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Clientes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ClientFormScreen(),
                ),
              ).then((_) => ref.read(clientsProvider.notifier).loadClients());
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(responsive.iScreen(2)),
            child: TextField(
              controller: _searchController,
              style: TextStyle(fontSize: responsive.iScreen(1.4)),
              decoration: InputDecoration(
                hintText: 'Buscar cliente...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _onSearch('');
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(responsive.iScreen(1.5)),
                ),
              ),
              onChanged: _onSearch,
            ),
          ),
          Expanded(
            child: clientsState.isLoading
                ? const Center(child: CircularProgressIndicator())
                : clientsState.errorMessage != null
                    ? Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(horizontal: responsive.wScreen(4)),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.error_outline, size: responsive.iScreen(8), color: Colors.red),
                              SizedBox(height: responsive.hScreen(2)),
                              CustomText(
                                text: 'Error: ${clientsState.errorMessage}',
                                fontSize: responsive.iScreen(1.4),
                                textAlign: TextAlign.center,
                              ),
                              SizedBox(height: responsive.hScreen(2)),
                              ElevatedButton(
                                onPressed: () => ref.read(clientsProvider.notifier).loadClients(),
                                child: CustomText(text: 'Reintentar', fontSize: responsive.iScreen(1.4)),
                              ),
                            ],
                          ),
                        ),
                      )
                    : clientsState.clients.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.people_outline, size: responsive.iScreen(8), color: Colors.grey),
                                SizedBox(height: responsive.hScreen(2)),
                                CustomText.subtitle(
                                  text: 'No hay clientes registrados',
                                  fontSize: responsive.iScreen(1.6),
                                  color: Colors.grey,
                                ),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: () async {
                              await ref.read(clientsProvider.notifier).loadClients();
                            },
                            child: ListView.builder(
                              padding: EdgeInsets.symmetric(horizontal: responsive.wScreen(2)),
                              itemCount: clientsState.clients.length,
                              itemBuilder: (context, index) {
                                final client = clientsState.clients[index];
                                return Card(
                                  margin: EdgeInsets.only(bottom: responsive.hScreen(1.5)),
                                  child: ListTile(
                                    leading: CircleAvatar(
                                      backgroundColor: Theme.of(context).primaryColor,
                                      radius: responsive.iScreen(3),
                                      child: Text(
                                        client.name[0].toUpperCase(),
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: responsive.iScreen(1.6),
                                        ),
                                      ),
                                    ),
                                    title: CustomText.title(
                                      text: client.name,
                                      fontSize: responsive.iScreen(1.4),
                                      color: null,
                                    ),
                                    subtitle: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        CustomText.subtitle(
                                          text: client.email,
                                          fontSize: responsive.iScreen(1.2),
                                        ),
                                        if (client.phone != null) ...[
                                          SizedBox(height: responsive.hScreen(0.5)),
                                          CustomText.subtitle(
                                            text: client.phone!,
                                            fontSize: responsive.iScreen(1.2),
                                          ),
                                        ],
                                      ],
                                    ),
                                    trailing: Icon(
                                      client.isActive ? Icons.check_circle : Icons.cancel,
                                      color: client.isActive ? Colors.green : Colors.red,
                                      size: responsive.iScreen(3),
                                    ),
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => ClientFormScreen(clientId: client.id),
                                        ),
                                      ).then((_) => ref.read(clientsProvider.notifier).loadClients());
                                    },
                                  ),
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}
