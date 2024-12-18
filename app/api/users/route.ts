import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { User, Role, MembershipSummary, Gender } from "@/lib/definitios";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const searchTerm = searchParams.get("searchTerm") || null;

  try {
    const [result] = await db.query("CALL get_users_setup_data(?, ?, ?)", [
      page,
      pageSize,
      searchTerm,
    ]);

    const userRows = (result as RowDataPacket[][])[0];
    const totalEntriesRow = (result as RowDataPacket[][])[1][0];
    const totalEntries = totalEntriesRow.totalEntries;
    const rolesRows = (result as RowDataPacket[][])[2];
    const gendersRows = (result as RowDataPacket[][])[3];
    const membershipsRows = (result as RowDataPacket[][])[4];

    const users: User[] = userRows.map((row: any) => ({
      id: row.id,
      username: row.username,
      names: row.names,
      lastnames: row.lastnames,
      email: row.email,
      phoneNumber: row.phoneNumber,
      gender: row.genderName,
      state: row.state,
      registrationDate: row.registrationDate,
      lastLogin: row.lastLogin,
      roleId: row.roleId,
      roleName: row.roleName,
      membershipId: row.membershipId,
      membershipName: row.membershipName,
      provider: row.providerName,
    }));

    const roles: Role[] = rolesRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    const memberships: MembershipSummary[] = membershipsRows.map(
      (row: any) => ({
        id: row.id,
        name: row.name,
      })
    );

    const genders: Gender[] = gendersRows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));

    return NextResponse.json({
      users,
      totalEntries,
      roles,
      memberships,
      genders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al recuperar los usuarios" },
      { status: 500 }
    );
  }
}
