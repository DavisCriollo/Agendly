import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/helpers/responsive.dart';
import 'package:agendly_app/features/appointments/presentation/providers/appointments_provider.dart';
import 'package:agendly_app/features/clients/presentation/providers/clients_provider.dart';
import 'package:agendly_app/features/staff/presentation/providers/staff_provider.dart';
import 'package:agendly_app/features/services/presentation/providers/services_provider.dart';

class AppointmentFormScreen extends ConsumerStatefulWidget {
  final String? appointmentId;

  const AppointmentFormScreen({super.key, this.appointmentId});

  @override
  ConsumerState<AppointmentFormScreen> createState() => _AppointmentFormScreenState();
}

class _AppointmentFormScreenState extends ConsumerState<AppointmentFormScreen> {
  final _formKey = GlobalKey<FormState>();
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  String? _selectedClientId;
  String? _selectedStaffId;
  String? _selectedServiceId;
  String _status = 'pending';
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(clientsProvider.notifier).loadClients();
      ref.read(staffProvider.notifier).loadStaff();
      ref.read(servicesProvider.notifier).loadServices();
      if (widget.appointmentId != null) {
        _loadAppointment();
      }
    });
  }

  Future<void> _loadAppointment() async {
    await ref.read(appointmentsProvider.notifier).loadAppointmentById(widget.appointmentId!);
    final appointment = ref.read(appointmentsProvider).selectedAppointment;
    if (appointment != null) {
      _selectedDate = appointment.startTime;
      _selectedTime = TimeOfDay.fromDateTime(appointment.startTime);
      _selectedClientId = appointment.clientId;
      _selectedStaffId = appointment.staffId;
      _selectedServiceId = appointment.serviceId;
      _status = appointment.status;
      setState(() {});
    }
  }

  Future<void> _saveAppointment() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedDate == null || _selectedTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selecciona fecha y hora'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    final startTime = DateTime(
      _selectedDate!.year,
      _selectedDate!.month,
      _selectedDate!.day,
      _selectedTime!.hour,
      _selectedTime!.minute,
    );

    final data = {
      'startTime': startTime.toIso8601String(),
      'clientId': _selectedClientId,
      'staffId': _selectedStaffId,
      'serviceId': _selectedServiceId,
      'status': _status,
    };

    bool success;
    if (widget.appointmentId != null) {
      success = await ref.read(appointmentsProvider.notifier).updateAppointment(widget.appointmentId!, data);
    } else {
      success = await ref.read(appointmentsProvider.notifier).createAppointment(data);
    }

    setState(() => _isLoading = false);

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(widget.appointmentId != null ? 'Cita actualizada' : 'Cita creada'),
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

  Future<void> _selectDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date != null) {
      setState(() => _selectedDate = date);
    }
  }

  Future<void> _selectTime() async {
    final time = await showTimePicker(
      context: context,
      initialTime: _selectedTime ?? TimeOfDay.now(),
    );
    if (time != null) {
      setState(() => _selectedTime = time);
    }
  }

  @override
  Widget build(BuildContext context) {
    final clientsState = ref.watch(clientsProvider);
    final staffState = ref.watch(staffProvider);
    final servicesState = ref.watch(servicesProvider);
    final responsive = Responsive.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.appointmentId != null ? 'Editar Cita' : 'Nueva Cita'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(responsive.iScreen(2)),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    ListTile(
                      title: Text('Fecha', style: TextStyle(fontSize: responsive.iScreen(1.4))),
                      subtitle: Text(
                        _selectedDate != null
                            ? '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'
                            : 'Selecciona una fecha',
                        style: TextStyle(fontSize: responsive.iScreen(1.2)),
                      ),
                      trailing: Icon(Icons.calendar_today, size: responsive.iScreen(3)),
                      onTap: _selectDate,
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    ListTile(
                      title: Text('Hora', style: TextStyle(fontSize: responsive.iScreen(1.4))),
                      subtitle: Text(
                        _selectedTime != null
                            ? '${_selectedTime!.hour.toString().padLeft(2, '0')}:${_selectedTime!.minute.toString().padLeft(2, '0')}'
                            : 'Selecciona una hora',
                        style: TextStyle(fontSize: responsive.iScreen(1.2)),
                      ),
                      trailing: Icon(Icons.access_time, size: responsive.iScreen(3)),
                      onTap: _selectTime,
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    DropdownButtonFormField<String>(
                      value: _selectedClientId,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Cliente',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.person),
                      ),
                      items: clientsState.clients.map((client) {
                        return DropdownMenuItem(
                          value: client.id,
                          child: Text(client.name, style: TextStyle(fontSize: responsive.iScreen(1.4))),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() => _selectedClientId = value);
                      },
                      validator: (value) {
                        if (value == null) {
                          return 'Selecciona un cliente';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    DropdownButtonFormField<String>(
                      value: _selectedStaffId,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Staff',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.person_outline),
                      ),
                      items: staffState.staff.map((staff) {
                        return DropdownMenuItem(
                          value: staff.id,
                          child: Text(staff.name, style: TextStyle(fontSize: responsive.iScreen(1.4))),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() => _selectedStaffId = value);
                      },
                      validator: (value) {
                        if (value == null) {
                          return 'Selecciona un staff';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    DropdownButtonFormField<String>(
                      value: _selectedServiceId,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Servicio',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.medical_services),
                      ),
                      items: servicesState.services.map((service) {
                        return DropdownMenuItem(
                          value: service.id,
                          child: Text(service.name, style: TextStyle(fontSize: responsive.iScreen(1.4))),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() => _selectedServiceId = value);
                      },
                      validator: (value) {
                        if (value == null) {
                          return 'Selecciona un servicio';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: responsive.hScreen(2)),
                    DropdownButtonFormField<String>(
                      value: _status,
                      style: TextStyle(fontSize: responsive.iScreen(1.4)),
                      decoration: InputDecoration(
                        labelText: 'Estado',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                        ),
                        prefixIcon: const Icon(Icons.info),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'pending', child: Text('Pendiente')),
                        DropdownMenuItem(value: 'confirmed', child: Text('Confirmada')),
                        DropdownMenuItem(value: 'completed', child: Text('Completada')),
                        DropdownMenuItem(value: 'cancelled', child: Text('Cancelada')),
                        DropdownMenuItem(value: 'no_show', child: Text('No asistió')),
                      ],
                      onChanged: (value) {
                        if (value != null) {
                          setState(() => _status = value);
                        }
                      },
                    ),
                    SizedBox(height: responsive.hScreen(3)),
                    SizedBox(
                      width: double.infinity,
                      height: responsive.hScreen(6),
                      child: ElevatedButton(
                        onPressed: _saveAppointment,
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(responsive.iScreen(1.5)),
                          ),
                        ),
                        child: Text(
                          widget.appointmentId != null ? 'Actualizar' : 'Crear',
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
