import { NextRequest, NextResponse } from 'next/server';
import { listUploadedMediaFiles, uploadMediaFile } from '../services/upload.service';

export class UploadController {
  static async handleListUploads(): Promise<NextResponse> {
    try {
      const files = listUploadedMediaFiles();
      return NextResponse.json({ files });
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Failed to list uploads', details: err?.message },
        { status: 500 }
      );
    }
  }

  static async handleUpload(req: NextRequest): Promise<NextResponse> {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const result = await uploadMediaFile(file);
      return NextResponse.json(result);
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Failed to upload file', details: err?.message },
        { status: 500 }
      );
    }
  }
}
