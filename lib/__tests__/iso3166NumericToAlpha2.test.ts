/**
 * @jest-environment node
 *
 * Tests for lib/iso3166NumericToAlpha2.ts
 *
 * Validates the completeness and correctness of the country mapping so that:
 *  - WorldMapSvg country view works for all countries returned by the backend
 *  - New countries added to prayer_locations render without component edits
 *  - Known specific codes are correct (prevents silent regressions)
 */
import { ISO3166_NUMERIC_TO_ALPHA2 } from '../iso3166NumericToAlpha2';

// ── structure ─────────────────────────────────────────────────────────────────

describe('ISO3166_NUMERIC_TO_ALPHA2 — structure', () => {
  it('is a non-empty object', () => {
    expect(typeof ISO3166_NUMERIC_TO_ALPHA2).toBe('object');
    expect(Object.keys(ISO3166_NUMERIC_TO_ALPHA2).length).toBeGreaterThan(0);
  });

  it('covers at least 200 countries (full ISO-3166-1 has 249)', () => {
    expect(
      Object.keys(ISO3166_NUMERIC_TO_ALPHA2).length,
    ).toBeGreaterThanOrEqual(200);
  });

  it('all keys are zero-padded 3-digit strings', () => {
    const keys = Object.keys(ISO3166_NUMERIC_TO_ALPHA2);
    const invalid = keys.filter((k) => !/^\d{3}$/.test(k));
    expect(invalid).toEqual([]);
  });

  it('all values are 2-character uppercase alpha-2 codes', () => {
    const values = Object.values(ISO3166_NUMERIC_TO_ALPHA2);
    const invalid = values.filter((v) => !/^[A-Z]{2}$/.test(v));
    expect(invalid).toEqual([]);
  });

  it('has no duplicate alpha-2 values (each country mapped once)', () => {
    const values = Object.values(ISO3166_NUMERIC_TO_ALPHA2);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});

// ── correctness — high-traffic prayer countries ───────────────────────────────

describe('ISO3166_NUMERIC_TO_ALPHA2 — known mappings', () => {
  const known: [string, string][] = [
    // Americas
    ['840', 'US'], // United States
    ['076', 'BR'], // Brazil
    ['484', 'MX'], // Mexico
    ['124', 'CA'], // Canada
    ['170', 'CO'], // Colombia
    ['604', 'PE'], // Peru
    ['032', 'AR'], // Argentina
    // Europe
    ['380', 'IT'], // Italy
    ['724', 'ES'], // Spain
    ['826', 'GB'], // United Kingdom
    ['250', 'FR'], // France
    ['620', 'PT'], // Portugal
    ['616', 'PL'], // Poland
    ['372', 'IE'], // Ireland
    ['276', 'DE'], // Germany
    // Africa
    ['566', 'NG'], // Nigeria
    ['404', 'KE'], // Kenya
    ['180', 'CD'], // DR Congo
    ['288', 'GH'], // Ghana
    ['231', 'ET'], // Ethiopia
    ['710', 'ZA'], // South Africa
    // Asia-Pacific
    ['608', 'PH'], // Philippines
    ['410', 'KR'], // South Korea
    ['356', 'IN'], // India
    ['360', 'ID'], // Indonesia
    ['704', 'VN'], // Vietnam
    ['422', 'LB'], // Lebanon
    ['392', 'JP'], // Japan
    ['036', 'AU'], // Australia
    ['554', 'NZ'], // New Zealand
  ];

  test.each(known)('numeric %s → alpha-2 %s', (numeric, alpha2) => {
    expect(ISO3166_NUMERIC_TO_ALPHA2[numeric]).toBe(alpha2);
  });
});

// ── normalization — backend country_code compatibility ────────────────────────

describe('ISO3166_NUMERIC_TO_ALPHA2 — backend normalization', () => {
  /**
   * Simulates the WorldMapSvg lookup flow:
   * Given a numeric ID from world-atlas TopoJSON, resolve the backend alpha-2 code.
   */
  function resolveCountryCode(numericId: string): string | undefined {
    return ISO3166_NUMERIC_TO_ALPHA2[numericId];
  }

  it('resolves numeric ID to alpha-2 for a backend-stored country (PH)', () => {
    expect(resolveCountryCode('608')).toBe('PH');
  });

  it('returns undefined for an unknown numeric ID', () => {
    expect(resolveCountryCode('999')).toBeUndefined();
  });

  it('is case-sensitive on keys (keys are always zero-padded strings)', () => {
    // world-atlas IDs come as numbers; callers should String(feat.id) them
    expect(ISO3166_NUMERIC_TO_ALPHA2['840']).toBe('US');
    expect(ISO3166_NUMERIC_TO_ALPHA2['8']).toBeUndefined(); // not zero-padded
  });

  it('new backend country added without code edits is renderable if in map', () => {
    // Simulate: backend adds Uganda (UG / 800)
    const ugandaNumeric = '800';
    const resolved = resolveCountryCode(ugandaNumeric);
    expect(resolved).toBe('UG');
  });

  it('world-atlas numeric ID for Vatican City renders correctly', () => {
    // VA (Holy See) is 336 in ISO-3166-1
    expect(resolveCountryCode('336')).toBe('VA');
  });
});
