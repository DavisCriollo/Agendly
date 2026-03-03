export interface UpdateFcmDto {
  fcmToken: string | null;
}

export class UpdateFcmDtoValidator {
  static create(object: { [key: string]: any }): [string?, UpdateFcmDto?] {
    const { fcmToken } = object;

    if (fcmToken === undefined) {
      return ['fcmToken es requerido', undefined];
    }
    if (fcmToken !== null && (typeof fcmToken !== 'string' || !fcmToken.trim())) {
      return ['fcmToken debe ser un string válido o null', undefined];
    }

    return [undefined, { fcmToken: fcmToken === null ? null : fcmToken.trim() }];
  }
}
