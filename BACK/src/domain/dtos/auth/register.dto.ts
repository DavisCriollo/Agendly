import { UserRole } from '../../entities/user.entity';

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  businessId: string;
  role?: UserRole;
}

export class RegisterDtoValidator {
  static create(object: { [key: string]: any }): [string?, RegisterDto?] {
    const { email, password, name, businessId, role = 'USER' } = object;

    if (!email || typeof email !== 'string') {
      return ['El email es requerido', undefined];
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ['Email inválido', undefined];
    }
    if (!password || typeof password !== 'string') {
      return ['La contraseña es requerida', undefined];
    }
    if (password.length < 6) {
      return ['La contraseña debe tener al menos 6 caracteres', undefined];
    }
    if (!name || typeof name !== 'string') {
      return ['El nombre es requerido', undefined];
    }
    if (!businessId || typeof businessId !== 'string') {
      return ['El businessId es requerido', undefined];
    }

    const validRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'USER'];
    if (!validRoles.includes(role)) {
      return ['Rol inválido', undefined];
    }

    return [undefined, { email: email.trim(), password, name: name.trim(), businessId, role }];
  }
}
