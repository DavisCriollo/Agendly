import 'package:agendly_app/features/appointments/domain/entities/appointment.dart';

class AppointmentMapper {
  static Appointment fromJson(Map<String, dynamic> json) {
    // Extraer datos del client si está populated
    String? clientName;
    String? clientEmail;
    String? clientPhone;
    String? clientId;
    if (json['clientId'] is Map) {
      final client = json['clientId'] as Map<String, dynamic>;
      clientId = client['_id'] ?? client['id'];
      clientName = client['name'];
      clientEmail = client['email'];
      clientPhone = client['phone'];
    } else if (json['clientId'] is String) {
      clientId = json['clientId'];
    }

    // Extraer datos del staff si está populated
    String? staffName;
    String? staffId;
    if (json['staffId'] is Map) {
      final staff = json['staffId'] as Map<String, dynamic>;
      staffId = staff['_id'] ?? staff['id'];
      staffName = staff['name'];
    } else if (json['staffId'] is String) {
      staffId = json['staffId'];
    }

    // Extraer datos del service si está populated
    String? serviceName;
    double? servicePrice;
    String? serviceId;
    if (json['serviceId'] is Map) {
      final service = json['serviceId'] as Map<String, dynamic>;
      serviceId = service['_id'] ?? service['id'];
      serviceName = service['name'];
      servicePrice = (service['price'] ?? 0).toDouble();
    } else if (json['serviceId'] is String) {
      serviceId = json['serviceId'];
    }

    return Appointment(
      id: json['_id'] ?? json['id'],
      businessId: json['businessId'] ?? '',
      clientId: clientId,
      staffId: staffId,
      serviceId: serviceId,
      startTime: DateTime.parse(json['startTime']),
      endTime: DateTime.parse(json['endTime']),
      status: json['status'] ?? 'pending',
      notes: json['notes'],
      cancellationReason: json['cancellationReason'],
      cancelledAt: json['cancelledAt'] != null ? DateTime.parse(json['cancelledAt']) : null,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
      clientName: clientName,
      clientEmail: clientEmail,
      clientPhone: clientPhone,
      staffName: staffName,
      serviceName: serviceName,
      servicePrice: servicePrice,
    );
  }

  static Map<String, dynamic> toJson(Appointment appointment) {
    return {
      'clientId': appointment.clientId,
      'staffId': appointment.staffId,
      'serviceId': appointment.serviceId,
      'startTime': appointment.startTime.toIso8601String(),
      'notes': appointment.notes,
    };
  }
}
