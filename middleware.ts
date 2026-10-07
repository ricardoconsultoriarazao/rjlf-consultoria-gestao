import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = process.env.CONSULTANT_SESSION_TOKEN;
  const currentToken = request.cookies.get("rjlf_consultor_session")?.value;

  if (sessionToken && currentToken === sessionToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/consultor-login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/consultor"]
};
