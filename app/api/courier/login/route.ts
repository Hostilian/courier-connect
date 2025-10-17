import { getErrorResponse } from '@/lib/helpers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return getErrorResponse(400, 'Email and password are required.');
    }

    await dbConnect();

    const user = await User.findOne({ email, role: 'courier' });

    if (!user) {
      return getErrorResponse(401, 'Invalid credentials.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return getErrorResponse(401, 'Invalid credentials.');
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user._id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    const response = NextResponse.json({
      message: 'Login successful',
      token,
    }, { status: 200 });

    // You might want to set the token in an HttpOnly cookie for better security
    // response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

    return response;

  } catch (error: any) {
    console.error('Login API error:', error);
    return getErrorResponse(500, error.message || 'Internal server error');
  }
}
