import { StaffEntity } from '../../entities/staff.entity';
import { StaffRepository } from '../../repositories/staff.repository';

export class UpdateStaffUseCase {
  constructor(private readonly staffRepository: StaffRepository) {}

  async execute(
    id: string,
    businessId: string,
    data: Partial<StaffEntity>
  ): Promise<StaffEntity> {
    return this.staffRepository.update(id, businessId, data);
  }
}
