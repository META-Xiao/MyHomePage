// Vercel Serverless 函数入口
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/server';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}

