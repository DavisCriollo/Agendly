import { Request, Response, NextFunction } from 'express';
import { CreateBusinessUseCase } from '../../domain/use-cases/business/create-business.use-case';
import { UpdateBusinessUseCase } from '../../domain/use-cases/business/update-business.use-case';
import { BusinessRepository } from '../../domain/repositories/business.repository';
import { CreateBusinessDtoValidator } from '../../domain/dtos/business/create-business.dto';
import { UpdateBusinessDtoValidator } from '../../domain/dtos/business/update-business.dto';
import { BadRequestError } from '../../domain/errors/custom.error';
import { envs } from '../../config/envs';

export class BusinessController {
  constructor(
    private readonly createUseCase: CreateBusinessUseCase = new CreateBusinessUseCase(this.getBusinessRepository()),
    private readonly updateUseCase: UpdateBusinessUseCase = new UpdateBusinessUseCase(this.getBusinessRepository())
  ) {}

  private getBusinessRepository(): BusinessRepository {
    const { BusinessMongoDatasource } = require('../../infrastructure/datasources/business.mongo.datasource');
    const { BusinessRepositoryImpl } = require('../../infrastructure/repositories/business.repository.impl');
    return new BusinessRepositoryImpl(new BusinessMongoDatasource());
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [error, dto] = CreateBusinessDtoValidator.create(req.body);
      if (error) throw new BadRequestError(error);

      const business = await this.createUseCase.execute(dto!);
      res.status(201).json({ ok: true, business });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const repo = this.getBusinessRepository();
      const business = await repo.findById(id);
      if (!business) {
        return res.status(404).json({ ok: false, error: 'Negocio no encontrado' });
      }
      res.json({ ok: true, business });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const updateData: any = { ...req.body };
      if (req.file) {
        updateData.logoUrl = `/uploads/${req.file.filename}`;
      }

      const [error, dto] = UpdateBusinessDtoValidator.create(updateData);
      if (error) throw new BadRequestError(error);
      const finalDto = { ...dto, ...(req.file && { logoUrl: `/uploads/${req.file.filename}` }) };
      if (Object.keys(finalDto).length === 0) {
        throw new BadRequestError('No hay datos para actualizar');
      }

      const business = await this.updateUseCase.execute(id, finalDto);
      res.json({ ok: true, business });
    } catch (err) {
      next(err);
    }
  };
}
