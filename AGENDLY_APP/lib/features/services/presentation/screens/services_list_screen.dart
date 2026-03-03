import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/helpers/responsive.dart';
import 'package:agendly_app/config/widgets/custom_text.dart';
import 'package:agendly_app/features/services/presentation/providers/services_provider.dart';
import 'package:agendly_app/features/services/presentation/screens/service_form_screen.dart';

class ServicesListScreen extends ConsumerStatefulWidget {
  const ServicesListScreen({super.key});

  @override
  ConsumerState<ServicesListScreen> createState() => _ServicesListScreenState();
}

class _ServicesListScreenState extends ConsumerState<ServicesListScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(servicesProvider.notifier).loadServices());
  }

  @override
  Widget build(BuildContext context) {
    final servicesState = ref.watch(servicesProvider);
    final responsive = Responsive.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Servicios'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ServiceFormScreen(),
                ),
              ).then((_) => ref.read(servicesProvider.notifier).loadServices());
            },
          ),
        ],
      ),
      body: servicesState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : servicesState.errorMessage != null
              ? Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: responsive.wScreen(4)),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.error_outline, size: responsive.iScreen(8), color: Colors.red),
                        SizedBox(height: responsive.hScreen(2)),
                        CustomText(
                          text: 'Error: ${servicesState.errorMessage}',
                          fontSize: responsive.iScreen(1.4),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: responsive.hScreen(2)),
                        ElevatedButton(
                          onPressed: () => ref.read(servicesProvider.notifier).loadServices(),
                          child: CustomText(text: 'Reintentar', fontSize: responsive.iScreen(1.4)),
                        ),
                      ],
                    ),
                  ),
                )
              : servicesState.services.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.medical_services_outlined, size: responsive.iScreen(8), color: Colors.grey),
                          SizedBox(height: responsive.hScreen(2)),
                          CustomText.subtitle(
                            text: 'No hay servicios registrados',
                            fontSize: responsive.iScreen(1.6),
                            color: Colors.grey,
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: () async {
                        await ref.read(servicesProvider.notifier).loadServices();
                      },
                      child: ListView.builder(
                        padding: EdgeInsets.all(responsive.iScreen(2)),
                        itemCount: servicesState.services.length,
                        itemBuilder: (context, index) {
                          final service = servicesState.services[index];
                          return Card(
                            margin: EdgeInsets.only(bottom: responsive.hScreen(1.5)),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: Theme.of(context).primaryColor,
                                radius: responsive.iScreen(3),
                                child: Icon(
                                  Icons.medical_services,
                                  color: Colors.white,
                                  size: responsive.iScreen(3.5),
                                ),
                              ),
                              title: CustomText.title(
                                text: service.name,
                                fontSize: responsive.iScreen(1.4),
                                color: null,
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (service.description != null) ...[
                                    CustomText.subtitle(
                                      text: service.description!,
                                      fontSize: responsive.iScreen(1.2),
                                      maxLines: 2,
                                    ),
                                    SizedBox(height: responsive.hScreen(0.5)),
                                  ],
                                  Row(
                                    children: [
                                      Icon(Icons.access_time, size: responsive.iScreen(2), color: Colors.grey),
                                      SizedBox(width: responsive.wScreen(1)),
                                      CustomText(
                                        text: '${service.duration} min',
                                        fontSize: responsive.iScreen(1.2),
                                      ),
                                      SizedBox(width: responsive.wScreen(4)),
                                      Icon(Icons.attach_money, size: responsive.iScreen(2), color: Colors.grey),
                                      CustomText(
                                        text: '\$${service.price.toStringAsFixed(2)}',
                                        fontSize: responsive.iScreen(1.2),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              trailing: Icon(
                                service.isActive ? Icons.check_circle : Icons.cancel,
                                color: service.isActive ? Colors.green : Colors.red,
                                size: responsive.iScreen(3),
                              ),
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => ServiceFormScreen(serviceId: service.id),
                                  ),
                                ).then((_) => ref.read(servicesProvider.notifier).loadServices());
                              },
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
