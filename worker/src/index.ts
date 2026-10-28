/**
 * Edge Worker — keep every handler under ~10ms CPU (Cloudflare free-tier budget).
 *
 * Rules of thumb for this file:
 * - No unbounded loops, no large JSON parse/stringify, no WASM cold paths
 * - Prefer pure functions and small static payloads
 * - External I/O only when necessary (ASSETS is platform-fast; avoid fetch waterfalls)
 */

export interface Env {
  ASSETS: Fetcher;
  APP_NAME: string;
  CPU_BUDGET_MS: string;
}

type EdgeOp =
  | { op: 'ping' }
  | { op: 'normalize-locale'; value?: string }
  | { op: 'slugify'; value?: string }
  | { op: 'theme-tint'; mode?: 'light' | 'dark' };

const THEME = {
  brand: {
    primary: '#0a7ea4',
    primaryLight: '#A1CEDC',
    primaryDark: '#1D3D47',
    accent: '#FF6B35',
  },
  features: {
    edgeApi: true,
    darkMode: true,
    i18n: true,
  },
} as const;

function json(data: unknown, init: ResponseInit = {}, budgetMs: number, started: number) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('cache-control', 'public, max-age=0, must-revalidate');
  headers.set('x-cpu-budget-ms', String(budgetMs));
  headers.set('server-timing', `app;dur=${Math.max(0, Date.now() - started)}`);
  headers.set('access-control-allow-origin', '*');
  headers.set('access-control-allow-methods', 'GET,POST,OPTIONS');
  headers.set('access-control-allow-headers', 'content-type');
  return new Response(JSON.stringify(data), { ...init, headers });
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function normalizeLocale(value: string | undefined): string {
  const raw = (value ?? 'en').trim().toLowerCase();
  const base = raw.split(/[-_]/)[0] || 'en';
  return /^[a-z]{2}$/.test(base) ? base : 'en';
}

function runOp(body: EdgeOp) {
  switch (body.op) {
    case 'ping':
      return { ok: true as const, op: body.op, pong: true };
    case 'normalize-locale':
      return { ok: true as const, op: body.op, locale: normalizeLocale(body.value) };
    case 'slugify':
      return { ok: true as const, op: body.op, slug: slugify(String(body.value ?? '')) };
    case 'theme-tint': {
      const mode = body.mode === 'dark' ? 'dark' : 'light';
      return {
        ok: true as const,
        op: body.op,
        tint: mode === 'dark' ? '#ffffff' : THEME.brand.primary,
        mode,
      };
    }
    default:
      return { ok: false as const, error: 'unknown_op' };
  }
}

async function handleApi(request: Request, env: Env, started: number): Promise<Response> {
  const budgetMs = Number(env.CPU_BUDGET_MS) || 10;
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return json({ ok: true }, { status: 204 }, budgetMs, started);
  }

  if (url.pathname === '/api/health' && request.method === 'GET') {
    return json(
      {
        ok: true,
        service: 'algorithmicpoetry-edge',
        app: env.APP_NAME,
        cpuBudgetMs: budgetMs,
        runtime: 'cloudflare-workers',
        ts: new Date().toISOString(),
      },
      {},
      budgetMs,
      started,
    );
  }

  if (url.pathname === '/api/config' && request.method === 'GET') {
    return json(
      {
        ok: true,
        app: env.APP_NAME,
        cpuBudgetMs: budgetMs,
        theme: THEME,
      },
      { headers: { 'cache-control': 'public, max-age=60' } },
      budgetMs,
      started,
    );
  }

  // Allowlisted micro-ops only — intentionally tiny so CPU stays << 10ms.
  if (url.pathname === '/api/run' && request.method === 'POST') {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return json({ ok: false, error: 'expected_json' }, { status: 415 }, budgetMs, started);
    }

    // Cap body size early (Workers still buffers; reject oversized before parse).
    const raw = await request.text();
    if (raw.length > 2048) {
      return json({ ok: false, error: 'payload_too_large' }, { status: 413 }, budgetMs, started);
    }

    let body: EdgeOp;
    try {
      body = JSON.parse(raw) as EdgeOp;
    } catch {
      return json({ ok: false, error: 'invalid_json' }, { status: 400 }, budgetMs, started);
    }

    if (!body || typeof body !== 'object' || typeof (body as EdgeOp).op !== 'string') {
      return json({ ok: false, error: 'missing_op' }, { status: 400 }, budgetMs, started);
    }

    const result = runOp(body);
    return json(result, { status: result.ok ? 200 : 400 }, budgetMs, started);
  }

  return json({ ok: false, error: 'not_found' }, { status: 404 }, budgetMs, started);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const started = Date.now();
    const url = new URL(request.url);

    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return handleApi(request, env, started);
    }

    // Static SPA + assets — Cloudflare serves from the ASSETS binding.
    return env.ASSETS.fetch(request);
  },
};
