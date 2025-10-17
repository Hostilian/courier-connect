import dbConnect from '@/lib/mongodb';
import { courierRegistrationSchema } from '@/lib/validation';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    const validationResult = courierRegistrationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { name, email, password, phone, city, vehicleType } = validationResult.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'courier',
      courierProfile: {
        city,
        vehicleType,
        status: 'pending_approval',
        rating: 0,
        deliveriesCompleted: 0,
      },
    });

    await newUser.save();

    // In a real app, you'd send a verification email here

    return NextResponse.json({ message: 'Courier registered successfully. Please log in.' }, { status: 201 });

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during registration.' }, { status: 500 });
  }
}
