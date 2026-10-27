
/*
 * Endpoint analisis eksperimental LEOCE.
 * Catatan: transkripsi otomatis TIDAK cukup untuk menilai artikulasi fonetik R/S.
 * Endpoint ini mengembalikan transkripsi sebagai bahan tinjauan, bukan diagnosis atau skor otomatis.
 * API key disimpan di Netlify Environment Variables sebagai OPENAI_API_KEY.
 */
exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Gunakan metode POST." }) };
  if (!process.env.OPENAI_API_KEY) return { statusCode: 503, headers, body: JSON.stringify({ error: "OPENAI_API_KEY belum diatur di Netlify. Analisis audio belum aktif." }) };
  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: "Body JSON tidak valid." }) }; }
  if (!payload.audioData || !payload.text) return { statusCode: 400, headers, body: JSON.stringify({ error: "audioData dan text wajib diisi." }) };
  try {
    const match = /^data:([^;]+);base64,(.+)$/.exec(payload.audioData);
    if (!match) return { statusCode: 400, headers, body: JSON.stringify({ error: "Format audio tidak valid." }) };
    const mime = match[1];
    const bytes = Buffer.from(match[2], "base64");
    if (bytes.length > 20 * 1024 * 1024) return { statusCode: 413, headers, body: JSON.stringify({ error: "Audio terlalu besar (maksimum 20 MB)." }) };
    const ext = mime.includes("mp4") ? "mp4" : mime.includes("ogg") ? "ogg" : mime.includes("wav") ? "wav" : "webm";
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: mime }), `leoce-audio.${ext}`);
    form.append("model", "gpt-4o-mini-transcribe");
    form.append("language", "id");
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form
    });
    const result = await response.json();
    if (!response.ok) return { statusCode: 502, headers, body: JSON.stringify({ error: result.error?.message || "Layanan transkripsi gagal." }) };
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        transcript: result.text || "",
        referenceText: String(payload.text).slice(0, 500),
        targetSound: String(payload.target || "R dan S").slice(0, 20),
        status: "NEEDS_HUMAN_REVIEW",
        note: "Transkripsi hanya membantu memeriksa kata yang dikenali. Transkripsi tidak dapat memastikan kejelasan artikulasi R/S. Penguji perlu mendengarkan audio dan mengisi skor manual; ini bukan diagnosis."
      })
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Terjadi kesalahan saat memproses audio." }) };
  }
};
// Pemicu deploy Netlify
