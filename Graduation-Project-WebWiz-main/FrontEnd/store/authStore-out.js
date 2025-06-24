import { create } from "zustand";
import { persist } from "zustand/middleware";

function decodeToken(token) {
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

const useAuthStore = create(
  persist(
    (set) => (
      {
        accessToken: null,
        refreshToken: null,
        setAccessToken: (token) => set({ accessToken: token }),
        setRefreshToken: (token) => set({ refreshToken: token }),
        logout: () => set({ accessToken: null, refreshToken: null }),
        getId: () => decodeToken(useAuthStore.getState().accessToken).Id,
        getUsername: () =>
          decodeToken(useAuthStore.getState().accessToken).UserName,
        canCreateTask: () =>
          decodeToken(useAuthStore.getState().accessToken).CanCreateTask,
        getEmail: () => decodeToken(useAuthStore.getState().accessToken).Email,
      },
      {
        name: "auth-Store",
      }
    )
  )
);

export default useAuthStore;
