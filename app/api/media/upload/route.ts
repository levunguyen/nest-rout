import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { requireActiveTenant } from "@/lib/auth/guard";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

const EXTENSIONS_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
  "video/webm": ".webm",
};

const sanitizeBaseName = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "")
    .slice(0, 80);

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireActiveTenant(request);
    if (error || !session) return error;

    const formData = await request.formData();
    const fileValue = formData.get("file");
    if (!(fileValue instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (!fileValue.size) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }
    if (fileValue.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });
    }
    if (!ALLOWED_MIME_TYPES.has(fileValue.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const extFromMime = EXTENSIONS_BY_MIME[fileValue.type] ?? "";
    const originalName = fileValue.name || "upload";
    const nameWithoutExt = originalName.includes(".")
      ? originalName.slice(0, originalName.lastIndexOf("."))
      : originalName;
    const safeBase = sanitizeBaseName(nameWithoutExt) || "media";
    const filename = `${Date.now()}-${safeBase}-${randomUUID().slice(0, 8)}${extFromMime}`;

    const tenantId = session.activeFamilyTreeId!;
    const tenantDir = path.join(process.cwd(), "public", "uploads", tenantId);
    await mkdir(tenantDir, { recursive: true });

    const arrayBuffer = await fileValue.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const savedPath = path.join(tenantDir, filename);
    await writeFile(savedPath, fileBuffer);

    const publicUrl = `/uploads/${tenantId}/${filename}`;
    return NextResponse.json({
      data: {
        url: publicUrl,
        sizeMb: Number((fileValue.size / (1024 * 1024)).toFixed(2)),
        mimeType: fileValue.type,
        originalName,
      },
    });
  } catch (err) {
    console.error("Media upload error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
