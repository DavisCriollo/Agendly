import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../dtos/client/create-client.dto';

export abstract class ClientDatasource {
  abstract create(createClientDto: CreateClientDto): Promise<ClientEntity>;
  abstract findById(id: string, businessId: string): Promise<ClientEntity | null>;
  abstract findByBusinessId(businessId: string): Promise<ClientEntity[]>;
  abstract findByEmail(email: string, businessId: string): Promise<ClientEntity | null>;
  abstract update(id: string, businessId: string, updateData: Partial<ClientEntity>): Promise<ClientEntity>;
  abstract delete(id: string, businessId: string): Promise<void>;
}
