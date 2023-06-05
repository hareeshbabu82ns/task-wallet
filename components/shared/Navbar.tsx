import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full p-4 px-6 border-b border-[#343a40] flex items-center">
      <Link href={"/"} className="cursor-pointer">
        <h2 className="text-lg">Task-Wallet</h2>
      </Link>
      <ul className="ml-auto flex gap-5">
        <li>
          <Link href={"/login"}>Login</Link>
        </li>
        <li>
          <Link href={"/sign-up"}>Sign-Up</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
