import { ReviewDatasource } from '../../domain/datasources/review.datasource';
import { ReviewEntity } from '../../domain/entities/review.entity';
import { CreateReviewDto } from '../../domain/dtos/review/create-review.dto';
import { ReviewModel } from './mongo/models/review.model';
import { ReviewMapper } from '../mappers/review.mapper';
import { CustomError } from '../../domain/errors/custom.error';

export class ReviewMongoDatasource implements ReviewDatasource {
  async create(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    try {
      const existingReview = await ReviewModel.findOne({
        appointmentId: createReviewDto.appointmentId,
      });

      if (existingReview) {
        throw CustomError.badRequest('Ya existe una reseña para esta cita');
      }

      const review = await ReviewModel.create(createReviewDto);
      return ReviewMapper.toEntity(review);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Error al crear reseña');
    }
  }

  async findById(id: string, businessId: string): Promise<ReviewEntity | null> {
    try {
      const review = await ReviewModel.findOne({ _id: id, businessId });
      if (!review) return null;
      return ReviewMapper.toEntity(review);
    } catch (error) {
      throw CustomError.internalServer('Error al buscar reseña');
    }
  }

  async findByBusinessId(businessId: string): Promise<ReviewEntity[]> {
    try {
      const reviews = await ReviewModel.find({ businessId }).sort({ createdAt: -1 });
      return reviews.map(ReviewMapper.toEntity);
    } catch (error) {
      throw CustomError.internalServer('Error al obtener reseñas');
    }
  }

  async findByStaffId(staffId: string, businessId: string): Promise<ReviewEntity[]> {
    try {
      const reviews = await ReviewModel.find({ staffId, businessId }).sort({ createdAt: -1 });
      return reviews.map(ReviewMapper.toEntity);
    } catch (error) {
      throw CustomError.internalServer('Error al obtener reseñas del staff');
    }
  }

  async findByAppointmentId(appointmentId: string, businessId: string): Promise<ReviewEntity | null> {
    try {
      const review = await ReviewModel.findOne({ appointmentId, businessId });
      if (!review) return null;
      return ReviewMapper.toEntity(review);
    } catch (error) {
      throw CustomError.internalServer('Error al buscar reseña por cita');
    }
  }

  async getAverageRatingByStaff(staffId: string, businessId: string): Promise<number> {
    try {
      const result = await ReviewModel.aggregate([
        { $match: { staffId, businessId } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]);

      return result.length > 0 ? result[0].avgRating : 0;
    } catch (error) {
      throw CustomError.internalServer('Error al calcular promedio de calificación');
    }
  }

  async findLowRatings(businessId: string, maxRating: number = 2): Promise<ReviewEntity[]> {
    try {
      const reviews = await ReviewModel.find({
        businessId,
        rating: { $lte: maxRating },
      }).sort({ createdAt: -1 });

      return reviews.map(ReviewMapper.toEntity);
    } catch (error) {
      throw CustomError.internalServer('Error al obtener reseñas bajas');
    }
  }
}
