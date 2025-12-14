import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { getUsersMetadataController } from "@/src/modules/users";

export async function GET() {
  try {
    const metadata = await getUsersMetadataController();
    return NextResponse.json(metadata);
  } catch (error) {
    return handleHttpError(error);
  }
}
