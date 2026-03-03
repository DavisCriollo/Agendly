import 'package:agendly_app/features/services/domain/entities/service.dart';

class ServiceMapper {
  static Service fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['_id'] ?? json['id'],
      businessId: json['businessId'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      duration: json['duration'] ?? 60,
      price: (json['price'] ?? 0).toDouble(),
      color: json['color'],
      isActive: json['isActive'] ?? true,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  static Map<String, dynamic> toJson(Service service) {
    return {
      'businessId': service.businessId,
      'name': service.name,
      'description': service.description,
      'duration': service.duration,
      'price': service.price,
      'color': service.color,
      'isActive': service.isActive,
    };
  }
}
