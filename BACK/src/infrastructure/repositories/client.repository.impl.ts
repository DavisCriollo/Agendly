import { ClientRepository } from '../../domain/repositories/client.repository';
import { ClientEntity } from '../../domain/entities/client.entity';
import { CreateClientDto } from '../../domain/dtos/client/create-client.dto';
import { ClientDatasource } from '../../domain/datasources/client.datasource';

export class ClientRepositoryImpl implements ClientRepository {
  constructor(private readonly datasource: ClientDatasource) {}

  create(createClientDto: CreateClientDto): Promise<ClientEntity> {
    return this.datasource.create(createClientDto);
  }

  findById(id: string, businessId: string): Promise<ClientEntity | null> {
    return this.datasource.findById(id, businessId);
  }

  findByBusinessId(businessId: string): Promise<ClientEntity[]> {
    return this.datasource.findByBusinessId(businessId);
  }

  findByEmail(email: string, businessId: string): Promise<ClientEntity | null> {
    return this.datasource.findByEmail(email, businessId);
  }

  update(id: string, businessId: string, updateData: Partial<ClientEntity>): Promise<ClientEntity> {
    return this.datasource.update(id, businessId, updateData);
  }

  delete(id: string, businessId: string): Promise<void> {
    return this.datasource.delete(id, businessId);
  }
}
