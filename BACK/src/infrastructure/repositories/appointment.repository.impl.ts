import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { AppointmentEntity } from '../../domain/entities/appointment.entity';
import { AppointmentDatasource } from '../../domain/datasources/appointment.datasource';
import { AppointmentMapper } from '../mappers/appointment.mapper';

export class AppointmentRepositoryImpl implements AppointmentRepository {
  constructor(private readonly datasource: AppointmentDatasource) {}

  async create(appointment: Omit<AppointmentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppointmentEntity> {
    const doc = await this.datasource.create(appointment);
    return AppointmentMapper.fromMongo(doc);
  }

  async findById(id: string, businessId: string): Promise<AppointmentEntity | null> {
    const doc = await this.datasource.findById(id, businessId);
    return doc ? AppointmentMapper.fromMongo(doc) : null;
  }

  async findByBusinessId(businessId: string, startDate?: Date, endDate?: Date): Promise<AppointmentEntity[]> {
    const docs = await this.datasource.findByBusinessId(businessId, startDate, endDate);
    return docs.map((doc) => AppointmentMapper.fromMongo(doc));
  }

  async findByStaffAndDateRange(staffId: string, businessId: string, startDate: Date, endDate: Date): Promise<AppointmentEntity[]> {
    const docs = await this.datasource.findByStaffAndDateRange(staffId, businessId, startDate, endDate);
    return docs.map((doc) => AppointmentMapper.fromMongo(doc));
  }

  async update(id: string, businessId: string, data: Partial<AppointmentEntity>): Promise<AppointmentEntity> {
    const doc = await this.datasource.update(id, businessId, data);
    return AppointmentMapper.fromMongo(doc);
  }
}
