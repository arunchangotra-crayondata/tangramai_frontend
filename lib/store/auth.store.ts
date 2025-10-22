import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '../api/auth.service'
import type { AuthState, AuthActions, SignupRequest } from '../types/auth.types'

interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      redirectUrl: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null, redirectUrl: null })
        
        try {
          const response = await authService.login(email, password)
          
          if (response.success && response.user) {
            // Determine redirect URL based on user role
            let redirectUrl = null
            
            // Always use role-based redirect, ignore API redirect URLs
            switch (response.user.role) {
              case 'admin':
                redirectUrl = '/admin'
                break
              case 'isv':
                redirectUrl = '/agents'
                break
              case 'reseller':
                redirectUrl = '/agents'
                break
              case 'client':
                redirectUrl = '/agents'
                break
              default:
                redirectUrl = '/'
            }
            
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              redirectUrl: redirectUrl,
            })
            return { success: true, redirect: redirectUrl }
          } else {
            set({
              isLoading: false,
              error: response.message || 'Login failed',
            })
            return { success: false }
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'An unexpected error occurred',
          })
          return { success: false }
        }
      },

      signup: async (data: SignupRequest) => {
        set({ isLoading: true, error: null, redirectUrl: null })
        
        try {
          const response = await authService.signup(data)
          
          if (response.success) {
            // Determine redirect URL based on user role
            let redirectUrl = response.redirect || null
            
            if (!redirectUrl) {
              switch (data.role) {
                case 'isv':
                  redirectUrl = '/dashboard'
                  break
                case 'reseller':
                  redirectUrl = '/'
                  break
                case 'client':
                  redirectUrl = '/dashboard'
                  break
                default:
                  redirectUrl = '/'
              }
            }
            
            set({
              isLoading: false,
              error: null,
              redirectUrl: redirectUrl,
            })
            return { 
              success: true, 
              message: response.message,
              redirect: redirectUrl 
            }
          } else {
            set({
              isLoading: false,
              error: 'Signup failed',
            })
            return { success: false }
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'An unexpected error occurred',
          })
          return { success: false }
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          redirectUrl: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
