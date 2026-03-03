import { ReviewEntity } from '../entities/review.entity';
import { CreateReviewDto } from '../dtos/review/create-review.dto';

export abstract class ReviewDatasource {
  abstract create(createReviewDto: CreateReviewDto): Promise<ReviewEntity>;
  abstract findById(id: string, businessId: string): Promise<ReviewEntity | null>;
  abstract findByBusinessId(businessId: string): Promise<ReviewEntity[]>;
  abstract findByStaffId(staffId: string, businessId: string): Promise<ReviewEntity[]>;
  abstract findByAppointmentId(appointmentId: string, businessId: string): Promise<ReviewEntity | null>;
  abstract getAverageRatingByStaff(staffId: string, businessId: string): Promise<number>;
  abstract findLowRatings(businessId: string, maxRating: number): Promise<ReviewEntity[]>;
}
