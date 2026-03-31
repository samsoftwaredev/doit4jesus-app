/**
 * @jest-environment node
 *
 * Integration tests for GET /api/prayer-map
 *
 * Contract assertions:
 *  - Returns { data: PrayerLocationRow[] } on success
 *  - Returns 500 + { error } on DB failure
 *  - Rejects non-GET methods with 405
 */
import { getServiceSupabase } from '@/lib/supabase/server';

import {
  createChain,
  createMockReq,
  createMockRes,
  createMockSupabase,
} from '../../../__test__/helpers/apiTestHelper';
import handler from '../prayer-map';

jest.mock('@/lib/supabase/server', () => ({
  getServiceSupabase: jest.fn(),
}));

const mockGetServiceSupabase = getServiceSupabase as jest.Mock;

// ── fixtures ──────────────────────────────────────────────────────────────────

const PRAYER_ROWS = [
  {
    id: 1,
    city: 'Rome',
    country_code: 'IT',
    country_name: 'Italy',
    latitude: 41.9,
    longitude: 12.5,
    prayer_count: 500,
    live_sessions: 2,
    active_users: 10,
    last_updated: '2026-03-29T00:00:00Z',
  },
  {
    id: 2,
    city: 'Manila',
    country_code: 'PH',
    country_name: 'Philippines',
    latitude: 14.6,
    longitude: 120.98,
    prayer_count: 300,
    live_sessions: 1,
    active_users: 5,
    last_updated: '2026-03-29T00:00:00Z',
  },
];

// ── tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/prayer-map', () => {
  let mockFrom: jest.Mock;

  beforeEach(() => {
    const { mockSb, mockFrom: mf } = createMockSupabase();
    mockFrom = mf;
    mockGetServiceSupabase.mockReturnValue(mockSb);
  });

  it('returns 200 with data array on success', async () => {
    const chain = createChain({ data: PRAYER_ROWS, error: null });
    mockFrom.mockReturnValue(chain);

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).data).toHaveLength(2);
    expect((res._json as any).data[0].city).toBe('Rome');
  });

  it('response data contains required contract fields', async () => {
    const chain = createChain({ data: PRAYER_ROWS, error: null });
    mockFrom.mockReturnValue(chain);

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    const first = (res._json as any).data[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('city');
    expect(first).toHaveProperty('country_code');
    expect(first).toHaveProperty('country_name');
    expect(first).toHaveProperty('latitude');
    expect(first).toHaveProperty('longitude');
    expect(first).toHaveProperty('prayer_count');
    expect(first).toHaveProperty('live_sessions');
    expect(first).toHaveProperty('active_users');
    expect(first).toHaveProperty('last_updated');
  });

  it('returns empty array when DB returns no rows', async () => {
    const chain = createChain({ data: [], error: null });
    mockFrom.mockReturnValue(chain);

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).data).toEqual([]);
  });

  it('returns 500 with error message on DB failure', async () => {
    const chain = createChain({
      data: null,
      error: { message: 'connection timeout' },
    });
    mockFrom.mockReturnValue(chain);

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect((res._json as any).error).toBeTruthy();
  });

  it('returns 405 for non-GET methods', async () => {
    const req = createMockReq({ method: 'POST' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
  });
});
