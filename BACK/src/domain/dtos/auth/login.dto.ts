import { UserEntity } from '../../entities/user.entity';

export interface LoginDto {
  email: string;
  password: string;
}

export class LoginDtoValidator {
  static create(object: { [key: string]: any }): [string?, LoginDto?] {
    const { email, password } = object;

    if (!email || typeof email !== 'string') {
      return ['El email es requerido', undefined];
    }
    if (!password || typeof password !== 'string') {
      return ['La contraseña es requerida', undefined];
    }
    if (password.length < 6) {
      return ['La contraseña debe tener al menos 6 caracteres', undefined];
    }

    return [undefined, { email: email.trim(), password }];
  }
}
