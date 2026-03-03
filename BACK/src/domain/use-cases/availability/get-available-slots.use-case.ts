import { StaffRepository } from '../../repositories/staff.repository';
import { AppointmentRepository } from '../../repositories/appointment.repository';
import { ServiceRepository } from '../../repositories/service.repository';
import { CustomError } from '../../errors/custom.error';

export interface AvailableSlot {
  startTime: Date;
  endTime: Date;
}

interface GetAvailableSlotsDto {
  businessId: string;
  staffId: string;
  serviceId: string;
  date: Date;
}

export class GetAvailableSlotsUseCase {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly appointmentRepository: AppointmentRepository,
    private readonly serviceRepository: ServiceRepository
  ) {}

  async execute(dto: GetAvailableSlotsDto): Promise<AvailableSlot[]> {
    const { businessId, staffId, serviceId, date } = dto;

    const staff = await this.staffRepository.findById(staffId, businessId);
    if (!staff) {
      throw CustomError.notFound('Staff no encontrado');
    }

    const service = await this.serviceRepository.findById(serviceId, businessId);
    if (!service) {
      throw CustomError.notFound('Servicio no encontrado');
    }

    const dayOfWeek = date.getDay();
    const workingDay = staff.workingHours.find(
      (wh) => wh.day === dayOfWeek && wh.isActive
    );

    if (!workingDay) {
      return [];
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentRepository.findByStaffAndDateRange(
      staffId,
      businessId,
      startOfDay,
      endOfDay
    );

    const bookedSlots = appointments
      .filter((apt) => apt.status !== 'CANCELLED' && apt.status !== 'NO_SHOW')
      .map((apt) => ({
        startTime: apt.startTime,
        endTime: apt.endTime,
      }));

    const [startHour, startMinute] = workingDay.startTime.split(':').map(Number);
    const [endHour, endMinute] = workingDay.endTime.split(':').map(Number);

    const workStart = new Date(date);
    workStart.setHours(startHour, startMinute, 0, 0);

    const workEnd = new Date(date);
    workEnd.setHours(endHour, endMinute, 0, 0);

    const availableSlots: AvailableSlot[] = [];
    const serviceDuration = service.duration * 60 * 1000;
    const slotInterval = 30 * 60 * 1000;

    let currentTime = workStart.getTime();

    while (currentTime + serviceDuration <= workEnd.getTime()) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime + serviceDuration);

      const isAvailable = !bookedSlots.some((booked) => {
        const bookedStart = booked.startTime.getTime();
        const bookedEnd = booked.endTime.getTime();

        return (
          (currentTime >= bookedStart && currentTime < bookedEnd) ||
          (currentTime + serviceDuration > bookedStart &&
            currentTime + serviceDuration <= bookedEnd) ||
          (currentTime <= bookedStart && currentTime + serviceDuration >= bookedEnd)
        );
      });

      if (isAvailable) {
        availableSlots.push({
          startTime: slotStart,
          endTime: slotEnd,
        });
      }

      currentTime += slotInterval;
    }

    return availableSlots;
  }
}
