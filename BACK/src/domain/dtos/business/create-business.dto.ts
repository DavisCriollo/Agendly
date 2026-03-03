export interface CreateBusinessDto {
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  slug: string;
}

export class CreateBusinessDtoValidator {
  static create(object: { [key: string]: any }): [string?, CreateBusinessDto?] {
    const { name, logoUrl, primaryColor, secondaryColor, slug } = object;

    if (!name || typeof name !== 'string') {
      return ['El nombre es requerido', undefined];
    }
    if (!primaryColor || typeof primaryColor !== 'string') {
      return ['El color primario es requerido', undefined];
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(primaryColor)) {
      return ['El color primario debe ser un valor Hex válido (ej: #FF5733)', undefined];
    }
    if (!secondaryColor || typeof secondaryColor !== 'string') {
      return ['El color secundario es requerido', undefined];
    }
    if (!hexRegex.test(secondaryColor)) {
      return ['El color secundario debe ser un valor Hex válido', undefined];
    }
    if (!slug || typeof slug !== 'string') {
      return ['El slug es requerido', undefined];
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return ['El slug solo puede contener letras minúsculas, números y guiones', undefined];
    }

    return [undefined, { name: name.trim(), logoUrl, primaryColor, secondaryColor, slug: slug.trim() }];
  }
}
