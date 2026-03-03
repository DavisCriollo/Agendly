import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/helpers/responsive.dart';
import 'package:agendly_app/features/clients/presentation/providers/clients_provider.dart';

class ClientFormScreen extends ConsumerStatefulWidget {
  final String? clientId;

  const ClientFormScreen({super.key, this.clientId});

  @override
  ConsumerState<ClientFormScreen> createState() => _ClientFormScreenState();
}

class _ClientFormScreenState extends ConsumerState<ClientFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _isActive = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.clientId != null) {
      Future.microtask(() => _loadClient());
    }
  }

  Future<void> _loadClient() async {
    await ref.read(clientsProvider.notifier).loadClientById(widget.clientId!);
    final client = ref.read(clientsProvider).selectedClient;
    if (client != null) {
      _nameController.text = client.name;
      _emailController.text = client.email;
      _phoneController.text = client.phone ?? '';
      _isActive = client.isActive;
      setState(() {});
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _saveClient() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final data = {
      'name': _nameController.text.trim(),
      'email': _emailController.text.trim(),
      'phone': _phoneController.text.trim(),
      'isActive': _isActive,
    };

    bool success;
    if (widget.clientId != null) {
      success = await ref.read(clientsProvider.notifier).updateClient(widget.clientId!, data);
    } else {
      success = await ref.read(clientsProvider.notifier).createClient(data);
    }

    setState(() => _isLoading = false);

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(widget.clientId != null ? 'Cliente actualizado' : 'Cliente creado'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pop(context);
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error al guardar'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final responsive = Responsive.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.clientId != null ? 'Editar Cliente' : 'Nuevo Cliente'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(responsive.iScreen(2)),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      controller: _nameController,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Nombre completo',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.person),
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'El nombre es requerido';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    TextFormField(
                      controller: _emailController,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.email),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'El email es requerido';
                        }
                        if (!value.contains('@')) {
                          return 'Email inválido';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    TextFormField(
                      controller: _phoneController,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Teléfono',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.phone),
                      ),
                      keyboardType: TextInputType.phone,
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    SwitchListTile(
                      title: Text('Activo', style: TextStyle(fontSize: responsive.iScreen(1.4))),
                      value: _isActive,
                      onChanged: (value) {
                        setState(() => _isActive = value);
                      },
                    ),
                    SizedBox(height: responsive.hScreen(3)),
                    SizedBox(
                      width: double.infinity,
                      height: responsive.hScreen(6),
                      child: ElevatedButton(
                        onPressed: _saveClient,
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(responsive.iScreen(1.5)),
                          ),
                        ),
                        child: Text(
                          widget.clientId != null ? 'Actualizar' : 'Crear',
                          style: TextStyle(fontSize: responsive.iScreen(1.6)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
