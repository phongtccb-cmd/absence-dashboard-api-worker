const FALLBACK_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwxKtzxJ_XcpIFuxp3VrBAkrjXHrnuGcZNxDcBqhNdLcG2QheYXF7_U33fCp_HCzsisQg/exec';

export default {
  async fetch(request) {
    try {
      if (request.method === 'OPTIONS') {
        return makeResponse('', 204);
      }

      if (request.method === 'GET') {
        return makeJson({
          ok: true,
          service: 'absence-dashboard-api',
          message: 'Worker API is running. Dashboard will send POST requests.',
          time: new Date().toISOString(),
        });
      }

      if (request.method !== 'POST') {
        return makeJson({ error: true, message: 'Method not allowed. Use POST.' }, 405);
      }

      const body = await request.text();
      const upstream = await fetch(FALLBACK_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body,
      });
      const text = await upstream.text();

      if (!upstream.ok) {
        return makeJson({
          error: true,
          message: `Apps Script returned ${upstream.status}. Check Apps Script Web App access.`,
          upstreamStatus: upstream.status,
          upstreamPreview: text.slice(0, 300),
        }, 502);
      }

      return makeResponse(text, upstream.status);
    } catch (error) {
      return makeJson({
        error: true,
        message: error.message || String(error),
      }, 500);
    }
  },
};

function makeJson(data, status = 200) {
  return makeResponse(JSON.stringify(data), status);
}

function makeResponse(body, status = 200) {
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
