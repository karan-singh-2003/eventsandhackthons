import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import uploadCloudinary from "@/lib/uploadcloudanary";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const tempPath = join("/tmp", file.name);
  await writeFile(tempPath, buffer);
    const url = await uploadCloudinary(tempPath);

  return NextResponse.json({ url });
}
