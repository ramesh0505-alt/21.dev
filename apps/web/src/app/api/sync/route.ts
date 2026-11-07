import { NextRequest } from 'next/server';
import { SyncController } from '@/backend/controllers/sync.controller';

// GET /api/sync - Retrieve full synced admin database
export async function GET() {
  return SyncController.handleGet();
}

// POST /api/sync - Atomically update synced admin database
export async function POST(req: NextRequest) {
  return SyncController.handlePost(req);
}
