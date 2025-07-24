import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (userStr && token) {
      const user = JSON.parse(userStr);
      if (user.role === "admin") router.replace("/admin");
      else if (user.role === "reviewer") router.replace("/reviewer");
      else router.replace("/researcher");
    }
  }, [router]);
} 