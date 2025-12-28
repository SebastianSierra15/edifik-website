import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { getMembershipsController } from "@/src/modules/memberships";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await getMembershipsController({
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 10),
      searchTerm: searchParams.get("searchTerm"),
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
