class User {
  final String id;
  final String email;
  final String name;
  final String role;
  final String? businessId;
  final String? phone;
  final String? avatarUrl;
  final bool isActive;

  User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.businessId,
    this.phone,
    this.avatarUrl,
    required this.isActive,
  });
}
