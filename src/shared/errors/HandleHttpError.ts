import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./AppError";
import { InternalServerError } from "./InternalServerError";

export function handleHttpError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        details: error.flatten(),
      },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.code,
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  const internalError = new InternalServerError();
  console.error(error);

  return NextResponse.json(
    {
      error: internalError.code,
      message: internalError.message,
    },
    { status: internalError.statusCode }
  );
}
