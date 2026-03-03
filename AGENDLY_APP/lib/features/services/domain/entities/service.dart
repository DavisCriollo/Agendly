class Service {
  final String id;
  final String businessId;
  final String name;
  final String? description;
  final int duration; // en minutos
  final double price;
  final String? color;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  Service({
    required this.id,
    required this.businessId,
    required this.name,
    this.description,
    required this.duration,
    required this.price,
    this.color,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  String get durationFormatted {
    if (duration < 60) {
      return '$duration min';
    }
    final hours = duration ~/ 60;
    final minutes = duration % 60;
    if (minutes == 0) {
      return '$hours h';
    }
    return '$hours h $minutes min';
  }

  String get priceFormatted {
    return '\$${price.toStringAsFixed(2)}';
  }
}
