import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import { UserData } from "@/lib/definitios";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const [result] = await db.query("CALL get_user(?)", [email]);

  const row = (result as RowDataPacket[][])[0][0];

  if (!row) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user: UserData = {
    id: row.id,
    names: row.names,
    lastnames: row.lastnames,
    email: row.email,
    password: row.password,
    roleId: row.roleId,
    membershipId: row.membershipId,
  };

  const passwordsMatch = await bcrypt.compare(password, user.password || "");

  if (passwordsMatch) {
    return NextResponse.json({
      id: user.id,
      names: user.names,
      email: user.email,
      role: user.roleId,
      membershipId: user.membershipId,
    });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
