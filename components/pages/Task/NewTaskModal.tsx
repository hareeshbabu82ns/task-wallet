import { Dialog, Transition } from "@headlessui/react";
import React, {
  ChangeEvent,
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
import DateInput from "@/components/common/form/DateInput";
import Image from "next/image";

const statusOptions = [
  { name: "Todo" },
  { name: "In-Progress" },
  { name: "Completed" },
];

const priorityOptions = [
  { name: "Urgent" },
  { name: "High" },
  { name: "Medium" },
  { name: "Low" },
];

const NewTaskModal: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);

  const walletStore = useWalletStore((s) => s);

  const { balance, id: walletId, debit, credit } = walletStore;

  const statusInput = useInput<string>(
    validators.charactersValidator(0, 20),
    statusOptions[0].name
  );

  const priorityInput = useInput<string>(
    validators.charactersValidator(0, 20),
    priorityOptions[0].name
  );

  const titleInput = useInput<string>(
    validators.charactersValidator(3, 75),
    ""
  );

  const descriptionInput = useInput<string>(
    validators.charactersValidator(0, 250),
    ""
  );

  const [image, setImage] = useState<null | File>(null);

  const [imagePreview, setImagePreview] = useState<null | string>(null);

  // const amountInput = useInput<string>(
  //   validators.numberValidator(1, 100000000),
  //   ""
  // );

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

  const handleImageChange = (ev: ChangeEvent<HTMLInputElement>) => {
    console.log(ev.target.files);
    const file = ev.target.files?.length && ev.target.files[0];

    file && setImage(file);

    console.log(file);

    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onload = function () {
      console.log(reader.result);
      setImagePreview(reader.result as string);
    };

    // const fileSizeKB = file.size / 1024;

    // if (fileSizeKB > 250) {
    //   alert("Please select an image file with a size less than 250KB.");
    //   input.value = ""; // Reset the input to clear the selected file
    // }
  };

  function closeModal() {
    props.setOpen(false);
  }

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
      statusInput.error ||
      descriptionInput.error ||
      priorityInput.error ||
      (statusInput.value === "Credit" && titleInput.error) ||
      (statusInput.value !== "Credit" && descriptionInput.error)
    ) {
      statusInput.onBlur();
      descriptionInput.onBlur();
      priorityInput.onBlur();
      statusInput.value === "Credit" && titleInput.onBlur();
      statusInput.value !== "Credit" && descriptionInput.onBlur();
      return;
    }

    // createTransaction({
    //   transactionType: statusInput.value,
    //   date: selectedDate,
    //   realm: currentRealm?.name,
    //   userId: user?.$id,
    //   walletStore,
    //   method: priorityInput.value,
    //   description: descriptionInput.value,
    //   from: titleInput.value,
    //   to: descriptionInput.value,
    //   onSuccess: () => {},
    // });
  };

  return (
    <>
      <Transition appear show={props.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 w-[max(80vh,80vw)]"
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

          <div className="fixed z-50 inset-0 w-[max(50vh,40vw)] overflow-visible h-fit rounded-2xl bg-bg-primary top-1/2 py-4  left-1/2 -translate-x-1/2 shadow-lg -translate-y-1/2">
            <div className="flex min-h-full items-center justify-center p-4 text-center w-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-85"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-85"
              >
                <Dialog.Panel className="text-text-primary  w-full max-h[80vh]  transform overflow-hidden  px-6 text-left align-middle  transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mx-auto mb-8 bg-gradient-to-b from-primary to-secondary bg-clip-text text-center text-2xl text-transparent font-medium"
                  >
                    New Task
                  </Dialog.Title>
                  <form
                    noValidate
                    onSubmit={onSubmit}
                    className="grid gap-10 gap-y-10 grid-cols-2"
                  >
                    <FormInputList
                      lable="Status*"
                      errorMessage="Select type"
                      multiple={false}
                      {...statusInput}
                      options={statusOptions}
                    />
                    <FormInputList
                      lable="Priority*"
                      errorMessage="Select type"
                      multiple={false}
                      {...priorityInput}
                      options={priorityOptions}
                    />
                    <FormInput
                      {...titleInput}
                      type="text"
                      lable="Title*"
                      errorMessage="Length must be between 3 and 75"
                      labelColor="easd"
                    />
                    <FormInput
                      {...descriptionInput}
                      type="text"
                      lable="Description"
                      errorMessage="Length must be between 3 and 75"
                      labelColor="easd"
                      highlight={false}
                    />
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
                    <div className="z-0 flex flex-col gap-2 w-full">
                      <label
                        className="text-grey-light"
                        htmlFor={`datepickerTasks`}
                        onClick={() => {
                          inputRef.current?.click();
                        }}
                      >
                        {"Image"}
                      </label>
                      {!imagePreview ? (
                        <label
                          className="relative h-fit cursor-pointer z-50 flex w-full items-center bg-bg-primary  input2 rounded-lg px-3 py-1.5 shadow-shadow-form-input !bg-transparent autofill:shadow-shadow-form-autofill autofill:!text-red-200 outline-0 outline-offset-2 focus:outline-blue-700"
                          htmlFor={`datepickerTasks`}
                          onClick={() => {
                            inputRef.current?.click();
                          }}
                        >
                          {"Image"}
                        </label>
                      ) : (
                        <Image
                          src={imagePreview}
                          alt="Selected Image"
                          className="w-7 h-7"
                          width={32}
                          height={32}
                        />
                      )}
                      <input
                        type="file"
                        id="datepickerTasks"
                        onClick={() => {
                          inputRef.current?.click();
                        }}
                        onChange={handleImageChange}
                        placeholder={new Date().getDay().toLocaleString()}
                        accept="image/*"
                        className="w-0 h-0 opacity-0 pointer-events-none"
                      />
                    </div>
                    <div className="w-full flex col-[1/-1] justify-end">
                      <ButtonPrimary
                        // isLoading={isLoading}
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

export default NewTaskModal;
