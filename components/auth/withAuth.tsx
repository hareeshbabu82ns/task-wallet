import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";

// This is a simple example of an authentication HOC
const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();

    const { user, loggedIn } = useAuthStore((s) => s);

    const { currentRealm } = useRealmStore((s) => s);

    useEffect(() => {
      if (!user || !currentRealm) {
        router.push("/login");
      }
    }, [user, router]);

    return user ? <WrappedComponent {...props} /> : <div>Loading...</div>;
  };

  return AuthenticatedComponent;
};

export default withAuth;
