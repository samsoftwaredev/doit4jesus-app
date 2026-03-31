/**
 * Shared utilities for testing Next.js API route handlers.
 *
 * Creates lightweight mock req/res objects and a configurable mock
 * Supabase client that supports the builder-pattern chaining used by
 * @supabase/supabase-js.
 */
import type { NextApiRequest, NextApiResponse } from 'next';

// ── Mock req/res ──────────────────────────────────────────────────────────────

type MockReqOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string>;
};

export function createMockReq(opts: MockReqOptions = {}): NextApiRequest {
  return {
    method: opts.method ?? 'GET',
    body: opts.body ?? {},
    headers: opts.headers ?? {},
    query: opts.query ?? {},
  } as unknown as NextApiRequest;
}

export function createMockRes() {
  const res = {
    statusCode: 200,
    _json: undefined as unknown,
    _headers: {} as Record<string, string>,

    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(data: unknown) {
      res._json = data;
      return res;
    },
    setHeader(key: string, value: string) {
      res._headers[key] = value;
      return res;
    },
    end() {
      return res;
    },
  };
  return res as unknown as NextApiResponse & {
    statusCode: number;
    _json: unknown;
    _headers: Record<string, string>;
  };
}

// ── Mock Supabase chain builder ────────────────────────────────────────────────

export type MockResult<T = unknown> = {
  data: T;
  error: null | { message: string };
};

/**
 * Creates a mock Supabase query chain.
 *
 * Every chainable method returns the same chain object.
 * Awaiting the chain directly resolves with `terminalResult`.
 * `.single()` also resolves with `terminalResult` unless overridden.
 *
 * Usage:
 *   const chain = createChain({ data: rows, error: null });
 *   mockFrom.mockReturnValue(chain);
 */
export function createChain<T>(terminalResult: MockResult<T>) {
  const chain: Record<string, unknown> = {};
  const self = () => chain;

  const methods = [
    'select',
    'insert',
    'update',
    'upsert',
    'delete',
    'eq',
    'neq',
    'ilike',
    'order',
    'limit',
  ];

  for (const m of methods) {
    chain[m] = jest.fn(self);
  }

  // Terminal methods that resolve the promise
  chain['single'] = jest.fn().mockResolvedValue(terminalResult);

  // Make the chain itself await-able (used when no .single() is called)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (chain as any).then = (
    resolve: (v: MockResult<T>) => void,
    reject: (r: unknown) => void,
  ) => Promise.resolve(terminalResult).then(resolve, reject);

  return chain as typeof chain & { single: jest.Mock };
}

/**
 * Creates a complete mock Supabase service client.
 *
 * Returns `mockSb` plus individual mock fns for `from`, `rpc`, `auth.getUser`,
 * and `functions.invoke` so tests can configure their return values per test.
 */
export function createMockSupabase() {
  const mockFrom = jest.fn();
  const mockRpc = jest.fn();
  const mockGetUser = jest.fn();
  const mockInvoke = jest.fn();

  const mockSb = {
    from: mockFrom,
    rpc: mockRpc,
    auth: { getUser: mockGetUser },
    functions: { invoke: mockInvoke },
  };

  return { mockSb, mockFrom, mockRpc, mockGetUser, mockInvoke };
}
