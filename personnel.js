const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwxKtzxJ_XcpIFuxp3VrBAkrjXHrnuGcZNxDcBqhNdLcG2QheYXF7_U33fCp_HCzsisQg/exec';

export async function onRequest(context) {
  const { request } = context;
  if (request.method === 'OPTIONS') return makeResponse('', 204);
  if (request.method !== 'POST') {
    return makeJson({ ok: false, error: true, message: 'Method not allowed. Use POST.' }, 405);
  }

  try {
    const body = await request.text();
    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body,
    });
    const text = await upstream.text();
    return makeResponse(text, upstream.ok ? upstream.status : 502);
  } catch (error) {
    return makeJson({
      ok: false,
      error: true,
      message: error.message || String(error),
    }, 500);
  }
}

function makeJson(data, status = 200) {
  return makeResponse(JSON.stringify(data), status);
}

function makeResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}
