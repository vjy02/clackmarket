'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const routeUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userProfile, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      if (!userProfile?.username) {
        router.replace('/onboarding')
      } else {
        router.replace('/') 
      }
    }

    routeUser()
  }, [])

  return <p>Redirecting...</p>
}
