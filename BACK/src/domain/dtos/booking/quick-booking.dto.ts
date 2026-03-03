export class QuickBookingDto {
  private constructor(
    public readonly businessId: string,
    public readonly staffId: string,
    public readonly serviceId: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly clientName: string,
    public readonly clientPhone: string,
    public readonly clientEmail?: string,
    public readonly notes?: string
  ) {}

  static create(object: { [key: string]: any }): [string?, QuickBookingDto?] {
    const {
      businessId,
      staffId,
      serviceId,
      startTime,
      endTime,
      clientName,
      clientPhone,
      clientEmail,
      notes,
    } = object;

    if (!businessId) return ['businessId es requerido'];
    if (!staffId) return ['staffId es requerido'];
    if (!serviceId) return ['serviceId es requerido'];
    if (!startTime) return ['startTime es requerido'];
    if (!endTime) return ['endTime es requerido'];
    if (!clientName) return ['clientName es requerido'];
    if (!clientPhone) return ['clientPhone es requerido'];

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(clientPhone)) {
      return ['Formato de teléfono inválido'];
    }

    if (clientEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientEmail)) {
        return ['Email inválido'];
      }
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return ['Fechas inválidas'];
    }

    if (start >= end) {
      return ['La fecha de inicio debe ser anterior a la fecha de fin'];
    }

    return [
      undefined,
      new QuickBookingDto(
        businessId,
        staffId,
        serviceId,
        start,
        end,
        clientName.trim(),
        clientPhone.trim(),
        clientEmail?.trim(),
        notes?.trim()
      ),
    ];
  }
}
