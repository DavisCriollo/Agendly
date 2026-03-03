import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/helpers/responsive.dart';
import 'package:agendly_app/config/widgets/custom_text.dart';
import 'package:agendly_app/features/auth/presentation/providers/auth_provider.dart';
import 'package:agendly_app/features/staff/presentation/screens/staff_list_screen.dart';
import 'package:agendly_app/features/clients/presentation/screens/clients_list_screen.dart';
import 'package:agendly_app/features/appointments/presentation/screens/appointments_calendar_screen.dart';
import 'package:agendly_app/features/services/presentation/screens/services_list_screen.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;
    final business = authState.business;
    final responsive = Responsive.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(business?.name ?? 'Agendly'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              ref.read(authProvider.notifier).logout();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(responsive.iScreen(2)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (user != null) ...[
              Card(
                child: Padding(
                  padding: EdgeInsets.all(responsive.iScreen(2)),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: responsive.iScreen(3),
                        backgroundColor: Theme.of(context).primaryColor,
                        child: Text(
                          user.name[0].toUpperCase(),
                          style: TextStyle(
                            fontSize: responsive.iScreen(2.0),
                            color: Colors.white,
                          ),
                        ),
                      ),
                      SizedBox(width: responsive.wScreen(2)),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CustomText.title(
                              text: user.name,
                              fontSize: responsive.iScreen(2.0),
                              color: null,
                            ),
                            SizedBox(height: responsive.hScreen(0.5)),
                            CustomText.subtitle(
                              text: user.email,
                              fontSize: responsive.iScreen(1.2),
                              color: Colors.grey[600],
                            ),
                            SizedBox(height: responsive.hScreen(1)),
                            Chip(
                              label: CustomText(
                                text: user.role,
                                fontSize: responsive.iScreen(1.2),
                              ),
                              padding: EdgeInsets.zero,
                              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: responsive.hScreen(3)),
            ],
            CustomText.title(
              text: 'Menú Principal',
              fontSize: responsive.iScreen(2.4),
              color: null,
            ),
            SizedBox(height: responsive.hScreen(2)),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: responsive.width >= 600 ? 4 : 2,
              mainAxisSpacing: responsive.hScreen(2),
              crossAxisSpacing: responsive.wScreen(4),
              childAspectRatio: responsive.width >= 600 ? 1.2 : 1.0,
              children: [
                _DashboardCard(
                  icon: Icons.calendar_today,
                  title: 'Citas',
                  subtitle: 'Gestionar agenda',
                  color: Colors.blue,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const AppointmentsCalendarScreen(),
                      ),
                    );
                  },
                ),
                _DashboardCard(
                  icon: Icons.people,
                  title: 'Clientes',
                  subtitle: 'Ver clientes',
                  color: Colors.green,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const ClientsListScreen(),
                      ),
                    );
                  },
                ),
                _DashboardCard(
                  icon: Icons.person_outline,
                  title: 'Staff',
                  subtitle: 'Equipo de trabajo',
                  color: Colors.orange,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const StaffListScreen(),
                      ),
                    );
                  },
                ),
                _DashboardCard(
                  icon: Icons.medical_services,
                  title: 'Servicios',
                  subtitle: 'Catálogo',
                  color: Colors.purple,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const ServicesListScreen(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _DashboardCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final responsive = Responsive.of(context);
    
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(responsive.iScreen(1.5)),
        child: Padding(
          padding: EdgeInsets.all(responsive.iScreen(2)),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: responsive.iScreen(5),
                color: color,
              ),
              SizedBox(height: responsive.hScreen(1.5)),
              CustomText.title(
                text: title,
                fontSize: responsive.iScreen(1.4),
                color: null,
                textAlign: TextAlign.center,
              ),
              SizedBox(height: responsive.hScreen(0.5)),
              CustomText.subtitle(
                text: subtitle,
                fontSize: responsive.iScreen(1.1),
                color: Colors.grey[600],
                textAlign: TextAlign.center,
                maxLines: 1,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
