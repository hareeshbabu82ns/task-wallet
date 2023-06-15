import Image from "next/image";
import { Inter } from "next/font/google";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import { useRouter } from "next/router";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import { useEffect } from "react";
import { ComboboxList } from "@/components/common/combobox/Combobox";
import Link from "next/link";
import { motion } from "framer-motion";
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

  const itemVarient2 = {
    open: {
      scale: 1,
      opacity: 1,
    },
    closed: {
      scale: 0,
      opacity: 0,
    },
  };

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
          <div className="flex gap-2">
            <Link
              className="!px-4 py-1 bg-gradient-to-b   from-primary text-xl to-secondary bg-clip-text text-transparent"
              href="/login"
            >
              Login
            </Link>{" "}
            <Link
              className="px-4 py-1 bg-gradient-to-b   from-primary text-xl to-secondary bg-clip-text text-transparent"
              href="/sign-up"
            >
              Sign-Up
            </Link>{" "}
          </div>
          <motion.div
            variants={itemVarient2}
            transition={{ duration: 0.5 }}
            className="bg-red relative mt-4 h-[max(20vh,11vw)] w-[max(40vh,25vw)] max-md:mb-52 max-sm:h-[min(25vh,30vw)] max-sm:w-[70%]"
          >
            <Image
              src={"/tw-wallet.png"}
              width={200}
              height={400}
              alt="project screenshot"
              className="absolute -left-[52%] top-0 h-full w-full rounded-2xl shadow-xl transition-all hover:z-20 hover:scale-110 max-md:-left-[25%]"
            />
            <Image
              src={"/tw-tasks.png"}
              width={200}
              height={400}
              alt="project screenshot"
              className="absolute left-[50%] top-[40%] z-10 h-full w-full translate-x-[-50%] rounded-2xl shadow-xl transition-all hover:z-10 hover:scale-110 max-md:top-[80%]"
            />
            <Image
              src={"/tw-wallet.png"}
              width={200}
              height={400}
              alt="project screenshot"
              className="absolute -right-[52%] top-0 h-full w-full rounded-2xl shadow-xl transition-all hover:z-20 hover:scale-110 max-md:-right-[25%] max-md:top-[160%]"
            />
          </motion.div>
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
