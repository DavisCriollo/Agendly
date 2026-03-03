import 'dart:developer' as dev;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:agendly_app/config/router/app_router.dart';
import 'package:agendly_app/config/theme/theme_provider.dart';
import 'package:agendly_app/config/constants/environment.dart';
import 'package:agendly_app/core/core.dart';
import 'package:agendly_app/features/shared/infrastructure/services/firebase_messaging_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializar environment primero (es rápido)
  Environment.initAll();

  // Inicializar Firebase de forma asíncrona (no bloquea el inicio)
  _initializeFirebaseAsync();

  // Iniciar la app inmediatamente
  runApp(
    const ProviderScope(
      child: MainApp(),
    ),
  );
}

// Inicialización asíncrona de Firebase para no bloquear el inicio
Future<void> _initializeFirebaseAsync() async {
  try {
    await Firebase.initializeApp();
    
    // Configurar handler de notificaciones en background
    FirebaseMessaging.onBackgroundMessage(
      firebaseMessagingBackgroundHandler,
    );
    
    // Inicializar servicio de notificaciones
    await FirebaseMessagingService().initialize();
    
    dev.log('✅ Firebase inicializado correctamente', name: 'Main');
  } catch (e) {
    dev.log('⚠️ Firebase no configurado: $e', name: 'Main');
  }
}

class MainApp extends ConsumerWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ConnectivityWatcher.watch(ref);
    final appRouter = ref.watch(appRouterProvider);
    final appTheme = ref.watch(themeProvider);

    return MaterialApp.router(
      title: 'Agendly',
      debugShowCheckedModeBanner: false,
      theme: appTheme.getTheme(),
      routerConfig: appRouter,
      builder: (context, child) {
        return NotificationListenerWidget(
          child: child ?? const SizedBox.shrink(),
        );
      },
    );
  }
}
