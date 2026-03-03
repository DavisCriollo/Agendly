import { Request, Response } from 'express';
import { CreateReviewDto } from '../../domain/dtos/review/create-review.dto';
import { CreateReviewWithFeedbackUseCase } from '../../domain/use-cases/review/create-review-with-feedback.use-case';
import { ReviewRepository } from '../../domain/repositories/review.repository';
import { StaffRepository } from '../../domain/repositories/staff.repository';
import { CustomError } from '../../domain/errors/custom.error';
import { SocketService } from '../../infrastructure/services/socket.service';

export class ReviewController {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly staffRepository: StaffRepository
  ) {}

  createReview = async (req: Request, res: Response) => {
    try {
      const [error, createReviewDto] = CreateReviewDto.create(req.body);
      if (error) return res.status(400).json({ success: false, error });

      const useCase = new CreateReviewWithFeedbackUseCase(
        this.reviewRepository,
        this.staffRepository
      );
      
      const result = await useCase.execute(createReviewDto!);

      SocketService.emitNewReview(result.review.businessId, {
        review: result.review,
        staffUpdate: result.updatedStaff,
      });

      if (result.isLowRating) {
        SocketService.emitLowRatingAlert(result.review.businessId, {
          review: result.review,
          staffId: result.review.staffId,
          currentRating: result.updatedStaff.averageRating,
        });
      }

      res.status(201).json({
        success: true,
        data: {
          review: result.review,
          staffUpdate: result.updatedStaff,
        },
        message: result.isLowRating
          ? 'Reseña creada. Se ha notificado al administrador sobre la calificación baja.'
          : 'Reseña creada exitosamente.',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  getReviewsByBusiness = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const reviews = await this.reviewRepository.findByBusinessId(businessId);

      res.json({ success: true, data: reviews });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  getReviewsByStaff = async (req: Request, res: Response) => {
    try {
      const { businessId, staffId } = req.params;
      const reviews = await this.reviewRepository.findByStaffId(staffId, businessId);

      res.json({ success: true, data: reviews });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  getStaffAverageRating = async (req: Request, res: Response) => {
    try {
      const { businessId, staffId } = req.params;
      const averageRating = await this.reviewRepository.getAverageRatingByStaff(staffId, businessId);

      res.json({ success: true, data: { staffId, averageRating } });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };
}
