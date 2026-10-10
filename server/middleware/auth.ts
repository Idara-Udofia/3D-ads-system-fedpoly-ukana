import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import db from '../db/database.js';

export const SESSION_COOKIE = 'fedpoly_session';

export interface AuthPayload {
  userId: string;
  email: string;
  role: 'admin' | 'editor' | 'visitor';
  exp: number;
}

let ephemeralDevelopmentSecret: string | undefined;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && Buffer.byteLength(secret) >= 32) return secret;

  if (process.env.NODE_ENV !== 'production') {
    if (!ephemeralDevelopmentSecret) {
      ephemeralDevelopmentSecret = crypto.randomBytes(48).toString('base64url');
      console.warn('JWT_SECRET is unset or too short; using an ephemeral development secret. Sessions expire on restart.');
    }
    return ephemeralDevelopmentSecret;
  }

  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 bytes of random data.');
  }
  return secret;
}

export function assertAuthConfiguration(): void {
  getJwtSecret();
}

function sign(encodedPayload: string): string {
  return crypto.createHmac('sha256', getJwtSecret()).update(encodedPayload).digest('base64url');
}

export function signToken(payload: Omit<AuthPayload, 'exp'>, expiresInHours = 8): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const encodedPayload = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedPayload, signature] = parts;
    const expectedSignature = Buffer.from(sign(encodedPayload), 'base64url');
    const receivedSignature = Buffer.from(signature, 'base64url');
    if (
      expectedSignature.length !== receivedSignature.length ||
      !crypto.timingSafeEqual(expectedSignature, receivedSignature)
    ) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8')) as AuthPayload;
    if (
      typeof decoded.userId !== 'string' ||
      typeof decoded.email !== 'string' ||
      !['admin', 'editor', 'visitor'].includes(decoded.role) ||
      typeof decoded.exp !== 'number' ||
      decoded.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

function getSessionToken(req: Request): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;

  for (const item of cookieHeader.split(';')) {
    const separator = item.indexOf('=');
    if (separator < 0 || item.slice(0, separator).trim() !== SESSION_COOKIE) continue;
    try {
      return decodeURIComponent(item.slice(separator + 1).trim());
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = getSessionToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }

  const user = db.getUserById(payload.userId);
  if (!user || user.status !== 'active') {
    return res.status(401).json({ error: 'This account is unavailable. Please sign in again.' });
  }

  req.user = {
    ...payload,
    email: user.email,
    role: user.role,
  };
  next();
}

export function requireRole(allowedRoles: Array<'admin' | 'editor' | 'visitor'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions for this action.' });
    }
    next();
  };
}
