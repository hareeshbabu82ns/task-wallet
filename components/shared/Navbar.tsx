import {
  logoutUser,
  useAuthStore,
} from "@/utils/zustand/authStore/useAuthStore";
import Link from "next/link";
import React from "react";
import { IoIosLogOut } from "react-icons/io";
import Conmbobox from "../common/combobox/Combobox";

const Navbar = () => {
  const authStore = useAuthStore((s) => s);

  const { loggedIn } = authStore;

  return (
    <nav className="w-full p-4 px-6 h-16 gap-5 border-b border-[#343a40] flex items-center">
      <Link href={"/"} className="cursor-pointer">
        <h2 className="text-xl font-semibold bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent">
          <span className="mt-6 pb-10">Task-</span>
          <span>Wallet</span>
        </h2>
      </Link>

      {loggedIn && <Conmbobox />}
      <ul className={`flex gap-5 ${loggedIn ? "" : "ml-auto"}`}>
        {!loggedIn && (
          <>
            <li>
              <Link href={"/login"}>Login</Link>
            </li>
            <li>
              <Link href={"/sign-up"}>Sign-Up</Link>
            </li>{" "}
          </>
        )}
        {loggedIn && (
          <li>
            <button
              className="flex items-center"
              onClick={() => logoutUser(authStore)}
            >
              <IoIosLogOut className="w-6 h-6" />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
