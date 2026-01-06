import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  readonly code = "FORBIDDEN";

  constructor(message = "No autorizado") {
    super(message);
  }
}
