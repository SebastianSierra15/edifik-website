import { NextRequest, NextResponse } from "next/server";
import { updateMembershipUseCase } from "..";
import { validateRequest } from "@/src/shared";
import { updateMembershipSchema } from "../application/dto/updateMembership.schema";

export class MembershipsController {
  static async update(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();

    const dto = validateRequest(updateMembershipSchema, body);

    const result = await updateMembershipUseCase.execute(dto);

    return NextResponse.json(result, { status: 200 });
  }
}
