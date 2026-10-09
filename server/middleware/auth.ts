import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import db, { User } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fedpolyukana_academic_secret_key_2026';

export interface AuthPayload {
  userId: string;
  email: string;
  role: 'admin' | 'editor' | 'visitor';
  exp: number;
}

export function signToken(payload: Omit<AuthPayload, 'exp'>, expiresInHours = 24): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const fullPayload: AuthPayload = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(encodedPayload).digest('base64url');
    if (signature !== expectedSignature) return null;

    const decoded = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8')) as AuthPayload;
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
  }

  const token = authHeader.slice(7).trim();
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  req.user = payload;
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
