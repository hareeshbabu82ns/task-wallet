import NewTransactionModal from "@/components/pages/Wallet/NewTransactionModal";
import TransactionCard from "@/components/pages/Wallet/TransactionCard";
import WalletHeader from "@/components/pages/Wallet/WalletHeader";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import {
  getRealmBalance,
  getTransactions,
  useWalletStore,
} from "@/utils/zustand/walletStore/useWalletStore";
import { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useInView } from "react-intersection-observer";
import withAuth from "@/components/auth/withAuth";

const WalletPage = () => {
  const [newTransactionModal, setNewTransactionModal] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: true, // This option ensures the event triggers only once
  });

  const [filters, setFilters] = useState<null | {
    transactionType?: string;
    transactionMedthod?: string;
    toDate?: string;
    search?: string;
  }>(null);

  const walletStore = useWalletStore((s) => s);
  const {
    balance,
    realm,
    credit,
    isLoading: balanceIsLoaidng,
    transactionsIsLoading,
    transactions,
    page,
    newPageIsLoading,
    hasMore,
  } = walletStore;

  const { user } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);

  useEffect(() => {
    if (
      (balance === null && user && currentRealm && !balanceIsLoaidng) ||
      (currentRealm?.name !== realm &&
        user &&
        currentRealm &&
        !balanceIsLoaidng)
    ) {
      getRealmBalance({
        userId: user.$id,
        realm: currentRealm.name,
        walletStore,
      });
    }
  }, [currentRealm, user, balance]);

  useEffect(() => {
    let timeOut: NodeJS.Timeout;
    if (currentRealm && user) {
      timeOut = setTimeout(() => {
        getTransactions({
          walletStore,
          realm: currentRealm?.name,
          userId: user?.$id,
          filters: filters || undefined,
          page: 1,
        });
      }, 500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [user, currentRealm, filters]);

  useEffect(() => {
    if (
      realm &&
      user &&
      currentRealm &&
      !transactionsIsLoading &&
      hasMore &&
      page &&
      inView
    ) {
      getTransactions({
        walletStore,
        realm: currentRealm?.name,
        userId: user?.$id,
        filters: filters || undefined,
        page: page + 1,
      });
    }
  }, [hasMore, page, inView]);

  return (
    <div className="p-[min(3vh,3vw)] py-[min(2vh,2vw)] relative flex flex-col h-full gap-4 overflow-auto grow max-[900px]:h-fit">
      <button
        onClick={() => setNewTransactionModal(true)}
        className="p-1 bg-gradient-to-b from-primary to-secondary justify-center flex items-center gap-2 fixed rounded-full right-[5rem] bottom-[5rem]"
      >
        <IoIosAdd className="w-8 h-8" />
      </button>
      <NewTransactionModal
        setOpen={setNewTransactionModal}
        open={newTransactionModal}
      />
      <WalletHeader setFilters={setFilters} />
      <div className="my-4 mt-2 w-full h-full rounded-2xl flex grow overflow-scroll flex-col gap-3 shadow-shadow-form-input px-[min(3vh,3vw)] py-6">
        <h2 className="mb-2 px-2 text-xl font-medium ">Transactions</h2>
        {transactions &&
          (!transactionsIsLoading || newPageIsLoading) &&
          transactions.map((transaction, i) => {
            if (i === transactions.length - 1) {
              return (
                <TransactionCard ref={ref} transaction={transaction} key={i} />
              );
            }
            return <TransactionCard transaction={transaction} key={i} />;
          })}
        {transactionsIsLoading && <TransactionsSkeleton />}
        {!transactionsIsLoading &&
          (!transactions || transactions.length) === 0 &&
          page === 1 && (
            <h1 className="text-center text-lg my-20">No Transaction Found!</h1>
          )}
        {!transactionsIsLoading &&
          transactions &&
          transactions?.length > 0 &&
          page &&
          !hasMore && (
            <h1 className="text-center text-lg my-5">End of results.</h1>
          )}
      </div>
    </div>
  );
};

export default withAuth(WalletPage);

const TransactionsSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl">
      <Skeleton
        className="w-20 h-[4.2rem] !rounded-2xl shadow-shadow-primary-sm"
        baseColor="#212529"
        highlightColor="#202020"
        duration={1}
      ></Skeleton>
      <Skeleton
        className="w-20 h-[4.2rem] !rounded-2xl overflow-hidden shadow-shadow-primary-sm"
        baseColor="#212529"
        highlightColor="#202020"
        duration={1}
      ></Skeleton>
      <Skeleton
        className="w-20 h-[4.2rem] !rounded-2xl shadow-shadow-primary-sm"
        baseColor="#212529"
        highlightColor="#202020"
        duration={1}
      ></Skeleton>
      <Skeleton
        className="w-20 h-[4.2rem] !rounded-2xl shadow-shadow-primary-sm"
        baseColor="#212529"
        highlightColor="#202020"
        duration={1}
      ></Skeleton>
      <Skeleton
        className="w-20 h-[4.2rem] !rounded-2xl shadow-shadow-primary-sm"
        baseColor="#212529"
        highlightColor="#202020"
        duration={1}
      ></Skeleton>
    </div>
  );
};
