class Client {
  final String id;
  final String businessId;
  final String name;
  final String email;
  final String? phone;
  final String? address;
  final String? notes;
  final String source; // 'manual', 'booking', 'import'
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  Client({
    required this.id,
    required this.businessId,
    required this.name,
    required this.email,
    this.phone,
    this.address,
    this.notes,
    required this.source,
    this.isActive = true,
    required this.createdAt,
    required this.updatedAt,
  });
}
