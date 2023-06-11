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

const WalletPage = () => {
  const [newTransactionModal, setNewTransactionModal] = useState(false);

  const walletStore = useWalletStore((s) => s);
  const {
    balance,
    realm,
    credit,
    isLoading: balanceIsLoaidng,
    transactions,
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
    if (currentRealm && user)
      getTransactions({
        walletStore,
        realm: currentRealm?.name,
        userId: user?.$id,
      });
  }, [user, currentRealm]);

  return (
    <div className="p-10 py-3 relative flex flex-col gap-4 h-full">
      <button
        onClick={() => setNewTransactionModal(true)}
        className="p-1 bg-gradient-to-b from-primary to-secondary justify-center flex items-center gap-2 fixed rounded-full right-[4rem] bottom-[4rem]"
      >
        <IoIosAdd className="w-8 h-8" />
      </button>
      <NewTransactionModal
        setOpen={setNewTransactionModal}
        open={newTransactionModal}
      />
      <WalletHeader />
      <div className="my-4 mt-2 w-full rounded-2xl flex grow h-full overflow-scroll flex-col gap-3 shadow-shadow-form-input px-6 py-6">
        <h2 className="mb-2 px-2 text-xl font-medium ">Transactions</h2>
        {transactions &&
          transactions.map((transaction, i) => (
            <TransactionCard transaction={transaction} key={i} />
          ))}
        {transactions &&
          transactions.map((transaction, i) => (
            <TransactionCard transaction={transaction} key={i} />
          ))}
        {!transactions ||
          (transactions.length === 0 && (
            <h1 className="text-center text-lg my-5">No Transaction Found!</h1>
          ))}
      </div>
    </div>
  );
};

export default WalletPage;
