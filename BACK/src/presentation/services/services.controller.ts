import { Response, NextFunction } from 'express';
import { CreateServiceUseCase } from '../../domain/use-cases/services/create-service.use-case';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { CreateServiceDtoValidator } from '../../domain/dtos/services/create-service.dto';
import { BadRequestError } from '../../domain/errors/custom.error';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ServicesController {
  private getServiceRepository(): ServiceRepository {
    const { ServiceMongoDatasource } = require('../../infrastructure/datasources/service.mongo.datasource');
    const { ServiceRepositoryImpl } = require('../../infrastructure/repositories/service.repository.impl');
    return new ServiceRepositoryImpl(new ServiceMongoDatasource());
  }

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.businessId) throw new BadRequestError('businessId es requerido');

      const [error, dto] = CreateServiceDtoValidator.create({ ...req.body, businessId: req.businessId });
      if (error) throw new BadRequestError(error);

      const serviceRepo = this.getServiceRepository();
      const createUseCase = new CreateServiceUseCase(serviceRepo);
      const service = await createUseCase.execute(dto!);

      res.status(201).json({ ok: true, service });
    } catch (err) {
      next(err);
    }
  };

  getByBusiness = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.businessId) throw new BadRequestError('businessId es requerido');

      const serviceRepo = this.getServiceRepository();
      const services = await serviceRepo.findByBusinessId(req.businessId);

      res.json({ ok: true, services });
    } catch (err) {
      next(err);
    }
  };
}
