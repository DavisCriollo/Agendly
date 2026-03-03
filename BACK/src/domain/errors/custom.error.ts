export class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly name: string = 'Error'
  ) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): CustomError {
    return new CustomError(message, 400, 'BadRequestError');
  }

  static unauthorized(message: string): CustomError {
    return new CustomError(message, 401, 'UnauthorizedError');
  }

  static forbidden(message: string): CustomError {
    return new CustomError(message, 403, 'ForbiddenError');
  }

  static notFound(message: string): CustomError {
    return new CustomError(message, 404, 'NotFoundError');
  }

  static conflict(message: string): CustomError {
    return new CustomError(message, 409, 'ConflictError');
  }

  static internalServer(message: string = 'Error interno del servidor'): CustomError {
    return new CustomError(message, 500, 'InternalServerError');
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad Request') {
    super(message, 400, 'BadRequestError');
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UnauthorizedError');
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'ForbiddenError');
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Not Found') {
    super(message, 404, 'NotFoundError');
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Conflict') {
    super(message, 409, 'ConflictError');
  }
}
