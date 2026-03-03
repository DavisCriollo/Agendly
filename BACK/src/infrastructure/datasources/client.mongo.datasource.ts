import { ClientDatasource } from '../../domain/datasources/client.datasource';
import { ClientEntity } from '../../domain/entities/client.entity';
import { CreateClientDto } from '../../domain/dtos/client/create-client.dto';
import { ClientModel } from './mongo/models/client.model';
import { ClientMapper } from '../mappers/client.mapper';
import { CustomError } from '../../domain/errors/custom.error';

export class ClientMongoDatasource implements ClientDatasource {
  async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
    try {
      const existingClient = await ClientModel.findOne({
        businessId: createClientDto.businessId,
        email: createClientDto.email,
      });

      if (existingClient) {
        throw CustomError.badRequest('El cliente ya existe en este negocio');
      }

      const client = await ClientModel.create(createClientDto);
      return ClientMapper.toEntity(client);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Error al crear cliente');
    }
  }

  async findById(id: string, businessId: string): Promise<ClientEntity | null> {
    try {
      const client = await ClientModel.findOne({ _id: id, businessId });
      if (!client) return null;
      return ClientMapper.toEntity(client);
    } catch (error) {
      throw CustomError.internalServer('Error al buscar cliente');
    }
  }

  async findByBusinessId(businessId: string): Promise<ClientEntity[]> {
    try {
      const clients = await ClientModel.find({ businessId, isActive: true });
      return clients.map(ClientMapper.toEntity);
    } catch (error) {
      throw CustomError.internalServer('Error al obtener clientes');
    }
  }

  async findByEmail(email: string, businessId: string): Promise<ClientEntity | null> {
    try {
      const client = await ClientModel.findOne({ email, businessId });
      if (!client) return null;
      return ClientMapper.toEntity(client);
    } catch (error) {
      throw CustomError.internalServer('Error al buscar cliente por email');
    }
  }

  async update(id: string, businessId: string, updateData: Partial<ClientEntity>): Promise<ClientEntity> {
    try {
      const client = await ClientModel.findOneAndUpdate(
        { _id: id, businessId },
        updateData,
        { new: true }
      );

      if (!client) {
        throw CustomError.notFound('Cliente no encontrado');
      }

      return ClientMapper.toEntity(client);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Error al actualizar cliente');
    }
  }

  async delete(id: string, businessId: string): Promise<void> {
    try {
      const client = await ClientModel.findOneAndUpdate(
        { _id: id, businessId },
        { isActive: false },
        { new: true }
      );

      if (!client) {
        throw CustomError.notFound('Cliente no encontrado');
      }
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Error al eliminar cliente');
    }
  }
}
