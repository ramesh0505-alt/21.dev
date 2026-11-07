import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SYNC_FILE_PATH = path.join(process.cwd(), 'src', 'registry', 'admin-sync.json');

// Ensure storage file directory exists
function ensureFile() {
  const dir = path.dirname(SYNC_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(SYNC_FILE_PATH)) {
    fs.writeFileSync(
      SYNC_FILE_PATH,
      JSON.stringify(
        {
          customComponents: [],
          deletedComponents: [],
          customIcons: [],
          deletedIcons: [],
          customCategories: [],
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      'utf-8'
    );
  }
}

export async function GET() {
  try {
    ensureFile();
    const raw = fs.readFileSync(SYNC_FILE_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to read sync file', details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureFile();
    const body = await req.json();

    const currentRaw = fs.readFileSync(SYNC_FILE_PATH, 'utf-8');
    const current = JSON.parse(currentRaw);

    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(SYNC_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    return NextResponse.json({ success: true, updatedAt: updated.updatedAt, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to write sync file', details: err?.message },
      { status: 500 }
    );
  }
}

