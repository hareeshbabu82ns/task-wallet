import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
const inter = Inter({ subsets: ["latin"] });
import "react-toastify/dist/ReactToastify.css";
import { getUser, useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import Sidebar from "@/components/shared/Sidebar/Sidebar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pagesWithoutSidebar = ["/sign-up", "/login"];
  const [showSideBar, setShowSidebar] = useState(false);

  const authStore = useAuthStore((s) => s);

  useEffect(() => {
    if (pagesWithoutSidebar.includes(router.pathname)) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [router.pathname]);

  useEffect(() => {
    getUser(authStore);
  }, []);

  return (
    <main className="p-6 bg-bg-primary min-h-screen max-[1200px]:p-0">
      <ToastContainer toastClassName={"bg-red-200"} theme="dark" />
      <div
        className={`flex rounded-2xl bg-bg-primary max-h-[calc(100vh-3rem)] min-h-[calc(100vh-3rem)] max-[1200px]:max-h-[100vh] max-[1200px]:rounded-none max-[1200px]:min-h-[100vh] overflow-hidden text-text-primary  shadow-shadow-primary flex-col ${inter.className}`}
      >
        <Navbar />

        <div className="flex relative w-full min-h-full grow">
          <div className="grow flex  max-[900px]:flex-col-reverse overflow-scroll relative">
            {/* <SecondaryNavbar />  */}

            <Sidebar />
            <div className="grow w-full flex flex-col">
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
