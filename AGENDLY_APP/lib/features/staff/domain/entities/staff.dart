class Staff {
  final String id;
  final String userId;
  final String businessId;
  final String name;
  final String? email;
  final String? phone;
  final String? role;
  final double? rating;
  final List<String> services;
  final List<WorkingHours> workingHours;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  Staff({
    required this.id,
    required this.userId,
    required this.businessId,
    required this.name,
    this.email,
    this.phone,
    this.role,
    this.rating,
    required this.services,
    required this.workingHours,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });
}

class WorkingHours {
  final int day; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  final String startTime; // "09:00"
  final String endTime; // "18:00"
  final bool isActive;

  WorkingHours({
    required this.day,
    required this.startTime,
    required this.endTime,
    required this.isActive,
  });

  String get dayName {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[day];
  }
}
