/**
 * @jest-environment node
 *
 * Integration tests for:
 *   GET  /api/prayer-sessions
 *   POST /api/prayer-sessions/start
 *   POST /api/prayer-sessions/join
 */
import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';

import {
  createChain,
  createMockReq,
  createMockRes,
  createMockSupabase,
} from '../../../__test__/helpers/apiTestHelper';
import sessionsHandler from '../prayer-sessions/index';
import joinHandler from '../prayer-sessions/join';
import startHandler from '../prayer-sessions/start';

// ── module mocks ──────────────────────────────────────────────────────────────

jest.mock('@/lib/supabase/server', () => ({
  getServiceSupabase: jest.fn(),
}));

jest.mock('@/lib/api/requireAuth', () => ({
  requireAuth: jest.fn(),
}));

const mockGetServiceSupabase = getServiceSupabase as jest.Mock;
const mockRequireAuth = requireAuth as jest.Mock;

// ── fixtures ──────────────────────────────────────────────────────────────────

const SESSION_ROWS = [
  {
    id: 1,
    city: 'Rome',
    country_code: 'IT',
    country_name: 'Italy',
    latitude: 41.9,
    longitude: 12.5,
    prayer_type: 'Rosary',
    participants_count: 3,
    is_active: true,
    created_by: 'user-abc',
    started_at: '2026-03-29T00:00:00Z',
    created_at: '2026-03-29T00:00:00Z',
    updated_at: '2026-03-29T00:00:00Z',
  },
];

const VALID_START_BODY = {
  city: 'Rome',
  countryCode: 'IT',
  countryName: 'Italy',
  latitude: 41.9,
  longitude: 12.5,
  prayerType: 'Rosary',
};

// ── GET /api/prayer-sessions ──────────────────────────────────────────────────

describe('GET /api/prayer-sessions', () => {
  let mockFrom: jest.Mock;

  beforeEach(() => {
    const { mockSb, mockFrom: mf } = createMockSupabase();
    mockFrom = mf;
    mockGetServiceSupabase.mockReturnValue(mockSb);
  });

  /** Build a thenable profiles chain that resolves with { count, error }. */
  function createProfilesChain(count: number) {
    const result = { data: null, error: null, count };
    const chain: Record<string, unknown> = {};
    const self = () => chain;
    for (const m of ['select', 'eq', 'gt', 'order', 'limit']) {
      chain[m] = jest.fn(self);
    }
    (chain as any).then = (
      resolve: (v: typeof result) => void,
      reject: (r: unknown) => void,
    ) => Promise.resolve(result).then(resolve, reject);
    return chain;
  }

  function setupMockFrom(sessionsResult: { data: any; error: any }) {
    const sessionsChain = createChain(sessionsResult);
    const profilesChain = createProfilesChain(5);
    mockFrom.mockImplementation((table: string) => {
      if (table === 'profiles') return profilesChain;
      return sessionsChain;
    });
  }

  it('returns 200 with active sessions array', async () => {
    setupMockFrom({ data: SESSION_ROWS, error: null });

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await sessionsHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).data).toHaveLength(1);
    expect((res._json as any).activeOnlineUsers).toBe(5);
  });

  it('response session contains required contract fields', async () => {
    setupMockFrom({ data: SESSION_ROWS, error: null });

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await sessionsHandler(req, res);

    const s = (res._json as any).data[0];
    expect(s).toHaveProperty('id');
    expect(s).toHaveProperty('city');
    expect(s).toHaveProperty('country_code');
    expect(s).toHaveProperty('prayer_type');
    expect(s).toHaveProperty('participants_count');
    expect(s).toHaveProperty('is_active');
  });

  it('returns empty array when no active sessions', async () => {
    setupMockFrom({ data: [], error: null });

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await sessionsHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).data).toEqual([]);
  });

  it('returns 500 on DB error', async () => {
    setupMockFrom({ data: null, error: { message: 'DB error' } });

    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await sessionsHandler(req, res);

    expect(res.statusCode).toBe(500);
  });

  it('returns 405 for non-GET methods', async () => {
    const req = createMockReq({ method: 'POST' });
    const res = createMockRes();

    await sessionsHandler(req, res);

    expect(res.statusCode).toBe(405);
  });
});

// ── POST /api/prayer-sessions/start ──────────────────────────────────────────

describe('POST /api/prayer-sessions/start', () => {
  let mockRpc: jest.Mock;
  let mockFrom: jest.Mock;

  beforeEach(() => {
    const { mockSb, mockFrom: mf, mockRpc: mr } = createMockSupabase();
    mockFrom = mf;
    mockRpc = mr;
    mockGetServiceSupabase.mockReturnValue(mockSb);
    mockRequireAuth.mockResolvedValue('user-abc');
  });

  it('returns 401 when not authenticated', async () => {
    mockRequireAuth.mockImplementationOnce(async (_req: any, res: any) => {
      res.status(401).json({ error: 'Missing authorization' });
      return null;
    });

    const req = createMockReq({ method: 'POST', body: VALID_START_BODY });
    const res = createMockRes();

    await startHandler(req, res);

    expect(res.statusCode).toBe(401);
  });

  it('returns 400 when required fields are missing', async () => {
    const req = createMockReq({
      method: 'POST',
      body: { city: 'Rome' }, // missing other fields
    });
    const res = createMockRes();

    await startHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it('returns 200 with sessionId on success', async () => {
    mockRpc
      .mockResolvedValueOnce({ data: 42, error: null }) // upsert_global_prayer_session
      .mockResolvedValueOnce({ data: null, error: null }); // increment_prayer_count

    const req = createMockReq({
      method: 'POST',
      body: VALID_START_BODY,
      headers: { authorization: 'Bearer test-token' },
    });
    const res = createMockRes();

    await startHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).sessionId).toBe(42);
  });

  it('returns 500 when session RPC fails', async () => {
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: 'RPC failed' },
    });

    const req = createMockReq({
      method: 'POST',
      body: VALID_START_BODY,
      headers: { authorization: 'Bearer test-token' },
    });
    const res = createMockRes();

    await startHandler(req, res);

    expect(res.statusCode).toBe(500);
  });

  it('still returns 200 when increment RPC fails (non-fatal)', async () => {
    mockRpc
      .mockResolvedValueOnce({ data: 7, error: null }) // session upsert ok
      .mockResolvedValueOnce({
        data: null,
        error: { message: 'increment failed' },
      }); // non-fatal

    const req = createMockReq({
      method: 'POST',
      body: VALID_START_BODY,
      headers: { authorization: 'Bearer test-token' },
    });
    const res = createMockRes();

    await startHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).sessionId).toBe(7);
  });

  it('returns 405 for non-POST methods', async () => {
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await startHandler(req, res);

    expect(res.statusCode).toBe(405);
  });
});

// ── POST /api/prayer-sessions/join ───────────────────────────────────────────

describe('POST /api/prayer-sessions/join', () => {
  let mockRpc: jest.Mock;
  let mockFrom: jest.Mock;

  beforeEach(() => {
    const { mockSb, mockFrom: mf, mockRpc: mr } = createMockSupabase();
    mockFrom = mf;
    mockRpc = mr;
    mockGetServiceSupabase.mockReturnValue(mockSb);
    mockRequireAuth.mockResolvedValue('user-abc');
  });

  it('returns 400 when sessionId is missing', async () => {
    const req = createMockReq({ method: 'POST', body: {} });
    const res = createMockRes();

    await joinHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when sessionId is not a number', async () => {
    const req = createMockReq({
      method: 'POST',
      body: { sessionId: 'not-a-number' },
    });
    const res = createMockRes();

    await joinHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it('returns 200 with participantsCount on success', async () => {
    const sessionChain = createChain({
      data: {
        city: 'Rome',
        country_code: 'IT',
        country_name: 'Italy',
        latitude: 41.9,
        longitude: 12.5,
      },
      error: null,
    });
    mockFrom.mockReturnValue(sessionChain);

    mockRpc
      .mockResolvedValueOnce({ data: 4, error: null }) // join_global_prayer_session
      .mockResolvedValueOnce({ data: null, error: null }); // increment_prayer_count

    const req = createMockReq({
      method: 'POST',
      body: { sessionId: 1 },
      headers: { authorization: 'Bearer test-token' },
    });
    const res = createMockRes();

    await joinHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).participantsCount).toBe(4);
  });

  it('returns 500 when join RPC fails', async () => {
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: 'join failed' },
    });

    const req = createMockReq({
      method: 'POST',
      body: { sessionId: 1 },
      headers: { authorization: 'Bearer test-token' },
    });
    const res = createMockRes();

    await joinHandler(req, res);

    expect(res.statusCode).toBe(500);
  });

  it('returns 405 for non-POST methods', async () => {
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await joinHandler(req, res);

    expect(res.statusCode).toBe(405);
  });
});
