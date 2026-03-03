import { StaffEntity } from '../../entities/staff.entity';
import { StaffRepository } from '../../repositories/staff.repository';

export class GetStaffByBusinessUseCase {
  constructor(private readonly staffRepository: StaffRepository) {}

  async execute(businessId: string): Promise<StaffEntity[]> {
    return this.staffRepository.findByBusinessId(businessId);
  }
}
