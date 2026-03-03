import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/helpers/responsive.dart';
import 'package:agendly_app/features/staff/presentation/providers/staff_provider.dart';

class StaffFormScreen extends ConsumerStatefulWidget {
  final String? staffId;

  const StaffFormScreen({super.key, this.staffId});

  @override
  ConsumerState<StaffFormScreen> createState() => _StaffFormScreenState();
}

class _StaffFormScreenState extends ConsumerState<StaffFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _roleController = TextEditingController();
  bool _isActive = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.staffId != null) {
      Future.microtask(() => _loadStaff());
    }
  }

  Future<void> _loadStaff() async {
    await ref.read(staffProvider.notifier).loadStaffById(widget.staffId!);
    final staff = ref.read(staffProvider).selectedStaff;
    if (staff != null) {
      _nameController.text = staff.name;
      _emailController.text = staff.email ?? '';
      _phoneController.text = staff.phone ?? '';
      _roleController.text = staff.role ?? '';
      _isActive = staff.isActive;
      setState(() {});
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _roleController.dispose();
    super.dispose();
  }

  Future<void> _saveStaff() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final data = {
      'name': _nameController.text.trim(),
      'email': _emailController.text.trim(),
      'phone': _phoneController.text.trim(),
      'role': _roleController.text.trim(),
      'isActive': _isActive,
    };

    bool success;
    if (widget.staffId != null) {
      success = await ref.read(staffProvider.notifier).updateStaff(widget.staffId!, data);
    } else {
      success = await ref.read(staffProvider.notifier).createStaff(data);
    }

    setState(() => _isLoading = false);

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(widget.staffId != null ? 'Staff actualizado' : 'Staff creado'),
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
        title: Text(widget.staffId != null ? 'Editar Staff' : 'Nuevo Staff'),
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
                    TextFormField(
                      controller: _roleController,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Rol',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.work),
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'El rol es requerido';
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
                        onPressed: _saveStaff,
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(responsive.iScreen(1.5)),
                          ),
                        ),
                        child: Text(
                          widget.staffId != null ? 'Actualizar' : 'Crear',
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
