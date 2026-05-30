interface Env {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
}

interface TokenInfo {
  sub: string;
  aud: string;
  exp: string;
  email: string;
}

async function verifyGoogleToken(token: string, clientId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    if (!res.ok) return null;
    const data = await res.json() as TokenInfo;
    if (data.aud !== clientId) return null;
    if (Number(data.exp) * 1000 < Date.now()) return null;
    return data.sub;
  } catch {
    return null;
  }
}

function extractBearer(request: Request): string | null {
  const auth = request.headers.get('Authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7).trim() || null;
}

function cors(res: Response): Response {
  res.headers.set('Access-Control-Allow-Origin', '*');
  return res;
}

export const onRequestOptions: PagesFunction = () =>
  cors(new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  }));

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return cors(new Response(null, { status: 503 }));

  const token = extractBearer(request);
  if (!token) return cors(new Response('Unauthorized', { status: 401 }));

  const sub = await verifyGoogleToken(token, env.GOOGLE_CLIENT_ID);
  if (!sub) return cors(new Response('Unauthorized', { status: 401 }));

  const row = await env.DB
    .prepare('SELECT settings FROM user_settings WHERE user_id = ?')
    .bind(sub)
    .first<{ settings: string }>();

  if (!row) return cors(new Response(null, { status: 404 }));
  return cors(Response.json({ settings: JSON.parse(row.settings) }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return cors(new Response(null, { status: 503 }));

  const token = extractBearer(request);
  if (!token) return cors(new Response('Unauthorized', { status: 401 }));

  const sub = await verifyGoogleToken(token, env.GOOGLE_CLIENT_ID);
  if (!sub) return cors(new Response('Unauthorized', { status: 401 }));

  let body: { settings?: unknown };
  try { body = await request.json(); } catch { return cors(new Response('Bad JSON', { status: 400 })); }

  if (!body.settings) return cors(new Response('Invalid body', { status: 400 }));

  await env.DB
    .prepare(`
      INSERT INTO user_settings (user_id, settings, updated_at)
      VALUES (?, ?, unixepoch())
      ON CONFLICT(user_id) DO UPDATE SET
        settings   = excluded.settings,
        updated_at = excluded.updated_at
    `)
    .bind(sub, JSON.stringify(body.settings))
    .run();

  return cors(Response.json({ ok: true }));
};
