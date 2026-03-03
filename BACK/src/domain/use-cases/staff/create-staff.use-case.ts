import { CreateStaffDto } from '../../dtos/staff/create-staff.dto';
import { StaffEntity } from '../../entities/staff.entity';
import { StaffRepository } from '../../repositories/staff.repository';

export class CreateStaffUseCase {
  constructor(private readonly staffRepository: StaffRepository) {}

  async execute(dto: CreateStaffDto): Promise<StaffEntity> {
    return this.staffRepository.create({
      ...dto,
      workingHours: [],
      averageRating: 0,
      totalReviews: 0,
      isActive: true,
    });
  }
}
