export class CreateClientDto {
  private constructor(
    public readonly businessId: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone?: string,
    public readonly birthDate?: Date,
    public readonly referredBy?: string,
    public readonly source?: string,
    public readonly avatarUrl?: string,
    public readonly notes?: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateClientDto?] {
    const { businessId, userId, name, email, phone, birthDate, referredBy, source, avatarUrl, notes } = object;

    if (!businessId) return ['businessId es requerido'];
    if (!userId) return ['userId es requerido'];
    if (!name) return ['name es requerido'];
    if (!email) return ['email es requerido'];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return ['email no es válido'];

    return [undefined, new CreateClientDto(businessId, userId, name, email, phone, birthDate, referredBy, source, avatarUrl, notes)];
  }
}
