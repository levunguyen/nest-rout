import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookieConfig, revokeSessionFromRequest } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    await revokeSessionFromRequest(request);
    const response = NextResponse.json({ data: { success: true } });
    const cookieConfig = getSessionCookieConfig();
    response.cookies.set(cookieConfig.name, "", { ...cookieConfig, maxAge: 0 });
    return response;
  } catch (error) {
    console.error("Logout error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
