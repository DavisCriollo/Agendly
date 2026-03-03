import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:agendly_app/features/auth/presentation/providers/auth_provider.dart';
import 'package:agendly_app/features/auth/presentation/screens/login_screen.dart';
import 'package:agendly_app/features/shared/presentation/screens/splash_screen.dart';
import 'package:agendly_app/features/shared/presentation/screens/home_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final isGoingToSplash = state.matchedLocation == '/splash';
      final isGoingToLogin = state.matchedLocation == '/login';
      final isGoingToRegister = state.matchedLocation == '/register';

      if (authState.status == AuthStatus.checking) {
        return isGoingToSplash ? null : '/splash';
      }

      if (authState.status == AuthStatus.notAuthenticated) {
        if (isGoingToLogin || isGoingToRegister) return null;
        return '/login';
      }

      if (authState.status == AuthStatus.authenticated) {
        if (isGoingToLogin || isGoingToRegister || isGoingToSplash) {
          return '/';
        }
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const LoginScreen(), // Placeholder
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
    ],
  );
});
