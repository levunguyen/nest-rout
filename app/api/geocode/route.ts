import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/guard";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    if (q.length < 2 || q.length > 160) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", q);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "nest-rout/1.0 (family-map-feature)",
        "Accept-Language": "vi,en",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 502 });
    }

    const payload = (await response.json()) as NominatimResult[];
    const first = payload[0];
    if (!first) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({
      data: {
        lat: Number(first.lat),
        lng: Number(first.lon),
        label: first.display_name,
      },
    });
  } catch (err) {
    console.error("Geocode error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
