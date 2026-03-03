import 'package:agendly_app/features/staff/domain/entities/staff.dart';

class StaffMapper {
  static Staff fromJson(Map<String, dynamic> json) {
    // Extract user data if populated
    String? email;
    String? phone;
    String? role;
    if (json['userId'] is Map) {
      final user = json['userId'] as Map<String, dynamic>;
      email = user['email'];
      phone = user['phone'];
      role = user['role'];
    }

    return Staff(
      id: json['_id'] ?? json['id'],
      userId: json['userId'] is String ? json['userId'] : json['userId']?['_id'] ?? '',
      businessId: json['businessId'] ?? '',
      name: json['name'] ?? '',
      email: email,
      phone: phone,
      role: role,
      rating: json['rating']?.toDouble(),
      services: List<String>.from(json['services'] ?? []),
      workingHours: (json['workingHours'] as List?)
              ?.map((wh) => WorkingHoursMapper.fromJson(wh))
              .toList() ??
          [],
      isActive: json['isActive'] ?? true,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  static Map<String, dynamic> toJson(Staff staff) {
    return {
      'userId': staff.userId,
      'name': staff.name,
      'services': staff.services,
      'workingHours': staff.workingHours.map((wh) => WorkingHoursMapper.toJson(wh)).toList(),
      'isActive': staff.isActive,
    };
  }
}

class WorkingHoursMapper {
  static WorkingHours fromJson(Map<String, dynamic> json) {
    return WorkingHours(
      day: json['day'] ?? 0,
      startTime: json['startTime'] ?? '09:00',
      endTime: json['endTime'] ?? '18:00',
      isActive: json['isActive'] ?? true,
    );
  }

  static Map<String, dynamic> toJson(WorkingHours wh) {
    return {
      'day': wh.day,
      'startTime': wh.startTime,
      'endTime': wh.endTime,
      'isActive': wh.isActive,
    };
  }
}
