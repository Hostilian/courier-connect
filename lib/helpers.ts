import { NextResponse } from 'next/server';

export function getErrorResponse(
  status: number,
  message: string,
  errors: any = null
) {
  return new NextResponse(
    JSON.stringify({
      message,
      ...(errors && { errors }),
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
