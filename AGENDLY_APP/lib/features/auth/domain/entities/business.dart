class Business {
  final String id;
  final String name;
  final String slug;
  final String? logoUrl;
  final String primaryColor;
  final String secondaryColor;

  Business({
    required this.id,
    required this.name,
    required this.slug,
    this.logoUrl,
    required this.primaryColor,
    required this.secondaryColor,
  });
}
