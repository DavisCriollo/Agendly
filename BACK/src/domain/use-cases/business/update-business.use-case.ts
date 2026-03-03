import { UpdateBusinessDto } from '../../dtos/business/update-business.dto';
import { NotFoundError } from '../../errors/custom.error';
import { BusinessEntity } from '../../entities/business.entity';
import { BusinessRepository } from '../../repositories/business.repository';

export class UpdateBusinessUseCase {
  constructor(private readonly businessRepository: BusinessRepository) {}

  async execute(businessId: string, dto: UpdateBusinessDto): Promise<BusinessEntity> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) throw new NotFoundError('Negocio no encontrado');

    return this.businessRepository.update(businessId, dto);
  }
}
