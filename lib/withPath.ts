import { NextResponse } from "next/server";

export function withPath(
  response: NextResponse,
  pathname: string
): NextResponse {
  response.headers.set("x-pathname", pathname);
  return response;
}
