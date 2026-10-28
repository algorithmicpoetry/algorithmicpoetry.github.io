import { Platform } from 'react-native';

export type EdgeHealth = {
  ok: boolean;
  service?: string;
  app?: string;
  cpuBudgetMs?: number;
  runtime?: string;
  ts?: string;
};

export type EdgeConfig = {
  ok: boolean;
  app?: string;
  cpuBudgetMs?: number;
  theme?: {
    brand: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      accent: string;
    };
    features: Record<string, boolean>;
  };
};

function edgeBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_EDGE_URL as string | undefined;
  if (fromEnv && fromEnv.trim()) {
    return fromEnv.replace(/\/$/, '');
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}

async function getJson<T>(path: string, timeoutMs = 1500): Promise<T | null> {
  const base = edgeBaseUrl();
  if (!base) return null;

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const res = await fetch(`${base}${path}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: controller?.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function fetchEdgeHealth() {
  return getJson<EdgeHealth>('/api/health');
}

export function fetchEdgeConfig() {
  return getJson<EdgeConfig>('/api/config');
}

export async function runEdgeOp(body: Record<string, unknown>): Promise<unknown | null> {
  const base = edgeBaseUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
