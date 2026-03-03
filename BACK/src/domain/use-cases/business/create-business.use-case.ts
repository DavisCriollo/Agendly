import { CreateBusinessDto } from '../../dtos/business/create-business.dto';
import { ConflictError } from '../../errors/custom.error';
import { BusinessEntity } from '../../entities/business.entity';
import { BusinessRepository } from '../../repositories/business.repository';

export class CreateBusinessUseCase {
  constructor(private readonly businessRepository: BusinessRepository) {}

  async execute(dto: CreateBusinessDto): Promise<BusinessEntity> {
    const existing = await this.businessRepository.findBySlug(dto.slug);
    if (existing) throw new ConflictError('Ya existe un negocio con ese slug');

    return this.businessRepository.create({
      ...dto,
      subscriptionPlan: 'FREE',
      storageUsed: 0,
      isActive: true,
    });
  }
}
