import { ReviewRepository } from '../../repositories/review.repository';
import { StaffRepository } from '../../repositories/staff.repository';
import { ReviewEntity } from '../../entities/review.entity';
import { CreateReviewDto } from '../../dtos/review/create-review.dto';
import { CustomError } from '../../errors/custom.error';

export class CreateReviewWithFeedbackUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly staffRepository: StaffRepository
  ) {}

  async execute(createReviewDto: CreateReviewDto): Promise<{
    review: ReviewEntity;
    updatedStaff: {
      averageRating: number;
      totalReviews: number;
    };
    isLowRating: boolean;
  }> {
    const review = await this.reviewRepository.create(createReviewDto);

    const staff = await this.staffRepository.findById(
      createReviewDto.staffId,
      createReviewDto.businessId
    );

    if (!staff) {
      throw CustomError.notFound('Staff no encontrado');
    }

    const currentTotal = staff.averageRating * staff.totalReviews;
    const newTotalReviews = staff.totalReviews + 1;
    const newAverageRating = (currentTotal + createReviewDto.rating) / newTotalReviews;

    await this.staffRepository.update(staff.id, createReviewDto.businessId, {
      averageRating: Math.round(newAverageRating * 100) / 100,
      totalReviews: newTotalReviews,
    });

    const isLowRating = createReviewDto.rating <= 2;

    return {
      review,
      updatedStaff: {
        averageRating: Math.round(newAverageRating * 100) / 100,
        totalReviews: newTotalReviews,
      },
      isLowRating,
    };
  }
}
