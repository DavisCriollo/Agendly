import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:agendly_app/config/theme/app_text_styles.dart';
import 'package:agendly_app/config/helpers/responsive.dart';
import 'package:agendly_app/features/appointments/presentation/providers/appointments_provider.dart';
import 'package:agendly_app/features/appointments/presentation/screens/appointment_form_screen.dart';

class AppointmentsCalendarScreen extends ConsumerStatefulWidget {
  const AppointmentsCalendarScreen({super.key});

  @override
  ConsumerState<AppointmentsCalendarScreen> createState() => _AppointmentsCalendarScreenState();
}

class _AppointmentsCalendarScreenState extends ConsumerState<AppointmentsCalendarScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    Future.microtask(() {
      ref.read(appointmentsProvider.notifier).loadAppointmentsByDate(_focusedDay);
    });
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    if (!isSameDay(_selectedDay, selectedDay)) {
      setState(() {
        _selectedDay = selectedDay;
        _focusedDay = focusedDay;
      });
      ref.read(appointmentsProvider.notifier).loadAppointmentsByDate(selectedDay);
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'confirmed':
        return Colors.blue;
      case 'completed':
        return Colors.green;
      case 'cancelled':
        return Colors.red;
      case 'no_show':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  String _getStatusLabel(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      case 'no_show':
        return 'No asistió';
      default:
        return status;
    }
  }

  @override
  Widget build(BuildContext context) {
    final appointmentsState = ref.watch(appointmentsProvider);
    final responsive = Responsive.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Calendario de Citas'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AppointmentFormScreen(),
                ),
              ).then((_) {
                if (_selectedDay != null) {
                  ref.read(appointmentsProvider.notifier).loadAppointmentsByDate(_selectedDay!);
                }
              });
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Card(
            margin: EdgeInsets.all(responsive.iScreen(2)),
            child: TableCalendar(
              firstDay: DateTime.utc(2020, 1, 1),
              lastDay: DateTime.utc(2030, 12, 31),
              focusedDay: _focusedDay,
              selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
              onDaySelected: _onDaySelected,
              calendarFormat: CalendarFormat.month,
              startingDayOfWeek: StartingDayOfWeek.monday,
              headerStyle: const HeaderStyle(
                formatButtonVisible: false,
                titleCentered: true,
              ),
              calendarStyle: CalendarStyle(
                selectedDecoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  shape: BoxShape.circle,
                ),
                todayDecoration: BoxDecoration(
                  color: Theme.of(context).primaryColor.withOpacity(0.5),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: responsive.wScreen(2)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    _selectedDay != null
                        ? 'Citas del ${_selectedDay!.day}/${_selectedDay!.month}/${_selectedDay!.year}'
                        : 'Selecciona una fecha',
                    style: AppTextStyles.h4().copyWith(fontSize: responsive.iScreen(AppTextStyles.h4().fontSize!/10)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (appointmentsState.appointments.isNotEmpty)
                  Chip(
                    label: Text(
                      '${appointmentsState.appointments.length}',
                      style: TextStyle(fontSize: responsive.iScreen(1.2)),
                    ),
                    backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2),
                  ),
              ],
            ),
          ),
          SizedBox(height: responsive.hScreen(1)),
          Expanded(
            child: appointmentsState.isLoading
                ? const Center(child: CircularProgressIndicator())
                : appointmentsState.errorMessage != null
                    ? Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(horizontal: responsive.wScreen(4)),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.error_outline, size: responsive.iScreen(8), color: Colors.red),
                              SizedBox(height: responsive.hScreen(2)),
                              Text(
                                'Error: ${appointmentsState.errorMessage}',
                                style: AppTextStyles.bodyMedium().copyWith(fontSize: responsive.iScreen(AppTextStyles.bodyMedium().fontSize!/10)),
                                textAlign: TextAlign.center,
                              ),
                              SizedBox(height: responsive.hScreen(2)),
                              ElevatedButton(
                                onPressed: () {
                                  if (_selectedDay != null) {
                                    ref.read(appointmentsProvider.notifier).loadAppointmentsByDate(_selectedDay!);
                                  }
                                },
                                child: Text('Reintentar', style: TextStyle(fontSize: responsive.iScreen(1.4))),
                              ),
                            ],
                          ),
                        ),
                      )
                    : appointmentsState.appointments.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.event_busy, size: responsive.iScreen(8), color: Colors.grey),
                                SizedBox(height: responsive.hScreen(2)),
                                Text(
                                  'No hay citas para esta fecha',
                                  style: AppTextStyles.bodyLarge(color: Colors.grey).copyWith(fontSize: responsive.iScreen(AppTextStyles.bodyLarge().fontSize!/10)),
                                ),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: () async {
                              if (_selectedDay != null) {
                                await ref.read(appointmentsProvider.notifier).loadAppointmentsByDate(_selectedDay!);
                              }
                            },
                            child: ListView.builder(
                              padding: EdgeInsets.symmetric(horizontal: responsive.wScreen(2)),
                              itemCount: appointmentsState.appointments.length,
                              itemBuilder: (context, index) {
                                final appointment = appointmentsState.appointments[index];
                                final startTime = appointment.startTime;
                                final endTime = appointment.endTime;

                                return Card(
                                  margin: EdgeInsets.only(bottom: responsive.hScreen(1.5)),
                                  child: ListTile(
                                    leading: CircleAvatar(
                                      backgroundColor: _getStatusColor(appointment.status),
                                      radius: responsive.iScreen(3),
                                      child: Icon(
                                        Icons.event,
                                        color: Colors.white,
                                        size: responsive.iScreen(3),
                                      ),
                                    ),
                                    title: Text(
                                      '${startTime.hour.toString().padLeft(2, '0')}:${startTime.minute.toString().padLeft(2, '0')} - ${endTime.hour.toString().padLeft(2, '0')}:${endTime.minute.toString().padLeft(2, '0')}',
                                      style: TextStyle(fontSize: responsive.iScreen(1.4), fontWeight: FontWeight.w600),
                                    ),
                                    subtitle: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        if (appointment.clientName != null)
                                          Text(
                                            'Cliente: ${appointment.clientName}',
                                            style: TextStyle(fontSize: responsive.iScreen(1.2)),
                                          ),
                                        if (appointment.staffName != null)
                                          Text(
                                            'Staff: ${appointment.staffName}',
                                            style: TextStyle(fontSize: responsive.iScreen(1.2)),
                                          ),
                                        SizedBox(height: responsive.hScreen(0.5)),
                                        Chip(
                                          label: Text(
                                            _getStatusLabel(appointment.status),
                                            style: TextStyle(fontSize: responsive.iScreen(1.0)),
                                          ),
                                          backgroundColor: _getStatusColor(appointment.status).withOpacity(0.2),
                                          padding: EdgeInsets.zero,
                                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                        ),
                                      ],
                                    ),
                                    trailing: Icon(Icons.chevron_right, size: responsive.iScreen(3)),
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => AppointmentFormScreen(appointmentId: appointment.id),
                                        ),
                                      ).then((_) {
                                        if (_selectedDay != null) {
                                          ref.read(appointmentsProvider.notifier).loadAppointmentsByDate(_selectedDay!);
                                        }
                                      });
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
