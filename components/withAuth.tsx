'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function withAuth(WrappedComponent: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const [isVerified, setIsVerified] = useState(false)
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/courier/login')
      } else {
        // You might want to verify the token with your backend here
        setIsVerified(true)
      }
    }, [router])

    if (!isVerified) {
      return null // Or a loading spinner
    }

    return <WrappedComponent {...props} />
  }
}
