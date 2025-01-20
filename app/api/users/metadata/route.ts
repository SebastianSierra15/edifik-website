import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Role, MembershipSummary, Gender } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const [result] = await db.query<RowDataPacket[][]>(
      "CALL get_users_metadata()"
    );

    const [rolesRows = [], gendersRows = [], membershipsRows = []] = result;

    const roles: Role[] = rolesRows.map(({ id, name }) => ({ id, name }));
    const memberships: MembershipSummary[] = membershipsRows.map(
      ({ id, name }) => ({ id, name })
    );
    const genders: Gender[] = gendersRows.map(({ id, name }) => ({ id, name }));

    return NextResponse.json({
      roles,
      memberships,
      genders,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { error: "Error al recuperar los datos" },
      { status: 500 }
    );
  }
}
