export interface UpdateBusinessDto {
  name?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
}

export class UpdateBusinessDtoValidator {
  static create(object: { [key: string]: any }): [string?, UpdateBusinessDto?] {
    const { name, logoUrl, primaryColor, secondaryColor, isActive } = object;

    const result: UpdateBusinessDto = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return ['El nombre debe ser un string no vacío', undefined];
      }
      result.name = name.trim();
    }
    if (logoUrl !== undefined) result.logoUrl = logoUrl;
    if (primaryColor !== undefined) {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(primaryColor)) {
        return ['El color primario debe ser un valor Hex válido', undefined];
      }
      result.primaryColor = primaryColor;
    }
    if (secondaryColor !== undefined) {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(secondaryColor)) {
        return ['El color secundario debe ser un valor Hex válido', undefined];
      }
      result.secondaryColor = secondaryColor;
    }
    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return ['isActive debe ser un booleano', undefined];
      }
      result.isActive = isActive;
    }

    return [undefined, result];
  }
}
