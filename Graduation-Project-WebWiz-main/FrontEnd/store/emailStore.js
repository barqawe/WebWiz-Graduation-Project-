import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Email Store
 *
 * This store manages email state for the application.
 */

const useEmailStore = create(
  persist(
    (set, get) => ({
      email: null,
      CodeResult: false,
      resetToken: null,
      tokenExpiry: null,
      resetFlowStep: 'forgot-password', // Track current step in flow
      
      // Set email and initialize reset session
      setEmail: (email) => {
        const token = crypto.randomUUID();
        const expiry = Date.now() + (15 * 60 * 1000); // 15 minutes
        set({ 
          email, 
          resetToken: token, 
          tokenExpiry: expiry,
          resetFlowStep: 'reset-password-code',
          CodeResult: false 
        });
      },
      
      // Set code verification result and advance to next step
      setCodeResult: (value) => {
        if (value === true) {
          set({ 
            CodeResult: value,
            resetFlowStep: 'reset-password'
          });
        } else {
          set({ CodeResult: value });
        }
      },
      
      // Clear entire reset session
      clearEmail: () => set({ 
        email: null, 
        resetToken: null, 
        tokenExpiry: null,
        resetFlowStep: 'forgot-password',
        CodeResult: false 
      }),
      
      // Clear reset session (for successful completion)
      clearResetSession: () => set({
        email: null,
        resetToken: null,
        tokenExpiry: null,
        resetFlowStep: 'forgot-password',
        CodeResult: false
      }),
      
      // Getters
      getEmail: () => get().email,
      getResetToken: () => get().resetToken,
      getTokenExpiry: () => get().tokenExpiry,
      
      // Check if token is valid
      isTokenValid: () => {
        const { resetToken, tokenExpiry } = get();
        return resetToken && tokenExpiry && Date.now() < tokenExpiry;
      },
      
      // Extend token expiry (for code resend)
      extendToken: () => {
        const expiry = Date.now() + (15 * 60 * 1000); // 15 minutes
        set({ tokenExpiry: expiry });
      },
    }),
    {
      name: "email-store",
    }
  )
);

export default useEmailStore;
