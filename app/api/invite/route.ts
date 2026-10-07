import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "../../../lib/server/supabaseAdmin";

export async function POST(request: Request) {
  const admin = createSupabaseAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Supabase admin nao configurado." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const email = String(body.email || "").trim();
  const modules = body.modules || {};

  if (!email) {
    return NextResponse.json(
      { error: "Informe o e-mail do gestor." },
      { status: 400 }
    );
  }

  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || ""}/login`;

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: {
      role: "gestor",
      modules
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    userId: data.user?.id || null
  });
}
