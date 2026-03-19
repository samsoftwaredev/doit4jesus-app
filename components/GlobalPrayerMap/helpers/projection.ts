import { type GeoProjection, geoNaturalEarth1, geoPath } from 'd3-geo';

import { MAP_HEIGHT, MAP_WIDTH } from './constants';

/**
 * Create a Natural Earth 1 projection fitted to the viewBox.
 * This projection shows the entire world at once — no zoom required.
 */
export const createProjection = (): GeoProjection =>
  geoNaturalEarth1()
    .scale(155)
    .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

/**
 * Create a path generator bound to the standard projection.
 */
export const createPathGenerator = (projection: GeoProjection) =>
  geoPath(projection);
