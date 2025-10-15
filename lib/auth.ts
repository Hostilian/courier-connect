import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET

interface UserPayload {
  userId: string
  role: 'courier' | 'admin'
}

export async function getAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1]

  if (!token || !JWT_SECRET) {
    return { user: null }
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    return { user: payload as unknown as UserPayload }
  } catch (error) {
    return { user: null }
  }
}
