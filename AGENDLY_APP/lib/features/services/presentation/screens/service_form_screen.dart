import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/helpers/responsive.dart';
import 'package:agendly_app/features/services/presentation/providers/services_provider.dart';

class ServiceFormScreen extends ConsumerStatefulWidget {
  final String? serviceId;

  const ServiceFormScreen({super.key, this.serviceId});

  @override
  ConsumerState<ServiceFormScreen> createState() => _ServiceFormScreenState();
}

class _ServiceFormScreenState extends ConsumerState<ServiceFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _durationController = TextEditingController();
  bool _isActive = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.serviceId != null) {
      Future.microtask(() => _loadService());
    }
  }

  Future<void> _loadService() async {
    await ref.read(servicesProvider.notifier).loadServiceById(widget.serviceId!);
    final service = ref.read(servicesProvider).selectedService;
    if (service != null) {
      _nameController.text = service.name;
      _descriptionController.text = service.description ?? '';
      _priceController.text = service.price.toString();
      _durationController.text = service.duration.toString();
      _isActive = service.isActive;
      setState(() {});
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _durationController.dispose();
    super.dispose();
  }

  Future<void> _saveService() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final data = {
      'name': _nameController.text.trim(),
      'description': _descriptionController.text.trim(),
      'price': double.parse(_priceController.text.trim()),
      'duration': int.parse(_durationController.text.trim()),
      'isActive': _isActive,
    };

    bool success;
    if (widget.serviceId != null) {
      success = await ref.read(servicesProvider.notifier).updateService(widget.serviceId!, data);
    } else {
      success = await ref.read(servicesProvider.notifier).createService(data);
    }

    setState(() => _isLoading = false);

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(widget.serviceId != null ? 'Servicio actualizado' : 'Servicio creado'),
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
        title: Text(widget.serviceId != null ? 'Editar Servicio' : 'Nuevo Servicio'),
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
                        labelText: 'Nombre del servicio',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.medical_services),
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
                      controller: _descriptionController,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Descripción',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.description),
                      ),
                      maxLines: 3,
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    TextFormField(
                      controller: _priceController,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Precio',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.attach_money),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'El precio es requerido';
                        }
                        if (double.tryParse(value) == null) {
                          return 'Precio inválido';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    TextFormField(
                      controller: _durationController,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Duración (minutos)',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.access_time),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'La duración es requerida';
                        }
                        if (int.tryParse(value) == null) {
                          return 'Duración inválida';
                        }
                        return null;
                      },
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
                        onPressed: _saveService,
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(responsive.iScreen(1.5)),
                          ),
                        ),
                        child: Text(
                          widget.serviceId != null ? 'Actualizar' : 'Crear',
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
