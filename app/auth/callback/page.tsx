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
        .eq('uuid', user.id)
        .single()

      if (error) {
        router.replace('/onboarding')
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

 return (    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex items-center gap-3 text-gray-700 text-sm">
        <svg
          className="h-5 w-5 animate-spin text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span>Redirecting you back...</span>
      </div>
    </div>)
}
