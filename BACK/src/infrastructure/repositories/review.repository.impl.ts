import { ReviewRepository } from '../../domain/repositories/review.repository';
import { ReviewEntity } from '../../domain/entities/review.entity';
import { CreateReviewDto } from '../../domain/dtos/review/create-review.dto';
import { ReviewDatasource } from '../../domain/datasources/review.datasource';

export class ReviewRepositoryImpl implements ReviewRepository {
  constructor(private readonly datasource: ReviewDatasource) {}

  create(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    return this.datasource.create(createReviewDto);
  }

  findById(id: string, businessId: string): Promise<ReviewEntity | null> {
    return this.datasource.findById(id, businessId);
  }

  findByBusinessId(businessId: string): Promise<ReviewEntity[]> {
    return this.datasource.findByBusinessId(businessId);
  }

  findByStaffId(staffId: string, businessId: string): Promise<ReviewEntity[]> {
    return this.datasource.findByStaffId(staffId, businessId);
  }

  findByAppointmentId(appointmentId: string, businessId: string): Promise<ReviewEntity | null> {
    return this.datasource.findByAppointmentId(appointmentId, businessId);
  }

  getAverageRatingByStaff(staffId: string, businessId: string): Promise<number> {
    return this.datasource.getAverageRatingByStaff(staffId, businessId);
  }

  findLowRatings(businessId: string, maxRating: number): Promise<ReviewEntity[]> {
    return this.datasource.findLowRatings(businessId, maxRating);
  }
}
