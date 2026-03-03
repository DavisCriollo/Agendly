import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/theme/app_theme.dart';
import 'package:agendly_app/features/shared/infrastructure/services/key_value_storage_service.dart';
import 'package:agendly_app/features/shared/infrastructure/services/key_value_storage_service_impl.dart';

class ThemeNotifier extends StateNotifier<AppTheme> {
  final KeyValueStorageService storageService;

  ThemeNotifier(this.storageService) : super(AppTheme.defaultTheme()) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final primaryColor = await storageService.getValue<String>('primaryColor');
    final secondaryColor = await storageService.getValue<String>('secondaryColor');

    if (primaryColor != null && secondaryColor != null) {
      state = AppTheme.fromBusiness(
        primaryColorHex: primaryColor,
        secondaryColorHex: secondaryColor,
      );
    }
  }

  void updateTheme(String primaryColorHex, String secondaryColorHex) {
    state = AppTheme.fromBusiness(
      primaryColorHex: primaryColorHex,
      secondaryColorHex: secondaryColorHex,
    );
    
    // Guardar en storage
    storageService.setKeyValue('primaryColor', primaryColorHex);
    storageService.setKeyValue('secondaryColor', secondaryColorHex);
  }

  void resetTheme() {
    state = AppTheme.defaultTheme();
    storageService.removeKey('primaryColor');
    storageService.removeKey('secondaryColor');
  }
}

final themeProvider = StateNotifierProvider<ThemeNotifier, AppTheme>((ref) {
  final storageService = KeyValueStorageServiceImpl();
  return ThemeNotifier(storageService);
});
