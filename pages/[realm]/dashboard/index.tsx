import withAuth from "@/components/auth/withAuth";
import WalletAnalytics from "@/components/pages/Dashboard/WalletAnalytics";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import {
  getWalletData,
  useDashboardStore,
} from "@/utils/zustand/dashboardStore/useDashboardStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  return (
    <div className="px-[min(5vh,5vw)] py-[min(3vh,3vw)] flex flex-col grow h-full w-full overflow-auto">
      <WalletAnalytics />
    </div>
  );
};

export default withAuth(DashboardPage);
