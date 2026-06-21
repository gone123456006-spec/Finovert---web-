import https from 'https';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends a WhatsApp message via the free CallMeBot API.
 *
 * One-time setup required:
 *   1. Open WhatsApp → send "I allow callmebot to send me messages" to +34 644 68 25 95
 *   2. You will receive an API key via WhatsApp reply
 *   3. Set CALLMEBOT_PHONE and CALLMEBOT_APIKEY in your .env file
 *
 * @param {string} message - Plain text message to send
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendWhatsApp = async (message) => {
  const phone  = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apiKey || apiKey === 'your_callmebot_api_key_here') {
    console.warn('[WhatsApp] Skipped — CALLMEBOT_PHONE or CALLMEBOT_APIKEY not configured in .env');
    return { success: false, error: 'WhatsApp not configured' };
  }

  const encodedMsg = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMsg}&apikey=${apiKey}`;

  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('[WhatsApp] Message sent successfully');
          resolve({ success: true });
        } else {
          console.error(`[WhatsApp] Failed — status ${res.statusCode}: ${data}`);
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', (err) => {
      console.error('[WhatsApp] Request error:', err.message);
      resolve({ success: false, error: err.message });
    });

    req.setTimeout(8000, () => {
      req.destroy();
      console.error('[WhatsApp] Request timed out');
      resolve({ success: false, error: 'Timeout' });
    });
  });
};
