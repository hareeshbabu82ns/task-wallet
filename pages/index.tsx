import Image from "next/image";
import { Inter } from "next/font/google";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import { useRouter } from "next/router";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import { useEffect } from "react";
import { ComboboxList } from "@/components/common/combobox/Combobox";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  const { loggedIn } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);

  useEffect(() => {
    if (loggedIn && currentRealm) {
      router.push(`/${currentRealm.name}/dashboard`);
    }
  }, [loggedIn, currentRealm]);

  return (
    <>
      {!loggedIn ? (
        <div className="flex grow h-full w-full items-center max-w-3xl mx-auto mt-20 gap-8 text-center flex-col">
          <h1 className="bg-gradient-to-b font-semibold from-primary text-5xl leading-[4rem] to-secondary bg-clip-text text-transparent ">
            Task-Wallet
          </h1>
          <h1 className="bg-gradient-to-b font-semibold from-primary text-3xl to-secondary bg-clip-text text-transparent ">
            Your Ultimate Tool for Expenses, Tasks, and Analytics{" "}
          </h1>
          <p>
            Streamline your life with our powerful app that combines expense
            management, task organization, and insightful analytics. Stay on top
            of your finances by effortlessly tracking and categorizing expenses,
            ensuring you never miss a beat. Seamlessly manage your to-do list,
            prioritize tasks, and boost your productivity. Gain valuable
            insights through intuitive analytics, allowing you to make informed
            decisions and optimize your financial and task management
            strategies. Take control of your life with our all-in-one solution
            that simplifies expense tracking, task management, and provides
            actionable analytics for ultimate efficiency.
          </p>
          <div className="flex gap-4">
            <ButtonPrimary className="text-sm !px-4 py-1" text="Login" />{" "}
            <ButtonPrimary className="text-sm !px-4 py-1" text="Signup" />{" "}
          </div>
        </div>
      ) : (
        <div className="flex grow h-full w-full items-center max-w-3xl mx-auto mt-20 gap-8 text-center flex-col">
          <h2 className="bg-gradient-to-b font-semibold from-primary text-5xl leading-[4rem] to-secondary bg-clip-text mt-20 text-transparent ">
            Welcome to Task-Wallet
          </h2>
          <h2>Create Your First Realm To Get Started.</h2>
          <div className="w-fit">
            <ComboboxList className="px-0 !pl-20 py-0 !ml-0" />
          </div>
        </div>
      )}
    </>
  );
}
