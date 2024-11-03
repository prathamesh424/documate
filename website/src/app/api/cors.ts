// src/app/api/cors.ts
import { NextRequest, NextResponse } from 'next/server';

export function cors(req: NextRequest, res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    // @ts-ignore
    res.status(200).send(); // This should work correctly if types are set right
    return;
  }
}
