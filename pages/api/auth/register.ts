import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  await dbConnect()

  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    vehicleType
  } = req.body

  if (!firstName || !lastName || !email || !phone || !password || !vehicleType) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = new User({
    name: `${firstName} ${lastName}`,
    email,
    phone,
    password: hashedPassword,
    role: 'courier',
    vehicleType,
    availabilityStatus: 'offline'
  })

  try {
    await user.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
