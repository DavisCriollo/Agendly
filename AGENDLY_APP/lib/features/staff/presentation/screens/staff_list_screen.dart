import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/helpers/responsive.dart';
import 'package:agendly_app/config/widgets/custom_text.dart';
import 'package:agendly_app/features/staff/presentation/providers/staff_provider.dart';
import 'package:agendly_app/features/staff/presentation/screens/staff_form_screen.dart';

class StaffListScreen extends ConsumerStatefulWidget {
  const StaffListScreen({super.key});

  @override
  ConsumerState<StaffListScreen> createState() => _StaffListScreenState();
}

class _StaffListScreenState extends ConsumerState<StaffListScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(staffProvider.notifier).loadStaff());
  }

  @override
  Widget build(BuildContext context) {
    final staffState = ref.watch(staffProvider);
    final responsive = Responsive.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Staff'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const StaffFormScreen(),
                ),
              ).then((_) => ref.read(staffProvider.notifier).loadStaff());
            },
          ),
        ],
      ),
      body: staffState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : staffState.errorMessage != null
              ? Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: responsive.wScreen(4)),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.error_outline, size: responsive.iScreen(8), color: Colors.red),
                        SizedBox(height: responsive.hScreen(2)),
                        CustomText(
                          text: 'Error: ${staffState.errorMessage}',
                          fontSize: responsive.iScreen(1.4),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: responsive.hScreen(2)),
                        ElevatedButton(
                          onPressed: () => ref.read(staffProvider.notifier).loadStaff(),
                          child: CustomText(text: 'Reintentar', fontSize: responsive.iScreen(1.4)),
                        ),
                      ],
                    ),
                  ),
                )
              : staffState.staff.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.people_outline, size: responsive.iScreen(8), color: Colors.grey),
                          SizedBox(height: responsive.hScreen(2)),
                          CustomText.subtitle(
                            text: 'No hay staff registrado',
                            fontSize: responsive.iScreen(1.6),
                            color: Colors.grey,
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: () async {
                        await ref.read(staffProvider.notifier).loadStaff();
                      },
                      child: ListView.builder(
                        padding: EdgeInsets.all(responsive.iScreen(2)),
                        itemCount: staffState.staff.length,
                        itemBuilder: (context, index) {
                          final staff = staffState.staff[index];
                          return Card(
                            margin: EdgeInsets.only(bottom: responsive.hScreen(1.5)),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: Theme.of(context).primaryColor,
                                radius: responsive.iScreen(3),
                                child: Text(
                                  staff.name[0].toUpperCase(),
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: responsive.iScreen(1.6),
                                  ),
                                ),
                              ),
                              title: CustomText.title(
                                text: staff.name,
                                fontSize: responsive.iScreen(1.4),
                                color: null,
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (staff.email != null)
                                    CustomText.subtitle(
                                      text: staff.email!,
                                      fontSize: responsive.iScreen(1.2),
                                    ),
                                  if (staff.role != null) ...[
                                    SizedBox(height: responsive.hScreen(0.5)),
                                    CustomText(
                                      text: staff.role!,
                                      fontSize: responsive.iScreen(1.2),
                                      color: Theme.of(context).primaryColor,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ],
                                ],
                              ),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (staff.rating != null) ...[
                                    Icon(Icons.star, color: Colors.amber, size: responsive.iScreen(2.5)),
                                    SizedBox(width: responsive.wScreen(1)),
                                    CustomText(
                                      text: staff.rating!.toStringAsFixed(1),
                                      fontSize: responsive.iScreen(1.2),
                                    ),
                                  ],
                                  SizedBox(width: responsive.wScreen(2)),
                                  Icon(
                                    staff.isActive ? Icons.check_circle : Icons.cancel,
                                    color: staff.isActive ? Colors.green : Colors.red,
                                    size: responsive.iScreen(3),
                                  ),
                                ],
                              ),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => StaffFormScreen(staffId: staff.id),
                                  ),
                                ).then((_) => ref.read(staffProvider.notifier).loadStaff());
                              },
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
