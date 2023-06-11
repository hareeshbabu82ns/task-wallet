import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import React from "react";
import * as TfiIcons from "react-icons/tfi";
import * as CiIcons from "react-icons/ci";
import * as AiIcons from "react-icons/ai";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

const SecondaryNavbar = () => {
  const { currentRealm } = useRealmStore((s) => s);

  const router = useRouter();

  const tabs = [
    // { icon: <RxIcons.RxDashboard />, label: "Dashboard" },
    { icon: <TfiIcons.TfiWallet />, label: "Wallet" },
    { icon: <CiIcons.CiCircleList className="w-5 h-5" />, label: "Tasks" },
    { icon: <AiIcons.AiOutlineSetting />, label: "Settings" },
  ];

  return (
    <ul className="flex z-10 justify-evenly w-full border-b sticky shadow-shadow-form-input top-0 bg-bg-primary border-border-primary">
      {currentRealm &&
        tabs.map((item) => (
          <Link
            key={item.label}
            className="w-full py-[10px] flex items-center gap-3 justify-center relative"
            href={{
              pathname: `/[realm]/${item.label.toLowerCase()}`,
              query: { realm: currentRealm.name },
            }}
          >
            {item.icon}
            {item.label}
            {router.pathname.includes(item.label.toLowerCase()) ? (
              <motion.div
                className="border-b-[2px] rounded-sm border-secondary absolute top-[calc(100%-1px)] w-full bg-red-100 h-[1px]"
                layoutId="underline"
              />
            ) : null}
          </Link>
        ))}
    </ul>
  );
};

export default SecondaryNavbar;
