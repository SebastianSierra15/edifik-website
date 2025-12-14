import { AppError } from "./AppError";

export class InternalServerError extends AppError {
  readonly statusCode = 500;
  readonly code = "INTERNAL_ERROR";

  constructor(message = "Error interno del servidor") {
    super(message);
  }
}
