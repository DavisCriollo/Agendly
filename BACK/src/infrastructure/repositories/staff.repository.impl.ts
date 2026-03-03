import { StaffRepository } from '../../domain/repositories/staff.repository';
import { StaffEntity } from '../../domain/entities/staff.entity';
import { StaffDatasource } from '../../domain/datasources/staff.datasource';
import { StaffMapper } from '../mappers/staff.mapper';

export class StaffRepositoryImpl implements StaffRepository {
  constructor(private readonly datasource: StaffDatasource) {}

  async create(staff: Omit<StaffEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<StaffEntity> {
    const doc = await this.datasource.create(staff);
    return StaffMapper.fromMongo(doc);
  }

  async findByBusinessId(businessId: string): Promise<StaffEntity[]> {
    const docs = await this.datasource.findByBusinessId(businessId);
    return docs.map((doc) => StaffMapper.fromMongo(doc));
  }

  async findById(id: string, businessId: string): Promise<StaffEntity | null> {
    const doc = await this.datasource.findById(id, businessId);
    return doc ? StaffMapper.fromMongo(doc) : null;
  }

  async update(id: string, businessId: string, data: Partial<StaffEntity>): Promise<StaffEntity> {
    const doc = await this.datasource.update(id, businessId, data);
    return StaffMapper.fromMongo(doc);
  }
}
