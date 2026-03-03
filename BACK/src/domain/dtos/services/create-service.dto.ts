export interface CreateServiceDto {
  businessId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export class CreateServiceDtoValidator {
  static create(object: { [key: string]: any }): [string?, CreateServiceDto?] {
    const { businessId, name, description, duration, price } = object;

    if (!businessId || typeof businessId !== 'string') {
      return ['El businessId es requerido', undefined];
    }
    if (!name || typeof name !== 'string') {
      return ['El nombre es requerido', undefined];
    }
    if (typeof duration !== 'number' || duration <= 0) {
      return ['La duración debe ser un número positivo (minutos)', undefined];
    }
    if (typeof price !== 'number' || price < 0) {
      return ['El precio debe ser un número mayor o igual a 0', undefined];
    }

    return [
      undefined,
      { businessId, name: name.trim(), description: description?.trim(), duration, price },
    ];
  }
}
