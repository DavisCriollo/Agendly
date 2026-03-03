import 'package:flutter/material.dart';
import 'package:agendly_app/config/helpers/responsive.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final responsive = Responsive.of(context);

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.calendar_month_rounded,
              size: responsive.iScreen(12),
              color: Theme.of(context).colorScheme.primary,
            ),
            SizedBox(height: responsive.hScreen(3)),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
