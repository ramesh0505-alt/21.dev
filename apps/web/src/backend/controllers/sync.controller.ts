import { NextRequest, NextResponse } from 'next/server';
import { SyncService } from '../services/sync.service';

export class SyncController {
  static async handleGet(): Promise<NextResponse> {
    try {
      const data = SyncService.getSyncState();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Failed to read sync file', details: err?.message },
        { status: 500 }
      );
    }
  }

  static async handlePost(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const updated = SyncService.updateSyncState(body);
      return NextResponse.json({
        success: true,
        updatedAt: updated.updatedAt,
        data: updated,
      });
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Failed to write sync file', details: err?.message },
        { status: 500 }
      );
    }
  }
}
