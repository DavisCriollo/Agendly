import 'package:agendly_app/features/auth/domain/entities/user.dart';

class UserMapper {
  static User fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? json['_id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? 'USER',
      businessId: json['businessId'],
      phone: json['phone'],
      avatarUrl: json['avatarUrl'],
      isActive: json['isActive'] ?? true,
    );
  }

  static Map<String, dynamic> toJson(User user) {
    return {
      'id': user.id,
      'email': user.email,
      'name': user.name,
      'role': user.role,
      'businessId': user.businessId,
      'phone': user.phone,
      'avatarUrl': user.avatarUrl,
      'isActive': user.isActive,
    };
  }
}
