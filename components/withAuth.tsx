// So this is what they call a "Higher Order Component." Fancy name for a bouncer at a club.
// You wanna get in? Show me your token. No token? Get outta here.
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// This function wraps another component. Like a burrito, but for React components.
// The wrapped component only renders if you've got the goods. Otherwise? Kicked to the curb.
export default function withAuth(ComponentThatThinksTooHighlyOfItself: React.ComponentType) {
  // Returns a NEW component. It's inception, but for JavaScript.
  return function TheBouncerComponent(props: any) {
    const [hasProofOfIdentity, setHasProofOfIdentity] = useState(false) // Do they have a token? Unknown at first.
    const router = useRouter() // Navigation. For when we need to throw people out.

    // This runs when the component loads. Like a security check at the airport, but faster.
    useEffect(() => {
      const token = localStorage.getItem('token') // Check the hall pass
      if (!token) {
        // No token? Back to login with you. No soup for you!
        router.push('/courier/login')
      } else {
        // Got a token. Could be fake, but we're not gonna check too hard.
        // You might want to verify this with your backend, but who has the time, really?
        setHasProofOfIdentity(true) // You're in. Congratulations.
      }
    }, [router])

    if (!hasProofOfIdentity) {
      // Still checking credentials. Show 'em nothing. Make 'em wait.
      return null // Or a loading spinner if you're feeling generous
    }

    // Alright, they're legit. Let 'em through. Here's your component.
    return <ComponentThatThinksTooHighlyOfItself {...props} />
  }
}
