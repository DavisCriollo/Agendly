export interface CreateStaffDto {
  businessId: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  services: string[];
}

export class CreateStaffDtoValidator {
  static create(object: { [key: string]: any }): [string?, CreateStaffDto?] {
    const { businessId, userId, name, avatarUrl, services } = object;

    if (!businessId || typeof businessId !== 'string') {
      return ['El businessId es requerido', undefined];
    }
    if (!userId || typeof userId !== 'string') {
      return ['El userId es requerido', undefined];
    }
    if (!name || typeof name !== 'string') {
      return ['El nombre es requerido', undefined];
    }
    if (!Array.isArray(services)) {
      return ['services debe ser un array de IDs de servicios', undefined];
    }

    return [undefined, { businessId, userId, name: name.trim(), avatarUrl, services }];
  }
}
