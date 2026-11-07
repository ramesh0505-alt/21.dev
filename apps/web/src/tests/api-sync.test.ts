import { describe, it, expect } from 'vitest';
import { GET, POST } from '../app/api/sync/route';

describe('/api/sync Route Handler', () => {
  it('returns valid sync metadata on GET', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('customComponents');
    expect(data).toHaveProperty('deletedComponents');
    expect(data).toHaveProperty('customIcons');
    expect(data).toHaveProperty('customCategories');
  });

  it('updates sync state cleanly on POST', async () => {
    const mockRequest = {
      json: async () => ({
        customCategories: [
          {
            id: 'test-cat',
            name: 'Test Category',
            slug: 'test-category',
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    } as any;

    const res = await POST(mockRequest);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.customCategories.some((c: any) => c.id === 'test-cat')).toBe(true);
  });
});

