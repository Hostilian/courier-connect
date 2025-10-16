// Authentication library. Or as I like to call it, "the bouncer."
// JWT tokens, verification, all that security theater. Very important stuff, allegedly.
import { jwtVerify } from 'jose'; // Jose. Not the person. The library. Named after... someone? Who knows.
import { NextRequest } from 'next/server'

// The secret. Shhhh. Don't tell anyone. Except everyone who has access to the .env file.
const JWT_SECRET = process.env.JWT_SECRET

// What's inside the token? Let me tell you. It's not much.
interface UserPayload {
  userId: string // Who you are. Allegedly.
  role: 'courier' | 'admin' // What you do. Either schlep boxes or tell people to schlep boxes.
}

// This function checks if you're who you say you are.
// It's like showing your ID at a bar, except more complicated and less fun.
export async function getAuth(request: NextRequest) {
  // Step 1: Get the token from the headers. It's after "Bearer ". Because we're fancy.
  const token = request.headers.get('authorization')?.split(' ')[1]

  // No token or no secret? Get outta here. We don't serve your kind.
  if (!token || !JWT_SECRET) {
    return { user: null } // Translation: "Who are you? Never mind, we don't care."
  }

  try {
    // Try to verify the token. This is where the magic happens. Or doesn't.
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET) // Encode the secret. Make it computery.
    )
    // Success! They're legit. Probably.
    return { user: payload as unknown as UserPayload } // "as unknown as" - TypeScript's way of saying "I give up"
  } catch (error) {
    // Verification failed. The token's fake, expired, or just bad.
    // Either way, you're nobody. Sorry pal.
    return { user: null }
  }
}
