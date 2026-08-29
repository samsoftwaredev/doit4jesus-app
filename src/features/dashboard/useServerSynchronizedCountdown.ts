import { AppState } from "react-native";
import { useEffect, useMemo, useState } from "react";

type CountdownBaseline = {
  deadlineMs: number;
  receivedAt: number;
  serverNowMs: number;
};

export type ServerSynchronizedCountdown = {
  expired: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number | null;
};

function referenceNow(): number {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}

function createBaseline(serverNow: string, deadlineAt: string | null): CountdownBaseline | null {
  if (!deadlineAt) return null;
  const deadlineMs = Date.parse(deadlineAt);
  const serverNowMs = Date.parse(serverNow);
  if (Number.isNaN(deadlineMs) || Number.isNaN(serverNowMs)) return null;

  return { deadlineMs, receivedAt: referenceNow(), serverNowMs };
}

/**
 * Derives time remaining from a server-time baseline and a monotonic local reference.
 * It recalculates after timer throttling instead of decrementing a local counter.
 */
export function useServerSynchronizedCountdown({
  deadlineAt,
  serverNow,
}: {
  deadlineAt: string | null;
  serverNow: string;
}): ServerSynchronizedCountdown {
  const [baseline, setBaseline] = useState<CountdownBaseline | null>(() => createBaseline(serverNow, deadlineAt));
  const [now, setNow] = useState(referenceNow);

  useEffect(() => {
    setBaseline(createBaseline(serverNow, deadlineAt));
    setNow(referenceNow());
  }, [deadlineAt, serverNow]);

  useEffect(() => {
    const interval = setInterval(() => setNow(referenceNow()), 1000);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") setNow(referenceNow());
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return useMemo(() => {
    if (!baseline) return { expired: false, hours: 0, minutes: 0, seconds: 0, totalSeconds: null };

    const elapsedMs = Math.max(0, now - baseline.receivedAt);
    const totalSeconds = Math.max(0, Math.ceil((baseline.deadlineMs - baseline.serverNowMs - elapsedMs) / 1000));
    return {
      expired: totalSeconds === 0,
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      totalSeconds,
    };
  }, [baseline, now]);
}
