const FALLBACK_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwxKtzxJ_XcpIFuxp3VrBAkrjXHrnuGcZNxDcBqhNdLcG2QheYXF7_U33fCp_HCzsisQg/exec';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return jsonResponse(null, 204);
    }

    if (request.method === 'GET') {
      return jsonResponse({
        ok: true,
        service: 'absence-dashboard-api',
        message: 'API da san sang. Dashboard se gui du lieu bang POST.',
        path: url.pathname,
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: true, message: 'Method not allowed. Use POST.' }, 405);
    }

    const appsScriptUrl = env.APPS_SCRIPT_DASHBOARD_API_URL || FALLBACK_APPS_SCRIPT_URL;
    const body = await request.text();

    try {
      const upstream = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body,
      });
      const text = await upstream.text();

      if (!upstream.ok) {
        return jsonResponse({
          error: true,
          message: `Apps Script returned ${upstream.status}. Kiem tra Apps Script Web App: Execute as Me va Who has access la Anyone/Anyone with the link.`,
          upstreamStatus: upstream.status,
          upstreamPreview: text.slice(0, 300),
        }, 502);
      }

      return jsonTextResponse(text, upstream.status);
    } catch (error) {
      return jsonResponse({
        error: true,
        message: error.message || String(error),
      }, 500);
    }
  },
};

function jsonResponse(data, status = 200) {
  return jsonTextResponse(data == null ? '' : JSON.stringify(data), status);
}

function jsonTextResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}
