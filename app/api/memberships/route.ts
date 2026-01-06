import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import {
  requireAuthWithPermissions,
  requirePermission,
  Permission,
} from "@/src/modules/auth";
import {
  getMembershipsController,
  updateMembershipController,
} from "@/src/modules/memberships";

export async function GET(req: Request) {
  try {
    await requirePermission(Permission.ManageMemberships);

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

export async function PUT(req: Request) {
  try {
    const session = await requireAuthWithPermissions([
      Permission.ManageMemberships,
    ]);

    const body = await req.json();

    const result = await updateMembershipController({
      ...body,
      updatedBy: Number(session.user.id),
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}
