import 'package:flutter/material.dart';
import 'dart:math' as math;

/// Clase para diseño responsivo.
/// Uso: final responsive = Responsive.of(context);
///      responsive.wScreen(50)  // 50% del ancho
///      responsive.hScreen(30)  // 30% del alto
///      responsive.iScreen(5)   // 5% de la diagonal
class Responsive {
  final double width;
  final double height;
  final double inch;

  Responsive({
    required this.width,
    required this.height,
    required this.inch,
  });

  factory Responsive.of(BuildContext context) {
    final MediaQueryData data = MediaQuery.of(context);
    final Size size = data.size;
    // Teorema de Pitágoras: c² = a² + b² => c = √(a² + b²)
    final double inch = math.sqrt(
      math.pow(size.width, 2) + math.pow(size.height, 2),
    );
    return Responsive(
      width: size.width,
      height: size.height,
      inch: inch,
    );
  }

  /// Porcentaje del ancho de pantalla (0-100)
  double wScreen(double percent) {
    return width * percent / 100;
  }

  /// Porcentaje del alto de pantalla (0-100)
  double hScreen(double percent) {
    return height * percent / 100;
  }

  /// Porcentaje de la diagonal de pantalla (0-100)
  double iScreen(double percent) {
    return inch * percent / 100;
  }
}
