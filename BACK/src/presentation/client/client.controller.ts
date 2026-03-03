import { Request, Response } from 'express';
import { CreateClientDto } from '../../domain/dtos/client/create-client.dto';
import { CreateClientUseCase } from '../../domain/use-cases/client/create-client.use-case';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { CustomError } from '../../domain/errors/custom.error';

export class ClientController {
  constructor(private readonly clientRepository: ClientRepository) {}

  createClient = async (req: Request, res: Response) => {
    try {
      const [error, createClientDto] = CreateClientDto.create(req.body);
      if (error) return res.status(400).json({ success: false, error });

      const useCase = new CreateClientUseCase(this.clientRepository);
      const client = await useCase.execute(createClientDto!);

      res.status(201).json({ success: true, data: client });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  getClients = async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const clients = await this.clientRepository.findByBusinessId(businessId);

      res.json({ success: true, data: clients });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };

  getClientById = async (req: Request, res: Response) => {
    try {
      const { businessId, clientId } = req.params;
      const client = await this.clientRepository.findById(clientId, businessId);

      if (!client) {
        return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
      }

      res.json({ success: true, data: client });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  };
}
