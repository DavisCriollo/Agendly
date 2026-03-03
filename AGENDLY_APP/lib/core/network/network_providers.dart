import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/core/network/network_service.dart';
import 'package:agendly_app/core/network/http_services_impl.dart';

final networkServiceProvider = Provider<NetworkService>((ref) {
  return HttpServicesImpl();
});
