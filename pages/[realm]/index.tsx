import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const IndexPage = () => {
  const router = useRouter();

  const { loggedIn } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);
  useEffect(() => {
    if (loggedIn && currentRealm) {
      router.push(`/${currentRealm.name}/dashboard`);
    }
  }, [loggedIn, currentRealm]);
  return <div>IndexPage</div>;
};

export default IndexPage;
