import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../domain/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../domain/use-cases/auth/register.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { LoginDtoValidator } from '../../domain/dtos/auth/login.dto';
import { RegisterDtoValidator } from '../../domain/dtos/auth/register.dto';
import { UpdateFcmDtoValidator } from '../../domain/dtos/auth/update-fcm.dto';
import { BadRequestError } from '../../domain/errors/custom.error';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  private loginUseCase: LoginUseCase;
  private registerUseCase: RegisterUseCase;

  constructor() {
    const userRepo = this.getUserRepository();
    const businessRepo = this.getBusinessRepository();
    this.loginUseCase = new LoginUseCase(userRepo, businessRepo);
    this.registerUseCase = new RegisterUseCase(userRepo);
  }

  private getBusinessRepository() {
    const { BusinessMongoDatasource } = require('../../infrastructure/datasources/business.mongo.datasource');
    const { BusinessRepositoryImpl } = require('../../infrastructure/repositories/business.repository.impl');
    return new BusinessRepositoryImpl(new BusinessMongoDatasource());
  }

  private getUserRepository(): UserRepository {
    const { UserMongoDatasource } = require('../../infrastructure/datasources/user.mongo.datasource');
    const { UserRepositoryImpl } = require('../../infrastructure/repositories/user.repository.impl');
    return new UserRepositoryImpl(new UserMongoDatasource());
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [error, dto] = LoginDtoValidator.create(req.body);
      if (error) throw new BadRequestError(error);

      const result = await this.loginUseCase.execute(dto!);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [error, dto] = RegisterDtoValidator.create(req.body);
      if (error) throw new BadRequestError(error);

      const user = await this.registerUseCase.execute(dto!);
      res.status(201).json({ ok: true, user });
    } catch (err) {
      next(err);
    }
  };

  updateFcmToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const [error, dto] = UpdateFcmDtoValidator.create(req.body);
      if (error) throw new BadRequestError(error);

      const userRepo = this.getUserRepository();
      await userRepo.updateFcmToken(req.userId!, dto!.fcmToken);
      res.json({ ok: true, message: 'FCM token actualizado' });
    } catch (err) {
      next(err);
    }
  };
}
