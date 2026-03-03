import { ReviewRepository } from '../../repositories/review.repository';
import { ReviewEntity } from '../../entities/review.entity';
import { CreateReviewDto } from '../../dtos/review/create-review.dto';

export class CreateReviewUseCase {
  constructor(private readonly repository: ReviewRepository) {}

  async execute(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    return await this.repository.create(createReviewDto);
  }
}
