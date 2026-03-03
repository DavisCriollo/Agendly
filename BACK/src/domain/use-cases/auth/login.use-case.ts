import { BcryptAdapter } from '../../../config/bcrypt.adapter';
import { JwtAdapter } from '../../../config/jwt.adapter';
import { LoginDto } from '../../dtos/auth/login.dto';
import { UnauthorizedError } from '../../errors/custom.error';
import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { BusinessRepository } from '../../repositories/business.repository';

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<UserEntity, 'password'>;
  theme: ThemeColors;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly businessRepository: BusinessRepository
  ) {}

  async execute(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedError('Credenciales inválidas');

    const isValid = await BcryptAdapter.compare(loginDto.password, user.password);
    if (!isValid) throw new UnauthorizedError('Credenciales inválidas');

    if (!user.isActive) throw new UnauthorizedError('Usuario desactivado');

    const token = await JwtAdapter.generateToken({
      userId: user.id,
      businessId: user.businessId || '',
      email: user.email,
      role: user.role,
    });

    const business = user.businessId ? await this.businessRepository.findById(user.businessId) : null;
    const theme: ThemeColors = business
      ? { primaryColor: business.primaryColor, secondaryColor: business.secondaryColor }
      : { primaryColor: '#4A90E2', secondaryColor: '#F5A623' };

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword, theme };
  }
}
