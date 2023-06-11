import React from "react";
import Conmbobox from "../../common/combobox/Combobox";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
// import Modal from "../common/Dialog";
import * as TfiIcons from "react-icons/tfi";
import * as CiIcons from "react-icons/ci";
import * as AiIcons from "react-icons/ai";
import Link from "next/link";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const Sidebar = () => {
  return (
    <aside className="w-fit min-h-full border-r-border-primary sticky top-0 border-r py-5">
      {/* <Conmbobox /> */}
      <Routes />
    </aside>
  );
};

export default Sidebar;

//

const tabs = [
  // { icon: <RxIcons.RxDashboard />, label: "Dashboard" },
  { icon: <TfiIcons.TfiWallet className="w-6 h-6" />, label: "Wallet" },
  { icon: <CiIcons.CiCircleList className="w-7 h-7" />, label: "Tasks" },
  { icon: <AiIcons.AiOutlineSetting className="w-6 h-6" />, label: "Settings" },
];

const Routes = () => {
  const { currentRealm } = useRealmStore((s) => s);
  const {} = useAuthStore((s) => s);
  const routes = [{ title: "Wallet", links: "" }];
  const router = useRouter();

  return (
    <div className="w-full pb-6 pt-2 sticky top-0 left-0">
      <ul className="flex flex-col z-10 justify-evenly gap-3 w-full sticky top-0 bg-bg-primary">
        {currentRealm &&
          tabs.map((item) => (
            <Link
              key={item.label}
              className={`w-full py-4 px-6 transition-all  flex items-center gap-3 relative ${
                router.pathname.includes(item.label.toLowerCase()) &&
                "shadow-shadow-form-input"
              }`}
              href={{
                pathname: `/[realm]/${item.label.toLowerCase()}`,
                query: { realm: currentRealm.name },
              }}
            >
              {item.icon}
              {/* {item.label} */}
              {router.pathname.includes(item.label.toLowerCase()) ? (
                <motion.div
                  className="border-l-[4px] left-0 rounded-[1px] rounded-l-none border-secondary absolute h-full w-[4px]"
                  layoutId="underline"
                />
              ) : null}
            </Link>
          ))}
      </ul>{" "}
    </div>
  );
};
