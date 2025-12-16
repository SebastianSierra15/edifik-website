import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { Permission as PermissionEnum } from "@/src/modules/auth";
import { requireAuth, requirePermission } from "@/src/modules/auth";
import {
  searchAdminProjectsController,
  updateProjectController,
  createProjectController,
  deleteProjectStateController,
} from "@/src/modules/projects";

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const permissions = session.user.permissions ?? [];

    const policy = {
      canSeeOwnerEmail: permissions.some(
        (perm) => perm.name === PermissionEnum.ManageProjects
      ),
    };

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const pageSize = Math.max(Number(searchParams.get("pageSize") ?? 16), 1);

    const searchTerm = searchParams.get("searchTerm");

    const price = searchParams.get("price")
      ? Number(searchParams.get("price"))
      : null;

    const area = searchParams.get("area");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const lobbies = searchParams.get("lobbies");

    const projectTypeId = Number(searchParams.get("projectTypeId") ?? 1);

    const parseNumberArray = (value?: string | null): number[] | null =>
      value ? value.split(",").map(Number) : null;

    const minLat = searchParams.get("minLat")
      ? Number(searchParams.get("minLat"))
      : null;
    const maxLat = searchParams.get("maxLat")
      ? Number(searchParams.get("maxLat"))
      : null;
    const minLng = searchParams.get("minLng")
      ? Number(searchParams.get("minLng"))
      : null;
    const maxLng = searchParams.get("maxLng")
      ? Number(searchParams.get("maxLng"))
      : null;

    const result = await searchAdminProjectsController(
      {
        page,
        pageSize,
        searchTerm,
        price,
        area,
        bedrooms,
        bathrooms,
        lobbies,
        projectTypeId,
        minLat,
        maxLat,
        minLng,
        maxLng,
        cities: parseNumberArray(searchParams.get("cities")),
        propertyTypes: parseNumberArray(searchParams.get("propertyTypes")),
        housingTypes: parseNumberArray(searchParams.get("housingTypes")),
        memberships: parseNumberArray(searchParams.get("memberships")),
        commonAreas: parseNumberArray(searchParams.get("commonAreas")),
        nearbyServices: parseNumberArray(searchParams.get("nearbyServices")),
      },
      policy
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAuth();

    await requirePermission(
      PermissionEnum.ManageProjects,
      PermissionEnum.ManageOwnProperties
    );

    const permissions = session.user.permissions ?? [];

    const policy = {
      userId: Number(session.user.id),
      isClient: permissions.some(
        (p) => p.name === PermissionEnum.ManageOwnProperties
      ),
      canManageAll: permissions.some(
        (p) => p.name === PermissionEnum.ManageProjects
      ),
    };

    const body = await req.json();

    await updateProjectController(body, policy);

    return NextResponse.json(
      { message: "Proyecto actualizado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    await requirePermission(
      PermissionEnum.ManageProjects,
      PermissionEnum.ManageProperties,
      PermissionEnum.ManageOwnProperties
    );

    const permissions = session.user.permissions ?? [];

    const policy = {
      userId: Number(session.user.id),
      canManageAll: permissions.some(
        (p) => p.name === PermissionEnum.ManageProperties
      ),
      isClient: permissions.some(
        (p) => p.name === PermissionEnum.ManageOwnProperties
      ),
    };

    const body = await req.json();

    const projectId = await createProjectController(body, policy);

    return NextResponse.json(
      { message: "Proyecto creado correctamente", projectId },
      { status: 200 }
    );
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireAuth();

    await requirePermission(
      PermissionEnum.ManageProjects,
      PermissionEnum.ManageProperties,
      PermissionEnum.ManageOwnProperties
    );

    const projectId = Number(new URL(req.url).searchParams.get("id"));

    await deleteProjectStateController(projectId, {
      userId: Number(session.user.id),
      canManageAll: true,
    });

    return NextResponse.json({
      message: "Proyecto eliminado correctamente",
    });
  } catch (error) {
    return handleHttpError(error);
  }
}
