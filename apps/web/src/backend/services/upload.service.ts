import fs from 'fs';
import path from 'path';

export interface MediaFileInfo {
  filename: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  createdAt: string;
}

export interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  originalName: string;
  type: 'image' | 'video' | 'file';
  size: number;
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];
const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov'];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Ensures the uploads directory exists on disk.
 */
export function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Sanitizes SVG content by stripping dangerous tags and scripts.
 */
function sanitizeSvg(content: string): string {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Lists all uploaded media files sorted by newest first.
 */
export function listUploadedMediaFiles(): MediaFileInfo[] {
  ensureUploadDir();
  try {
    const files = fs.readdirSync(UPLOAD_DIR);
    const mediaFiles: MediaFileInfo[] = [];

    for (const fileName of files) {
      try {
        const filePath = path.join(UPLOAD_DIR, fileName);
        const stats = fs.statSync(filePath);
        const ext = path.extname(fileName).toLowerCase();
        const isVideo = ALLOWED_VIDEO_EXTENSIONS.includes(ext);
        const isImage = ALLOWED_IMAGE_EXTENSIONS.includes(ext);

        if (!isVideo && !isImage) continue;

        mediaFiles.push({
          filename: fileName,
          url: `/uploads/${fileName}`,
          type: isVideo ? 'video' : 'image',
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
        });
      } catch {
        // Skip unreadable files
      }
    }

    return mediaFiles.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.error('[UploadService] Error listing media files:', err);
    return [];
  }
}

/**
 * Handles validation and persistence of an uploaded file.
 */
export async function uploadMediaFile(file: File): Promise<UploadResult> {
  ensureUploadDir();

  const originalName = file.name || 'uploaded_media';
  const ext = path.extname(originalName).toLowerCase() || '.png';
  const isVideo = ALLOWED_VIDEO_EXTENSIONS.includes(ext) || file.type.startsWith('video/');
  const isImage = ALLOWED_IMAGE_EXTENSIONS.includes(ext) || file.type.startsWith('image/');

  if (!isImage && !isVideo) {
    throw new Error(`Unsupported file type: ${ext}. Supported types: ${[...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS].join(', ')}`);
  }

  let buffer = Buffer.from(await file.arrayBuffer());

  // Check file size limits
  if (isVideo && buffer.length > MAX_VIDEO_SIZE) {
    throw new Error(`Video file exceeds maximum allowed size of 50MB (received ${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);
  }
  if (isImage && buffer.length > MAX_IMAGE_SIZE) {
    throw new Error(`Image file exceeds maximum allowed size of 10MB (received ${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);
  }

  // Sanitize SVG files to prevent XSS
  if (ext === '.svg') {
    const rawSvg = buffer.toString('utf-8');
    const cleanSvg = sanitizeSvg(rawSvg);
    buffer = Buffer.from(cleanSvg, 'utf-8');
  }

  // Generate safe filename with timestamp
  const baseName = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');
  const safeFileName = `${Date.now()}_${baseName}${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeFileName);

  fs.writeFileSync(filePath, buffer);

  return {
    success: true,
    url: `/uploads/${safeFileName}`,
    filename: safeFileName,
    originalName,
    type: isVideo ? 'video' : isImage ? 'image' : 'file',
    size: buffer.length,
  };
}

/**
 * Deletes a file from the uploads directory.
 */
export function deleteUploadedMediaFile(filename: string): boolean {
  try {
    ensureUploadDir();
    const sanitized = path.basename(filename);
    const targetPath = path.join(UPLOAD_DIR, sanitized);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`[UploadService] Failed to delete ${filename}:`, err);
    return false;
  }
}
