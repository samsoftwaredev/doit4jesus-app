/* eslint-disable react/no-unknown-property -- React Three Fiber maps scene props to Three.js objects. */
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, MathUtils, SRGBColorSpace, TextureLoader, type Group } from "three";

import { useFrame, useLoader, useThree, type RootState } from "../../church-globe-renderer";

export type EarthGlobeSceneProps = {
  reduceMotion: boolean;
  rotationDurationMs: number;
  textureUri: string;
};

const STAR_COUNT = 84;

export const EARTH_AXIAL_TILT_RADIANS = MathUtils.degToRad(23.4);
export const EARTH_INITIAL_Y_ROTATION_RADIANS = MathUtils.degToRad(30);

/** Selects the renderer invalidation function used after asynchronous texture configuration. */
function selectInvalidate(state: RootState): RootState["invalidate"] {
  return state.invalidate;
}

/** Selects the responsive Three.js viewport used to fit the globe inside the available panel area. */
function selectViewport(state: RootState): RootState["viewport"] {
  return state.viewport;
}

/**
 * Calculates the next globe angle while preserving a truly static reduced-motion state.
 * A non-positive duration is treated as disabled animation rather than producing an invalid angle.
 */
export function getNextEarthRotation(
  currentRotation: number,
  deltaSeconds: number,
  rotationDurationMs: number,
  reduceMotion: boolean,
): number {
  if (reduceMotion || rotationDurationMs <= 0) return currentRotation;
  const radiansPerSecond = (Math.PI * 2) / (rotationDurationMs / 1_000);
  return currentRotation + deltaSeconds * radiansPerSecond;
}

/** Centers the Earth on the panel's bottom edge so its upper semicircle fills only the lower half. */
export function getGlobeSceneTransform(
  _viewportWidth: number,
  viewportHeight: number,
): { positionX: number; positionY: number; scale: number } {
  const radius = viewportHeight / 2;

  return {
    positionX: 0,
    positionY: -radius,
    scale: radius,
  };
}

/** Builds a deterministic star field so rerenders never cause visible star movement. */
function createStarPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const angle = goldenAngle * index;
    const distance = 4.2 + (index % 5) * 0.12;
    positions[index * 3] = Math.cos(angle) * radiusAtY * distance;
    positions[index * 3 + 1] = y * distance;
    positions[index * 3 + 2] = Math.sin(angle) * radiusAtY * distance;
  }
  return positions;
}

/** Renders the textured, tilted Earth and advances its noninteractive automatic rotation. */
export function EarthGlobeScene({ reduceMotion, rotationDurationMs, textureUri }: EarthGlobeSceneProps) {
  const rotatingGroupRef = useRef<Group>(null);
  const earthTexture = useLoader(TextureLoader, textureUri);
  const invalidate = useThree(selectInvalidate);
  const viewport = useThree(selectViewport);
  const starPositions = useMemo(() => createStarPositions(STAR_COUNT), []);
  const globeTransform = getGlobeSceneTransform(viewport.width, viewport.height);

  /** Configures the bundled color texture for accurate display in Three.js. */
  function configureEarthTexture(): void {
    earthTexture.colorSpace = SRGBColorSpace;
    earthTexture.needsUpdate = true;
    invalidate();
  }

  useEffect(configureEarthTexture, [earthTexture, invalidate]);

  /** Advances the Earth by elapsed frame time, independent of the device refresh rate. */
  function animateEarth(_state: RootState, deltaSeconds: number): void {
    if (!rotatingGroupRef.current) return;
    rotatingGroupRef.current.rotation.y = getNextEarthRotation(
      rotatingGroupRef.current.rotation.y,
      deltaSeconds,
      rotationDurationMs,
      reduceMotion,
    );
  }

  useFrame(animateEarth);

  return (
    <>
      <ambientLight intensity={0.72} />
      <directionalLight color="#FFFFFF" intensity={2.1} position={[3, 2, 4]} />
      <pointLight color="#8ACBE8" intensity={0.7} position={[-3, -1.5, 2]} />

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#65B6D8" depthWrite={false} opacity={0.52} size={0.022} sizeAttenuation transparent />
      </points>

      <group position={[globeTransform.positionX, globeTransform.positionY, 0]} scale={globeTransform.scale}>
        <group rotation={[0, 0, EARTH_AXIAL_TILT_RADIANS]}>
          <group ref={rotatingGroupRef} rotation={[0, EARTH_INITIAL_Y_ROTATION_RADIANS, 0]}>
            <mesh>
              <sphereGeometry args={[1, 64, 64]} />
              <meshStandardMaterial map={earthTexture} metalness={0.02} roughness={0.88} />
            </mesh>
            <mesh scale={1.035}>
              <sphereGeometry args={[1, 48, 48]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color="#65B6D8"
                depthWrite={false}
                opacity={0.11}
                transparent
              />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}
