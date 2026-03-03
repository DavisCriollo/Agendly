import { ReviewEntity } from '../../domain/entities/review.entity';
import { IReview } from '../datasources/mongo/models/review.model';

export class ReviewMapper {
  static toEntity(model: IReview): ReviewEntity {
    return {
      id: model._id.toString(),
      businessId: model.businessId,
      appointmentId: model.appointmentId,
      staffId: model.staffId,
      clientId: model.clientId,
      rating: model.rating,
      comment: model.comment,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
