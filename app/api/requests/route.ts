import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requireAuthWithPermissions,
  requirePermission,
  Permission,
} from "@/src/modules/auth";
import {
  getRequestsController,
  updateRequestController,
} from "@/src/modules/requests";

export async function GET(req: Request) {
  try {
    await requirePermission(Permission.ManageRequests);

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);
    const searchTerm = searchParams.get("searchTerm");

    const result = await getRequestsController({
      page,
      pageSize,
      searchTerm,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAuthWithPermissions([
      Permission.ManageRequests,
    ]);

    const body = await req.json();

    const result = await updateRequestController({
      ...body,
      reviewerId: Number(session.user.id),
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
