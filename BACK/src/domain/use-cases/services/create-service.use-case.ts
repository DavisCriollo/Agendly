import { CreateServiceDto } from '../../dtos/services/create-service.dto';
import { ServiceEntity } from '../../entities/service.entity';
import { ServiceRepository } from '../../repositories/service.repository';

export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(dto: CreateServiceDto): Promise<ServiceEntity> {
    return this.serviceRepository.create({
      ...dto,
      costOfService: 0,
      category: 'General',
      isActive: true,
    });
  }
}
