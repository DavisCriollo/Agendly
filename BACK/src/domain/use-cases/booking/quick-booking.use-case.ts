import { QuickBookingDto } from '../../dtos/booking/quick-booking.dto';
import { AppointmentRepository } from '../../repositories/appointment.repository';
import { ClientRepository } from '../../repositories/client.repository';
import { UserRepository } from '../../repositories/user.repository';
import { AppointmentEntity, ClientDevice } from '../../entities/appointment.entity';
import { ClientSource } from '../../entities/client.entity';
import { CustomError } from '../../errors/custom.error';
import { UuidAdapter } from '../../../config/uuid.adapter';

export class QuickBookingUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly clientRepository: ClientRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    dto: QuickBookingDto,
    clientDevice: ClientDevice = 'web',
    clientSource: ClientSource = 'web_booking'
  ): Promise<AppointmentEntity> {
    let client = await this.clientRepository.findByEmail(dto.clientEmail || dto.clientPhone, dto.businessId);

    let isFirstTime = true;
    
    if (client) {
      const existingAppointments = await this.appointmentRepository.findByBusinessId(dto.businessId);
      isFirstTime = existingAppointments.filter(apt => apt.customerId === client!.id).length === 0;
    }

    if (!client) {
      const guestEmail = dto.clientEmail || `${dto.clientPhone.replace(/\D/g, '')}@guest.agendly.com`;
      
      let user = await this.userRepository.findByEmail(guestEmail, dto.businessId);

      if (!user) {
        const guestPassword = UuidAdapter.generate();
        
        user = await this.userRepository.create({
          businessId: dto.businessId,
          email: guestEmail,
          password: guestPassword,
          name: dto.clientName,
          phone: dto.clientPhone,
          role: 'USER',
          isActive: true,
        });
      }

      client = await this.clientRepository.create({
        businessId: dto.businessId,
        userId: user.id,
        name: dto.clientName,
        email: guestEmail,
        phone: dto.clientPhone,
        source: clientSource,
        notes: 'Cliente creado desde reserva rápida',
      });
    }

    const appointment = await this.appointmentRepository.create({
      businessId: dto.businessId,
      customerId: client.id,
      staffId: dto.staffId,
      serviceId: dto.serviceId,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'PENDING',
      isFirstTime,
      clientDevice,
      notes: dto.notes,
    });

    return appointment;
  }
}

