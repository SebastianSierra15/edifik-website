import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  readonly statusCode = 400;
  readonly code = "BAD_REQUEST";

  constructor(message: string) {
    super(message);
  }
}
