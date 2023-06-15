import { Dialog, Transition } from "@headlessui/react";
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useRef,
  useState,
} from "react";
import useInput from "@/hooks/useInput";
import * as validators from "@/utils/formValidators";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import FormInput from "@/components/common/form/FormInput";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import FormInputList from "@/components/common/form/FormInputList";
import {
  createTransaction,
  useWalletStore,
} from "@/utils/zustand/walletStore/useWalletStore";

const typeOption = [{ name: "Credit" }, { name: "Debit" }];

const methodOption = [{ name: "Cash" }, { name: "Online" }];

const NewTransactionModal: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);

  const walletStore = useWalletStore((s) => s);

  const { balance, id: walletId, debit, credit, isLoading } = walletStore;

  const transactionTypeInput = useInput<string>(
    validators.charactersValidator(0, 20),
    typeOption[0].name
  );

  const transactionMethodInput = useInput<string>(
    validators.charactersValidator(0, 20),
    methodOption[0].name
  );

  const amountInput = useInput<string>(
    validators.numberValidator(1, 100000000),
    ""
  );

  const toInput = useInput<string>(validators.charactersValidator(3, 75), "");

  const fromInput = useInput<string>(validators.charactersValidator(3, 75), "");

  const descriptionInput = useInput<string>(
    validators.charactersValidator(0, 250),
    ""
  );

  const formatDate = (date: Date) => {
    const formattedDate = new Date(date);

    const year = formattedDate.getFullYear();
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = formattedDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  function closeModal() {
    props.setOpen(false);
  }

  const onSuccess = () => {
    props.setOpen(false);
    transactionMethodInput.resetInput();
    transactionTypeInput.resetInput();
    amountInput.resetInput();
    fromInput.resetInput();
    toInput.resetInput();
    descriptionInput.resetInput();
    setSelectedDate(formatDate(new Date()));
  };

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (
      balance === null ||
      !currentRealm ||
      !user ||
      !walletId ||
      debit === null ||
      credit === null
    )
      return;

    if (
      transactionTypeInput.error ||
      amountInput.error ||
      descriptionInput.error ||
      transactionMethodInput.error ||
      (transactionTypeInput.value === "Credit" && fromInput.error) ||
      (transactionTypeInput.value !== "Credit" && toInput.error)
    ) {
      transactionTypeInput.onBlur();
      descriptionInput.onBlur();
      amountInput.onBlur();
      transactionMethodInput.onBlur();
      transactionTypeInput.value === "Credit" && fromInput.onBlur();
      transactionTypeInput.value !== "Credit" && toInput.onBlur();
      return;
    }

    createTransaction({
      transactionType: transactionTypeInput.value,
      amount: Number(amountInput.value),
      date: selectedDate,
      realm: currentRealm?.name,
      userId: user?.$id,
      walletStore,
      method: transactionMethodInput.value,
      onSuccess,
      description: descriptionInput.value,
      from: fromInput.value,
      to: toInput.value,
    });
  };

  return (
    <>
      <Transition appear show={props.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 w-[max(80vh,80vw)]"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed z-50 inset-0 bg-black bg-opacity-25 backdrop-blur-[1.5px] " />
          </Transition.Child>

          <div className="fixed z-50 inset-0 overflow-y-auto w-[min(80vh,80vw)] h-fit rounded-2xl bg-bg-primary top-1/2 py-4  left-1/2 -translate-x-1/2 shadow-lg -translate-y-1/2">
            <div className="flex min-h-full items-center justify-center p-4 text-center w-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="text-text-primary  w-full max-h[80vh]  transform overflow-hidden  px-6 text-left align-middle  transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mx-auto mb-8 bg-gradient-to-b from-primary to-secondary bg-clip-text text-center text-2xl text-transparent font-medium"
                  >
                    New Transaction
                  </Dialog.Title>
                  <form
                    noValidate
                    onSubmit={onSubmit}
                    className="grid gap-10 gap-y-10 grid-cols-2 max-[700px]:grid-cols-1"
                  >
                    <FormInputList
                      lable="Credit/Debit"
                      errorMessage="Select type"
                      multiple={false}
                      {...transactionTypeInput}
                      options={typeOption}
                    />
                    <FormInputList
                      lable="Method"
                      errorMessage="Select type"
                      multiple={false}
                      {...transactionMethodInput}
                      options={methodOption}
                    />
                    <FormInput
                      {...amountInput}
                      type="number"
                      lable="Amount"
                      errorMessage="Must be greater than 0"
                      labelColor="easd"
                      min={1}
                    />
                    {transactionTypeInput.value === "Credit" ? (
                      <FormInput
                        {...fromInput}
                        type="text"
                        lable="From"
                        errorMessage="Length must be between 3 and 75"
                        labelColor="easd"
                      />
                    ) : (
                      <FormInput
                        {...toInput}
                        type="text"
                        lable="To"
                        errorMessage="Length must be between 3 and 75"
                        labelColor="easd"
                      />
                    )}
                    <FormInput
                      {...descriptionInput}
                      type="text"
                      lable="Description"
                      errorMessage="min/max = 5/200"
                      labelColor="easd"
                      highlight={false}
                    />
                    {/* <DatePicker /> */}
                    <div className="z-0 flex flex-col gap-2 w-full">
                      <div className={`flex items-center`}>
                        <label
                          className="text-grey-light"
                          htmlFor={`datepicker`}
                          onClick={() => {
                            inputRef.current?.click();
                          }}
                        >
                          {"Date"}
                        </label>
                      </div>
                      <input
                        type="date"
                        id="datepicker"
                        onChange={handleDateChange}
                        value={selectedDate}
                        onClick={() => {
                          inputRef.current?.click();
                        }}
                        placeholder={new Date().getDay().toLocaleString()}
                        className="input2 fill-red-300 w-full h-fit rounded-lg px-3 py-1.5 shadow-shadow-form-input !bg-transparent autofill:shadow-shadow-form-autofill autofill:!text-red-200 outline-0 outline-offset-2 focus:!outline-blue-700"
                      />
                    </div>

                    <div className="w-full flex col-[1/-1] justify-end">
                      <ButtonPrimary
                        isLoading={isLoading}
                        text="Submit"
                        className="w-fit"
                      />
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default NewTransactionModal;
