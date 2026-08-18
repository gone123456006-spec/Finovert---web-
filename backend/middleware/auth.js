import jwt from 'jsonwebtoken';

export const ADMIN_COOKIE = 'finovert_admin';
const TOKEN_TTL = '8h';

function getJwtSecret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16) {
    return process.env.JWT_SECRET;
  }
  return process.env.ADMIN_PASSWORD || "finovert-dev-jwt-secret-change-me";
}

export function signAdminToken(payload) {
  return jwt.sign(
    { role: payload.role, username: payload.username, name: payload.name },
    getJwtSecret(),
    { expiresIn: TOKEN_TTL }
  );
}

export function setAuthCookie(_res, _token) {
  // Cross-origin (Vercel ↔ Render) cookies are blocked by browsers.
  // Auth uses the Bearer token in the JSON response instead.
}

export function clearAuthCookie(_res) {
  // No cookie to clear — session is the Bearer token on the client.
}

function extractToken(req) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
}

export function requireAuth(...roles) {
  return (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
      const decoded = jwt.verify(token, getJwtSecret());
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Insufficient permissions.' });
      }
      req.admin = decoded;
      next();
    } catch {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
  };
}
