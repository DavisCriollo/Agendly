export class CreateReviewDto {
  private constructor(
    public readonly businessId: string,
    public readonly appointmentId: string,
    public readonly staffId: string,
    public readonly clientId: string,
    public readonly rating: number,
    public readonly comment?: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateReviewDto?] {
    const { businessId, appointmentId, staffId, clientId, rating, comment } = object;

    if (!businessId) return ['businessId es requerido'];
    if (!appointmentId) return ['appointmentId es requerido'];
    if (!staffId) return ['staffId es requerido'];
    if (!clientId) return ['clientId es requerido'];
    if (!rating) return ['rating es requerido'];

    if (rating < 1 || rating > 5) return ['rating debe estar entre 1 y 5'];

    return [undefined, new CreateReviewDto(businessId, appointmentId, staffId, clientId, rating, comment)];
  }
}
