import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import { User } from "@/lib/definitios";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const [result] = await db.query("CALL get_user(?)", [email]);

  const row = (result as RowDataPacket[][])[0][0];

  if (!row) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user: User = {
    id: row.id,
    names: row.names,
    lastnames: row.lastnames,
    email: row.email,
    password: row.password,
    role: row.roleId,
    membershipId: row.membershipId,
  };

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (passwordsMatch) {
    return NextResponse.json({
      id: user.id,
      names: user.names,
      email: user.email,
      role: user.role,
      membershipId: user.membershipId,
    });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
