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
import { RxDashboard } from "react-icons/rx";

const Sidebar = () => {
  return (
    <aside className="w-fit sticky left-0 top-0 max-[900px]:w-full min-h-full max-[900px]:min-h-fit bg-bg-primary z-50 max-[900px]:shadow-shadow-primary-sm max-[900px]:pt-0 left-0 max-[900px]:fixed max-[900px]:bottom-0 max-[900px]:h-fit max-[900px]:left-0 max-[900px]:pb-0 border-r-border-primary border-r py-5 max-[900px]:py-0">
      <Routes />
    </aside>
  );
};

export default Sidebar;

//

const tabs = [
  // { icon: <RxIcons.RxDashboard />, label: "Dashboard" },
  { icon: <RxDashboard className="w-6 h-6" />, label: "Dashboard" },
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
    <div className="w-full pb-6 pt-2 bg-bg-primary max-[900px]:z-20  max-[900px]:pb-0 max-[900px]:pt-0">
      <ul className="flex flex-col justify-evenly gap-3 w-full  bg-bg-primary max-[900px]:flex-row">
        {currentRealm &&
          tabs.map((item) => (
            <Link
              key={item.label}
              className={`w-full py-4 px-6 max-[900px]:py-3 transition-all  flex items-center max-[900px]:justify-center gap-3 relative ${
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
                  className={`border-l-[4px] left-0 rounded-[1px] rounded-l-none border-secondary absolute h-full w-[4px] max-[900px]:border-l-0 max-[900px]:border-b-4 max-[900px]:w-full`}
                  layoutId="underline"
                />
              ) : null}
            </Link>
          ))}
      </ul>{" "}
    </div>
  );
};
