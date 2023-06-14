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
    <div className="p-10 py-6 flex flex-col grow h-full overflow-hidden justify-center items-center">
      <WalletAnalytics />
    </div>
  );
};

export default DashboardPage;
