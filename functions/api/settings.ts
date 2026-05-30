interface Env {
  DB: D1Database;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  }));

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const userId = new URL(request.url).searchParams.get('user_id') ?? '';
  if (!UUID_RE.test(userId)) return cors(new Response('Invalid user_id', { status: 400 }));

  const row = await env.DB
    .prepare('SELECT settings FROM user_settings WHERE user_id = ?')
    .bind(userId)
    .first<{ settings: string }>();

  if (!row) return cors(new Response(null, { status: 404 }));
  return cors(Response.json({ settings: JSON.parse(row.settings) }));
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { user_id?: string; settings?: unknown };
  try { body = await request.json(); } catch { return cors(new Response('Bad JSON', { status: 400 })); }

  const { user_id, settings } = body;
  if (!user_id || !UUID_RE.test(user_id) || !settings) {
    return cors(new Response('Invalid body', { status: 400 }));
  }

  await env.DB
    .prepare(`
      INSERT INTO user_settings (user_id, settings, updated_at)
      VALUES (?, ?, unixepoch())
      ON CONFLICT(user_id) DO UPDATE SET
        settings   = excluded.settings,
        updated_at = excluded.updated_at
    `)
    .bind(user_id, JSON.stringify(settings))
    .run();

  return cors(Response.json({ ok: true }));
};
