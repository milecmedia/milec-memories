import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { eventSlug, fileName, fileType } = await req.json();

    if (!eventSlug || !fileName) {
      return NextResponse.json(
        { error: "Missing eventSlug or fileName" },
        { status: 400 }
      );
    }

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectKey = `weddings/${eventSlug}/originals/${uuidv4()}-${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: objectKey,
      ContentType: fileType || "application/octet-stream",
    });

    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: 60 * 10,
    });

    return NextResponse.json({
      uploadUrl,
      objectKey,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not create upload URL" },
      { status: 500 }
    );
  }
}