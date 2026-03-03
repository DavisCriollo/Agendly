class Appointment {
  final String id;
  final String businessId;
  final String? clientId;
  final String? staffId;
  final String? serviceId;
  final DateTime startTime;
  final DateTime endTime;
  final String status; // 'pending', 'confirmed', 'cancelled', 'completed'
  final String? notes;
  final String? cancellationReason;
  final DateTime? cancelledAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  // Datos relacionados (populated)
  final String? clientName;
  final String? clientEmail;
  final String? clientPhone;
  final String? staffName;
  final String? serviceName;
  final double? servicePrice;

  Appointment({
    required this.id,
    required this.businessId,
    this.clientId,
    this.staffId,
    this.serviceId,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.notes,
    this.cancellationReason,
    this.cancelledAt,
    required this.createdAt,
    required this.updatedAt,
    this.clientName,
    this.clientEmail,
    this.clientPhone,
    this.staffName,
    this.serviceName,
    this.servicePrice,
  });

  bool get isPending => status == 'pending';
  bool get isConfirmed => status == 'confirmed';
  bool get isCancelled => status == 'cancelled';
  bool get isCompleted => status == 'completed';

  String get statusText {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  }
}
