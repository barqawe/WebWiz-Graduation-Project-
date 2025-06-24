import { create } from "zustand";
import { persist } from "zustand/middleware";

// Decode JWT
function decodeToken(token) {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/_/g, "/").replace(/-/g, "+");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// Token Expiration Checker
function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),

      //make it hit the logout api endpoint
      logout: () => set({ accessToken: null, refreshToken: null }),

      isAuthenticated: () => {
        const token = get().accessToken;
        return !!token && !isTokenExpired(token);
      },

      getUser: () => decodeToken(get().accessToken), // Extract specific claims from token
      getTokenClaims: () => {
        const decoded = decodeToken(get().accessToken);
        if (!decoded) return null;
        return {
          name:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ] || null,
          userId:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ] ||
            decoded.nameidentifier ||
            null,
          canCreateTask: decoded.CanCreateTask === "True",
          exp: decoded.exp,
          iss: decoded.iss,
          aud: decoded.aud,
        };
      },

      canUserCreateTask: () => {
        const claims = get().getTokenClaims();
        return claims?.canCreateTask || false;
      },

      getTokenExpiry: () => {
        const claims = get().getTokenClaims();
        return claims?.exp ? new Date(claims.exp * 1000) : null;
      },

      getTokenIssuer: () => {
        const claims = get().getTokenClaims();
        return claims?.iss || null;
      },
      getTokenAudience: () => {
        const claims = get().getTokenClaims();
        return claims?.aud || null;
      },

      getUserName: () => {
        const claims = get().getTokenClaims();
        return claims?.name || null;
      },
      getUserId: () => {
        const claims = get().getTokenClaims();
        return claims?.userId || null;
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        const { accessToken } = get();

        const userId = get().getUserId();
        console.log("Refreshing access token for userId:", userId);

        if (!userId) return false;

        try {
          const res = await fetch(
            "http://localhost:5046/api/Auth/refresh-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                UserId: userId,
                RefreshToken: refreshToken,
              }),
            }
          );

          if (!res.ok) throw new Error("Refresh failed");

          const data = await res.json();
          set({ accessToken: data.accessToken });
          return true;
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: "auth-Store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStore;
