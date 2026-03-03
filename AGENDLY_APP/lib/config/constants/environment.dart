class Environment {
  /// URLs del backend en Railway (MongoDB Atlas en la nube).
  /// Después del deploy, reemplaza con tu dominio: https://TU-PROYECTO.up.railway.app
  static const String _railwayBase = 'https://agendly-backend.up.railway.app';

  static String apiUrl = const String.fromEnvironment(
    'API_URL',
    defaultValue: '$_railwayBase/api',
  );

  static String socketUrl = const String.fromEnvironment(
    'SOCKET_URL',
    defaultValue: _railwayBase,
  );

  static String initAll() {
    return apiUrl;
  }
}
