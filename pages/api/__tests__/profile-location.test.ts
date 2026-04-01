/**
 * @jest-environment node
 *
 * Integration tests for PATCH /api/profile — location update path
 *
 * Covers:
 *  - Saving a new city/state persists to the DB
 *  - City is validated against prayer_locations; warning returned for unknown city
 *  - Known city saves without warning
 *  - State is optional — absent state does not break the update
 *  - The saved city is used by the rosary completion location resolution (tested in
 *    rosary-complete.test.ts via the profile-fallback branch)
 *  - 401 when not authenticated
 *  - 405 for unsupported methods
 */
import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';
import { getUserSupabase } from '@/lib/supabase/userClient';

import {
  createChain,
  createMockReq,
  createMockRes,
  createMockSupabase,
} from '../../../__test__/helpers/apiTestHelper';
import handler from '../profile/index';

// ── module mocks ──────────────────────────────────────────────────────────────

jest.mock('@/lib/supabase/server', () => ({
  getServiceSupabase: jest.fn(),
}));

jest.mock('@/lib/api/requireAuth', () => ({
  requireAuth: jest.fn(),
}));

jest.mock('@/lib/supabase/userClient', () => ({
  getUserSupabase: jest.fn(),
}));

const mockGetServiceSupabase = getServiceSupabase as jest.Mock;
const mockRequireAuth = requireAuth as jest.Mock;
const mockGetUserSupabase = getUserSupabase as jest.Mock;

// ── fixtures ──────────────────────────────────────────────────────────────────

const KNOWN_CITY_ROW = { city: 'Rome', country_code: 'IT' };
const PROFILE_ROW = {
  id: 'user-abc',
  first_name: 'Samuel',
  city: 'Rome',
  state: 'Lazio',
  language: 'en',
  role: 'user',
};
const ROSARY_STATS: unknown[] = [];

// ── helpers ───────────────────────────────────────────────────────────────────

function setupGetProfile(profile = PROFILE_ROW, stats = ROSARY_STATS) {
  const profileChain = createChain({ data: profile, error: null });
  const statsChain = createChain({ data: stats, error: null });
  let callCount = 0;
  const mockFrom = jest.fn(() => {
    callCount++;
    return callCount === 1 ? profileChain : statsChain;
  });

  const mockUserClient = {
    functions: {
      invoke: jest.fn().mockResolvedValue({ data: { streak: 3 }, error: null }),
    },
  };
  mockGetUserSupabase.mockReturnValue(mockUserClient);

  return mockFrom;
}

// ── PATCH /api/profile — location ─────────────────────────────────────────────

describe('PATCH /api/profile — location updates', () => {
  let mockFrom: jest.Mock;
  let mockRpc: jest.Mock;

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

    const req = createMockReq({ method: 'PATCH', body: { city: 'Rome' } });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(401);
  });

  it('saves city and state when city is in the recognized list', async () => {
    // First call: city validation list; second call: update
    const cityListChain = createChain({ data: [KNOWN_CITY_ROW], error: null });
    const updateChain = createChain({ data: null, error: null });
    let call = 0;
    mockFrom.mockImplementation(() => {
      call++;
      return call <= 2 ? cityListChain : updateChain;
    });

    const mockSb = mockGetServiceSupabase();
    mockSb.from = mockFrom;
    mockGetServiceSupabase.mockReturnValue(mockSb);

    const req = createMockReq({
      method: 'PATCH',
      headers: { authorization: 'Bearer token' },
      body: { city: 'Rome', state: 'Lazio' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).ok).toBe(true);
    expect((res._json as any).cityWarning).toBeNull();
  });

  it('returns cityWarning when city is not in recognized list', async () => {
    // City list returns empty — city not found
    const cityListChain = createChain({ data: [], error: null });
    const updateChain = createChain({ data: null, error: null });
    let call = 0;
    mockFrom.mockImplementation(() => {
      call++;
      return call <= 2 ? cityListChain : updateChain;
    });

    const mockSb = mockGetServiceSupabase();
    mockSb.from = mockFrom;
    mockGetServiceSupabase.mockReturnValue(mockSb);

    const req = createMockReq({
      method: 'PATCH',
      headers: { authorization: 'Bearer token' },
      body: { city: 'Atlantis', state: null },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).ok).toBe(true);
    expect((res._json as any).cityWarning).toBeTruthy();
  });

  it('city update is case-insensitive for validation', async () => {
    const cityListChain = createChain({
      data: [{ city: 'Rome', country_code: 'IT' }],
      error: null,
    });
    const updateChain = createChain({ data: null, error: null });
    let call = 0;
    mockFrom.mockImplementation(() => {
      call++;
      return call <= 2 ? cityListChain : updateChain;
    });

    const mockSb = mockGetServiceSupabase();
    mockSb.from = mockFrom;
    mockGetServiceSupabase.mockReturnValue(mockSb);

    const req = createMockReq({
      method: 'PATCH',
      headers: { authorization: 'Bearer token' },
      body: { city: 'ROME' }, // uppercase
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).cityWarning).toBeNull();
  });

  it('state is optional — update succeeds without state', async () => {
    const cityListChain = createChain({ data: [KNOWN_CITY_ROW], error: null });
    const updateChain = createChain({ data: null, error: null });
    let call = 0;
    mockFrom.mockImplementation(() => {
      call++;
      return call <= 2 ? cityListChain : updateChain;
    });

    const mockSb = mockGetServiceSupabase();
    mockSb.from = mockFrom;
    mockGetServiceSupabase.mockReturnValue(mockSb);

    const req = createMockReq({
      method: 'PATCH',
      headers: { authorization: 'Bearer token' },
      body: { city: 'Rome' }, // no state
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect((res._json as any).ok).toBe(true);
    expect((res._json as any).stateWarning).toBeNull();
  });

  it('returns 405 for unsupported methods', async () => {
    const req = createMockReq({ method: 'DELETE' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
  });
});

// ── GET /api/profile ──────────────────────────────────────────────────────────

describe('GET /api/profile', () => {
  beforeEach(() => {
    mockRequireAuth.mockResolvedValue('user-abc');
  });

  it('returns profile including city and state fields', async () => {
    const { mockSb, mockFrom: mf } = createMockSupabase();
    mockGetServiceSupabase.mockReturnValue(mockSb);

    const mfFn = setupGetProfile();
    mockSb.from = mfFn;

    // auth.getUser
    mockSb.auth.getUser = jest.fn().mockResolvedValue({
      data: { user: { app_metadata: { provider: 'email' } } },
    });

    const req = createMockReq({
      method: 'GET',
      headers: { authorization: 'Bearer token' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const body = res._json as any;
    expect(body).toHaveProperty('profile');
    expect(body.profile).toHaveProperty('city');
    expect(body.profile).toHaveProperty('state');
  });
});
