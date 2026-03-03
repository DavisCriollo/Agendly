import { ClientRepository } from '../../repositories/client.repository';
import { ClientEntity } from '../../entities/client.entity';
import { CreateClientDto } from '../../dtos/client/create-client.dto';

export class CreateClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute(createClientDto: CreateClientDto): Promise<ClientEntity> {
    return await this.repository.create(createClientDto);
  }
}
