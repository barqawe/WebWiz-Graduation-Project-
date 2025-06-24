"use client";

import AuthGuard from "@/guard/AuthGuard";

export default function CreateLayout({ children }) {
  return <AuthGuard requireCreateTask={true}>{children}</AuthGuard>;
}
