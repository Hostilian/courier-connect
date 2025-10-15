'use client'

import { useEffect, useState } from 'react'

export default function DiagnosticPage() {
  const [checks, setChecks] = useState({
    react: false,
    router: false,
    icons: false,
    motion: false,
  })

  useEffect(() => {
    // Check React
    setChecks(prev => ({ ...prev, react: true }))
    
    // Check Router
    try {
      const { usePathname } = require('next/navigation')
      setChecks(prev => ({ ...prev, router: true }))
    } catch (e) {
      console.error('Router error:', e)
    }
    
    // Check Icons
    try {
      const { Package } = require('lucide-react')
      setChecks(prev => ({ ...prev, icons: true }))
    } catch (e) {
      console.error('Icons error:', e)
    }
    
    // Check Framer Motion
    try {
      const { motion } = require('framer-motion')
      setChecks(prev => ({ ...prev, motion: true }))
    } catch (e) {
      console.error('Framer Motion error:', e)
    }
  }, [])

  return (
    <div style={{ padding: '50px', fontFamily: 'system-ui' }}>
      <h1>🔍 Courier Connect Diagnostics</h1>
      <hr />
      <h2>Dependency Check:</h2>
      <ul>
        <li style={{ color: checks.react ? 'green' : 'red' }}>
          {checks.react ? '✅' : '❌'} React & Hooks
        </li>
        <li style={{ color: checks.router ? 'green' : 'red' }}>
          {checks.router ? '✅' : '❌'} Next.js Router
        </li>
        <li style={{ color: checks.icons ? 'green' : 'red' }}>
          {checks.icons ? '✅' : '❌'} Lucide Icons
        </li>
        <li style={{ color: checks.motion ? 'green' : 'red' }}>
          {checks.motion ? '✅' : '❌'} Framer Motion
        </li>
      </ul>
      <hr />
      <h2>Navigation Test:</h2>
      <ul>
        <li><a href="/" style={{ color: 'blue' }}>Home Page</a></li>
        <li><a href="/test" style={{ color: 'blue' }}>Simple Test Page</a></li>
        <li><a href="/request" style={{ color: 'blue' }}>Request Delivery</a></li>
      </ul>
    </div>
  )
}
