import { createContext, useContext, useState, useEffect } from 'react'
import { getSession, onAuthChange, signIn, signOut } from '../lib/data'
import { isDemo } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo) {
      // Check if demo user is "logged in"
      const demoUser = localStorage.getItem('therock-demo-auth')
      if (demoUser) setUser(JSON.parse(demoUser))
      setLoading(false)
      return
    }

    getSession().then(session => {
      setUser(session?.user || null)
      setLoading(false)
    })

    const { data: { subscription } } = onAuthChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const result = await signIn(email, password)
    if (isDemo) {
      const u = { email: email || 'admin@demo.local' }
      localStorage.setItem('therock-demo-auth', JSON.stringify(u))
      setUser(u)
    } else {
      setUser(result.user)
    }
    return result
  }

  const logout = async () => {
    await signOut()
    if (isDemo) localStorage.removeItem('therock-demo-auth')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
