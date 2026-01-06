import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly code = "UNAUTHORIZED";

  constructor(message = "No autenticado") {
    super(message);
  }
}
