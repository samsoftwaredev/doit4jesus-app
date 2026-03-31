/**
 * @jest-environment node
 *
 * Integration tests for POST /api/rosary/complete
 *
 * Covers:
 *  - Successful rosary recording with explicit location → map increment
 *  - Rosary recording falling back to profile location → map increment
 *  - Rosary recording with no location → no map increment, still 200
 *  - Map increment failure is non-fatal (still 200)
 *  - Auth required (401 without token)
 *  - Non-POST method returns 405
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
import handler from '../rosary/complete';

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

const EXPLICIT_LOCATION = {
  city: 'Rome',
  countryCode: 'IT',
  countryName: 'Italy',
  latitude: 41.9,
  longitude: 12.5,
};

const EDGE_RESPONSE = { xp: 10, streak: 5 };

// ── helpers ───────────────────────────────────────────────────────────────────

function setupSuccessfulEdge() {
  const mockUserClient = {
    functions: {
      invoke: jest.fn().mockResolvedValue({ data: EDGE_RESPONSE, error: null }),
    },
  };
  mockGetUserSupabase.mockReturnValue(mockUserClient);
  return mockUserClient;
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/rosary/complete', () => {
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

    const req = createMockReq({
      method: 'POST',
      headers: { authorization: 'Bearer bad' },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(401);
  });

  it('returns 405 for non-POST method', async () => {
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
  });

  it('returns 500 when edge function fails', async () => {
    const mockUserClient = {
      functions: {
        invoke: jest
          .fn()
          .mockResolvedValue({ data: null, error: { message: 'Edge error' } }),
      },
    };
    mockGetUserSupabase.mockReturnValue(mockUserClient);

    const req = createMockReq({
      method: 'POST',
      headers: { authorization: 'Bearer token' },
      body: {},
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(500);
  });

  it('records rosary and increments map when explicit location provided', async () => {
    setupSuccessfulEdge();
    mockRpc.mockResolvedValue({ data: null, error: null });

    const req = createMockReq({
      method: 'POST',
      headers: { authorization: 'Bearer token' },
      body: { location: EXPLICIT_LOCATION },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    // increment_prayer_count RPC should have been called
    expect(mockRpc).toHaveBeenCalledWith(
      'increment_prayer_count',
      expect.objectContaining({
        p_city: 'Rome',
        p_country_code: 'IT',
        p_country_name: 'Italy',
        p_increment: 1,
      }),
    );
  });

  it('falls back to profile city when no explicit location', async () => {
    setupSuccessfulEdge();

    // Profile lookup returns a city
    const profileChain = createChain({
      data: { city: 'Manila', state: null },
      error: null,
    });
    // prayer_locations lookup returns coordinates
    const locChain = createChain({
      data: {
        city: 'Manila',
        country_code: 'PH',
        country_name: 'Philippines',
        latitude: 14.6,
        longitude: 120.98,
      },
      error: null,
    });

    mockFrom
      .mockReturnValueOnce(profileChain) // profiles query
      .mockReturnValueOnce(locChain); // prayer_locations query

    mockRpc.mockResolvedValue({ data: null, error: null });

    const req = createMockReq({
      method: 'POST',
      headers: { authorization: 'Bearer token' },
      body: {}, // no location
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockRpc).toHaveBeenCalledWith(
      'increment_prayer_count',
      expect.objectContaining({ p_city: 'Manila', p_country_code: 'PH' }),
    );
  });

  it('records rosary and returns 200 with no location (skips map increment gracefully)', async () => {
    setupSuccessfulEdge();

    // Profile has no city
    const profileChain = createChain({
      data: { city: null, state: null },
      error: null,
    });
    mockFrom.mockReturnValue(profileChain);

    const req = createMockReq({
      method: 'POST',
      headers: { authorization: 'Bearer token' },
      body: {},
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    // No RPC call when no location can be resolved
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it('map increment failure is non-fatal — rosary still returns 200', async () => {
    setupSuccessfulEdge();
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: 'increment failed' },
    });

    const req = createMockReq({
      method: 'POST',
      headers: { authorization: 'Bearer token' },
      body: { location: EXPLICIT_LOCATION },
    });
    const res = createMockRes();

    await handler(req, res);

    // Despite increment failure, rosary was recorded → 200
    expect(res.statusCode).toBe(200);
  });

  it('response contains edge function data on success', async () => {
    setupSuccessfulEdge();
    mockRpc.mockResolvedValue({ data: null, error: null });

    const req = createMockReq({
      method: 'POST',
      headers: { authorization: 'Bearer token' },
      body: { location: EXPLICIT_LOCATION },
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res._json).toEqual(EDGE_RESPONSE);
  });
});
