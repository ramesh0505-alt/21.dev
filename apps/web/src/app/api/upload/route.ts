import { NextRequest } from 'next/server';
import { UploadController } from '@/backend/controllers/upload.controller';

// GET /api/upload - List all locally uploaded media files
export async function GET() {
  return UploadController.handleListUploads();
}

// POST /api/upload - Direct upload of image or video from local disk
export async function POST(req: NextRequest) {
  return UploadController.handleUpload(req);
}
