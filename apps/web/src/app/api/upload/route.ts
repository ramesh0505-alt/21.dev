import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// GET /api/upload - List all locally uploaded media files
export async function GET() {
  try {
    ensureUploadDir();
    const files = fs.readdirSync(UPLOAD_DIR);
    const mediaFiles = files
      .map((fileName) => {
        try {
          const filePath = path.join(UPLOAD_DIR, fileName);
          const stats = fs.statSync(filePath);
          const ext = path.extname(fileName).toLowerCase();
          const isVideo = ['.mp4', '.webm', '.ogg', '.mov'].includes(ext);
          const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'].includes(ext);

          if (!isVideo && !isImage) return null;

          return {
            filename: fileName,
            url: `/uploads/${fileName}`,
            type: isVideo ? 'video' : 'image',
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({ files: mediaFiles });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to list uploads', details: err?.message },
      { status: 500 }
    );
  }
}

// POST /api/upload - Direct upload of image or video from local disk
export async function POST(req: NextRequest) {
  try {
    ensureUploadDir();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Sanitize filename and prepend timestamp
    const originalName = file.name || 'uploaded_media';
    const ext = path.extname(originalName).toLowerCase() || '.png';
    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_');
    const safeFileName = `${Date.now()}_${baseName}${ext}`;

    const filePath = path.join(UPLOAD_DIR, safeFileName);
    fs.writeFileSync(filePath, buffer);

    const isVideo = ['.mp4', '.webm', '.ogg', '.mov'].includes(ext) || file.type.startsWith('video/');
    const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'].includes(ext) || file.type.startsWith('image/');

    const publicUrl = `/uploads/${safeFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFileName,
      originalName,
      type: isVideo ? 'video' : isImage ? 'image' : 'file',
      size: buffer.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to upload file', details: err?.message },
      { status: 500 }
    );
  }
}
