import { NextRequest } from "next/server";
import { PaymentsController } from "@/src/modules";
import { handleHttpError } from "@/src/shared";

export async function POST(req: NextRequest) {
  try {
    return PaymentsController.webhook(req);
  } catch (error) {
    return handleHttpError(error);
  }
}
