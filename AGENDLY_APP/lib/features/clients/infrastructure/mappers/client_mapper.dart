import 'package:agendly_app/features/clients/domain/entities/client.dart';

class ClientMapper {
  static Client fromJson(Map<String, dynamic> json) {
    return Client(
      id: json['_id'] ?? json['id'],
      businessId: json['businessId'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      address: json['address'],
      notes: json['notes'],
      source: json['source'] ?? 'manual',
      isActive: json['isActive'] ?? true,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  static Map<String, dynamic> toJson(Client client) {
    return {
      'businessId': client.businessId,
      'name': client.name,
      'email': client.email,
      'phone': client.phone,
      'address': client.address,
      'notes': client.notes,
      'source': client.source,
    };
  }
}
