// GET /api/status — memberi tahu frontend penyedia AI yang aktif (tanpa membocorkan kunci).
const { sendJson } = require('./_util');

module.exports = async function handler(req, res) {
  const provider = process.env.GEMINI_API_KEY ? 'gemini' : process.env.OPENAI_API_KEY ? 'openai-compatible' : 'offline';
  sendJson(res, 200, { ai: provider, time: new Date().toISOString() });
};
