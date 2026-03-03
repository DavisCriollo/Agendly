import { Response, NextFunction } from 'express';
import { CreateStaffUseCase } from '../../domain/use-cases/staff/create-staff.use-case';
import { GetStaffByBusinessUseCase } from '../../domain/use-cases/staff/get-staff-by-business.use-case';
import { UpdateStaffUseCase } from '../../domain/use-cases/staff/update-staff.use-case';
import { StaffRepository } from '../../domain/repositories/staff.repository';
import { CreateStaffDtoValidator } from '../../domain/dtos/staff/create-staff.dto';
import { BadRequestError } from '../../domain/errors/custom.error';
import { AuthRequest } from '../middlewares/auth.middleware';

export class StaffController {
  private getStaffRepository(): StaffRepository {
    const { StaffMongoDatasource } = require('../../infrastructure/datasources/staff.mongo.datasource');
    const { StaffRepositoryImpl } = require('../../infrastructure/repositories/staff.repository.impl');
    return new StaffRepositoryImpl(new StaffMongoDatasource());
  }

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.businessId) throw new BadRequestError('businessId es requerido');

      const createData = {
        ...req.body,
        businessId: req.businessId,
        avatarUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      const [error, dto] = CreateStaffDtoValidator.create(createData);
      if (error) throw new BadRequestError(error);

      const staffRepo = this.getStaffRepository();
      const createUseCase = new CreateStaffUseCase(staffRepo);
      const staff = await createUseCase.execute(dto!);

      res.status(201).json({ ok: true, staff });
    } catch (err) {
      next(err);
    }
  };

  getByBusiness = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.businessId) throw new BadRequestError('businessId es requerido');

      const staffRepo = this.getStaffRepository();
      const getUseCase = new GetStaffByBusinessUseCase(staffRepo);
      const staff = await getUseCase.execute(req.businessId);

      res.json({ ok: true, staff });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.businessId) throw new BadRequestError('businessId es requerido');

      const { id } = req.params;
      if (!id) throw new BadRequestError('id es requerido');

      const staffRepo = this.getStaffRepository();
      const updateUseCase = new UpdateStaffUseCase(staffRepo);
      const staff = await updateUseCase.execute(id, req.businessId, req.body);

      res.json({ ok: true, staff });
    } catch (err) {
      next(err);
    }
  };
}
