import { NextResponse } from "next/server";
import { handleHttpError } from "@/src/shared";
import { getRealEstateProjectsController } from "@/src/modules/projects";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const numberProjects = Number(searchParams.get("numberProjects") ?? 3);

    const projects = await getRealEstateProjectsController(numberProjects);
    return NextResponse.json({ projects });
  } catch (error) {
    return handleHttpError(error);
  }
}
