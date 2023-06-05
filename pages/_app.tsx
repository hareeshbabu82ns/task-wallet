import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Client, Functions } from "appwrite";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pagesWithoutSidebar = ["/sign-up", "/login"];
  const [showSideBar, setShowSidebar] = useState(false);
  useEffect(() => {
    if (pagesWithoutSidebar.includes(router.pathname)) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [router.pathname]);
  return (
    <main className="p-12 bg-bg-primary min-h-screen">
      <div
        className={`flex rounded-2xl bg-bg-primary h-[calc(100vh-6rem)] text-text-primary  shadow-shadow-primary flex-col ${inter.className}`}
      >
        <Navbar />
        <div className="flex w-full h-full">
          {showSideBar && <Sidebar />}
          <div className="grow h-full overflow-scroll">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </main>
  );
}
