import { NextResponse } from "next/server";

const cookieName = "rjlf_consultor_session";

export async function POST(request: Request) {
  const configuredPassword = process.env.CONSULTANT_PASSWORD;
  const sessionToken = process.env.CONSULTANT_SESSION_TOKEN;

  if (!configuredPassword || !sessionToken) {
    return NextResponse.json(
      {
        error:
          "Senha do consultor nao configurada. Configure CONSULTANT_PASSWORD e CONSULTANT_SESSION_TOKEN na Vercel."
      },
      { status: 500 }
    );
  }

  const body = await request.json();
  const password = String(body.password || "");

  if (password !== configuredPassword) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
