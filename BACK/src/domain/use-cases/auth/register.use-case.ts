import { BcryptAdapter } from '../../../config/bcrypt.adapter';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { ConflictError } from '../../errors/custom.error';
import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(registerDto: RegisterDto): Promise<Omit<UserEntity, 'password'>> {
    const existing = await this.userRepository.findByEmail(registerDto.email, registerDto.businessId || '');
    if (existing) throw new ConflictError('El email ya está registrado en este negocio');

    const hashedPassword = await BcryptAdapter.hash(registerDto.password);
    const user = await this.userRepository.create({
      ...registerDto,
      role: registerDto.role ?? 'USER',
      password: hashedPassword,
      isActive: true,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
