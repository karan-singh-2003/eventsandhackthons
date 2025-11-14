import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function uploadCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    // delete temp file
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    // still delete temp file if failed
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Cloudinary upload failed");
  }
}
