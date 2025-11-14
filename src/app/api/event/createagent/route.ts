// app/api/agent/createagent/route.ts
// this is not belong to my event site only for photo upload purpose  
// http://localhost:3000/workspace/itian-club/event/photo
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import uploadCloudinary from "@/lib/uploadcloudanary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const imageFile = formData.get("file") as File | null;
    const imageUrlInput = formData.get("imageurl") as string | null;

    let imageUrl = imageUrlInput || "";

    // ✅ If file uploaded, upload to Cloudinary
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const tempPath = join("/tmp", imageFile.name);
      await writeFile(tempPath, buffer);

      imageUrl = await uploadCloudinary(tempPath);
    }

    // ✅ Save to database
    const agent = await prisma.agent.create({
      data: {
        name,
        agentImageUrl: imageUrl,
        userId: "001001", 
        instruction: "Default instruction...",
      },
    });

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error("Agent creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
