import { Router } from 'express';
import { ClientController } from './client.controller';
import { ClientMongoDatasource } from '../../infrastructure/datasources/client.mongo.datasource';
import { ClientRepositoryImpl } from '../../infrastructure/repositories/client.repository.impl';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

export class ClientRoutes {
  static get routes(): Router {
    const router = Router();
    const datasource = new ClientMongoDatasource();
    const repository = new ClientRepositoryImpl(datasource);
    const controller = new ClientController(repository);

    router.post(
      '/',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'STAFF'])],
      controller.createClient
    );

    router.get(
      '/business/:businessId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'STAFF'])],
      controller.getClients
    );

    router.get(
      '/business/:businessId/:clientId',
      [AuthMiddleware.validateJWT, RoleMiddleware.validateRole(['ADMIN', 'STAFF'])],
      controller.getClientById
    );

    return router;
  }
}
