import 'package:agendly_app/features/auth/domain/entities/business.dart';

class BusinessMapper {
  static Business fromJson(Map<String, dynamic> json) {
    return Business(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      logoUrl: json['logoUrl'],
      primaryColor: json['primaryColor'] ?? '#0284C7',
      secondaryColor: json['secondaryColor'] ?? '#0EA5E9',
    );
  }

  static Map<String, dynamic> toJson(Business business) {
    return {
      'id': business.id,
      'name': business.name,
      'slug': business.slug,
      'logoUrl': business.logoUrl,
      'primaryColor': business.primaryColor,
      'secondaryColor': business.secondaryColor,
    };
  }
}
