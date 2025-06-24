//dont forget to use the aouth guard here
import AuthGuard from "@/guard/AuthGuard.jsx";

export default function Layout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
