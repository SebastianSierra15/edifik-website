import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { checkNameController } from "@/src/modules/nameValidation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const target = searchParams.get("target") ?? undefined;
    const name = searchParams.get("name") ?? undefined;
    const excludeId = searchParams.get("id")
      ? Number(searchParams.get("id"))
      : null;

    const result = await checkNameController({
      target,
      name,
      excludeId,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
