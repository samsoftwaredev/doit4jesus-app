import { Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { geoGraticule } from 'd3-geo';
import { interpolateRgb } from 'd3-interpolate';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as topojson from 'topojson-client';
import type { Topology } from 'topojson-specification';

import type {
  MapTooltipData,
  PrayerCity,
  PrayerCountry,
  PrayerMapView,
  SelectedLocationDetail,
} from '@/interfaces/globalPrayerMap';
import { ISO3166_NUMERIC_TO_ALPHA2 } from '@/lib/iso3166NumericToAlpha2';

import {
  ANIM,
  MAP_HEIGHT,
  MAP_WIDTH,
  MARKER_RADIUS,
  getMapColors,
} from './helpers/constants';
import { createPathGenerator, createProjection } from './helpers/projection';

// ── Load world topology at the module level ──────────────────────────────────

const world110m: Topology = require('world-atlas/countries-110m.json');

const countries = topojson.feature(world110m, world110m.objects.countries);

const graticule = geoGraticule().step([20, 20])();

// ── Styled wrapper ───────────────────────────────────────────────────────────

const SvgWrapper = styled(Box)(({ theme }) => {
  const colors = getMapColors(theme);
  return {
    position: 'relative',
    width: '100%',
    maxWidth: MAP_WIDTH,
    overflow: 'hidden',
    borderRadius: 8,
    background: colors.water,
    border: `1px solid ${colors.divider}`,
    '& svg': { display: 'block', width: '100%', height: 'auto' },
    [theme.breakpoints.up('sm')]: {
      borderRadius: 10,
    },
    [theme.breakpoints.up('md')]: {
      borderRadius: 14,
    },
  };
});

// ── Keyframes injected once ──────────────────────────────────────────────────

const pulseKeyframes = `
@keyframes prayerPulse {
  0%   { r: var(--r); opacity: 0.7; }
  100% { r: calc(var(--r) * 2.2); opacity: 0; }
}
`;

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  cities: PrayerCity[];
  countriesData: PrayerCountry[];
  view: PrayerMapView;
  onTooltip: (data: MapTooltipData | null) => void;
  onSelect: (detail: SelectedLocationDetail | null) => void;
}

const WorldMapSvg = ({
  cities,
  countriesData,
  view,
  onTooltip,
  onSelect,
}: Props) => {
  const theme = useTheme();
  const colors = getMapColors(theme);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);

  // Force a re-render once so the wrapper rect is available for tooltips
  useEffect(() => setTick(1), []);

  // ── Projection & path ────────────────────────────────────────────────────
  const projection = createProjection();
  const pathGen = createPathGenerator(projection);

  // ── Scales ───────────────────────────────────────────────────────────────
  const maxPrayers = useMemo(
    () => Math.max(...cities.map((c) => c.prayerCount), 1),
    [cities],
  );

  const radiusScale = useMemo(
    () =>
      scaleSqrt()
        .domain([0, maxPrayers])
        .range([MARKER_RADIUS.min, MARKER_RADIUS.max])
        .clamp(true),
    [maxPrayers],
  );

  // Country choropleth colour scale
  const maxCountryPrayers = useMemo(
    () => Math.max(...countriesData.map((c) => c.prayerCount), 1),
    [countriesData],
  );

  const choroplethScale = useMemo(
    () =>
      scaleLinear<string>()
        .domain([0, maxCountryPrayers])
        .range([colors.choroplethLow, colors.choroplethHigh])
        .interpolate(interpolateRgb as any)
        .clamp(true),
    [maxCountryPrayers, colors.choroplethLow, colors.choroplethHigh],
  );

  // Build a lookup: ISO‑3166 numeric → PrayerCountry
  // numericToAlpha2 is the complete ISO-3166-1 mapping from lib/iso3166NumericToAlpha2.ts.
  // No component edits are needed when the backend adds new countries.
  const countryLookup = useMemo(() => {
    const map = new Map<string, PrayerCountry>();
    for (const cd of countriesData) {
      map.set(cd.countryCode, cd);
    }
    return { numericToAlpha2: ISO3166_NUMERIC_TO_ALPHA2, byCode: map };
  }, [countriesData]);

  // ── Event helpers ────────────────────────────────────────────────────────
  const getContainerRect = useCallback(
    () => wrapperRef.current?.getBoundingClientRect() ?? null,
    [],
  );

  const handleCityHover = useCallback(
    (city: PrayerCity, e: React.MouseEvent) => {
      const rect = getContainerRect();
      if (!rect) return;
      onTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        name: city.city,
        countryName: city.countryName,
        prayerCount: city.prayerCount,
        activeUsers: city.activeUsers,
      });
    },
    [getContainerRect, onTooltip],
  );

  const handleCountryHover = useCallback(
    (numericId: string, e: React.MouseEvent) => {
      const alpha2 = countryLookup.numericToAlpha2[numericId];
      const cd = alpha2 ? countryLookup.byCode.get(alpha2) : undefined;
      if (!cd) return;
      const rect = getContainerRect();
      if (!rect) return;
      onTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        name: cd.countryName,
        prayerCount: cd.prayerCount,
        activeUsers: cd.activeUsers,
      });
    },
    [getContainerRect, countryLookup, onTooltip],
  );

  const handleCityClick = useCallback(
    (city: PrayerCity) => {
      onSelect({
        id: city.id,
        name: city.city,
        countryName: city.countryName,
        prayerCount: city.prayerCount,
        activeUsers: city.activeUsers,
        latitude: city.latitude,
        longitude: city.longitude,
      });
    },
    [onSelect],
  );

  const handleCountryClick = useCallback(
    (numericId: string) => {
      const alpha2 = countryLookup.numericToAlpha2[numericId];
      const cd = alpha2 ? countryLookup.byCode.get(alpha2) : undefined;
      if (!cd) return;
      onSelect({
        id: cd.countryCode,
        name: cd.countryName,
        prayerCount: cd.prayerCount,
        activeUsers: cd.activeUsers,
      });
    },
    [countryLookup, onSelect],
  );

  const handleMouseLeave = useCallback(() => onTooltip(null), [onTooltip]);

  // ── Render ───────────────────────────────────────────────────────────────
  const featureArray =
    countries.type === 'FeatureCollection' ? countries.features : [];

  return (
    <SvgWrapper ref={wrapperRef}>
      <style>{pulseKeyframes}</style>
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ── Defs: glow filter ────────────────────────────────────────── */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="markerGrad">
            <stop
              offset="0%"
              stopColor={colors.successLight}
              stopOpacity="0.9"
            />
            <stop
              offset="100%"
              stopColor={colors.successMain}
              stopOpacity="0.4"
            />
          </radialGradient>
        </defs>

        {/* ── Water bg ─────────────────────────────────────────────────── */}
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={colors.water} />

        {/* ── Graticule ────────────────────────────────────────────────── */}
        <path
          d={pathGen(graticule) ?? ''}
          fill="none"
          stroke={colors.divider}
          strokeWidth={0.3}
        />

        {/* ── Country paths ────────────────────────────────────────────── */}
        <g>
          {featureArray.map((feat, index) => {
            const numId = String(feat.id ?? index);
            const alpha2 = countryLookup.numericToAlpha2[numId];
            const cd = alpha2 ? countryLookup.byCode.get(alpha2) : undefined;

            const fillColor =
              view === 'country' && cd
                ? choroplethScale(cd.prayerCount)
                : colors.land;

            return (
              <path
                key={numId}
                d={pathGen(feat) ?? ''}
                fill={fillColor}
                stroke={colors.landStroke}
                strokeWidth={0.4}
                style={{
                  cursor: view === 'country' && cd ? 'pointer' : 'default',
                  transition: `fill ${ANIM.transitionMs}ms ease`,
                }}
                onMouseMove={
                  view === 'country'
                    ? (e) => handleCountryHover(numId, e)
                    : undefined
                }
                onMouseLeave={view === 'country' ? handleMouseLeave : undefined}
                onClick={
                  view === 'country'
                    ? () => handleCountryClick(numId)
                    : undefined
                }
              />
            );
          })}
        </g>

        {/* ── City markers (city view) ─────────────────────────────────── */}
        {view === 'city' && (
          <g filter="url(#glow)">
            {cities.map((city) => {
              const coords = projection([city.longitude, city.latitude]);
              if (!coords) return null;
              const [cx, cy] = coords;
              const r = radiusScale(city.prayerCount);

              return (
                <g
                  key={city.id}
                  style={{ cursor: 'pointer' }}
                  onMouseMove={(e) => handleCityHover(city, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleCityClick(city)}
                >
                  {/* Pulse ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={colors.successLight}
                    strokeWidth={1}
                    opacity={0.5}
                    style={{
                      // @ts-expect-error CSS custom properties
                      '--r': `${r}px`,
                      animation: `prayerPulse ${ANIM.pulseMs}ms ease-out infinite`,
                    }}
                  />
                  {/* Solid marker */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="url(#markerGrad)"
                    opacity={0.85}
                  />
                  {/* Label for large markers */}
                  {r > 10 && (
                    <text
                      x={cx}
                      y={cy + r + 10}
                      textAnchor="middle"
                      fontSize={7}
                      fontWeight={600}
                      fill={colors.textSecondary}
                      style={{ pointerEvents: 'none' }}
                    >
                      {city.city}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* ── Country labels (country view) ────────────────────────────── */}
        {view === 'country' && (
          <g>
            {featureArray.map((feat) => {
              const numId = String(feat.id);
              const alpha2 = countryLookup.numericToAlpha2[numId];
              const cd = alpha2 ? countryLookup.byCode.get(alpha2) : undefined;
              if (!cd) return null;

              const centroid = pathGen.centroid(feat);
              if (!centroid || isNaN(centroid[0])) return null;

              return (
                <text
                  key={`label-${numId}`}
                  x={centroid[0]}
                  y={centroid[1]}
                  textAnchor="middle"
                  fontSize={7}
                  fontWeight={700}
                  fill={colors.textPrimary}
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  }}
                >
                  {cd.prayerCount.toLocaleString()}
                </text>
              );
            })}
          </g>
        )}
      </svg>
    </SvgWrapper>
  );
};

export default WorldMapSvg;
