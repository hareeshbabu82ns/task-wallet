import { Dialog, Transition } from "@headlessui/react";
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ButtonPrimary from "./buttons/ButtonPrimary";
import FormInput from "./form/FormInput";
import useInput from "@/hooks/useInput";
import * as validators from "@/utils/formValidators";
import {
  createRealm,
  getRealms,
  useRealmStore,
} from "@/utils/zustand/realm/useRealmStore";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";

const Modal: React.FC<{
  children: React.ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  let [isOpen, setIsOpen] = useState(props.open);

  const { user } = useAuthStore((s) => s);

  const realmStore = useRealmStore((s) => s);

  const nameInput = useInput<string>(validators.charactersValidator(3, 20), "");
  const descriptionInput = useInput<string>(
    validators.charactersValidator(5, 200),
    ""
  );

  function closeModal() {
    props.setOpen(false);
  }

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (nameInput.error || descriptionInput.error) {
      nameInput.onBlur();
      descriptionInput.onBlur();
      return;
    }

    if (user?.$id)
      createRealm(
        nameInput.value,
        descriptionInput.value,
        user?.$id,
        realmStore
      );

    // signUp(nameInput.value, emailInput.value, passwordInput.value, authStore);
  };

  return (
    <>
      <Transition appear show={props.open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-[1.5px]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto  w-[max(50vh,50vw)] left-1/2 -translate-x-1/2">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full text-text-primary max-w-md transform overflow-hidden rounded-2xl bg-bg-primary px-6 py-10 text-left align-middle shadow-lg transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mx-auto mb-8 bg-gradient-to-b from-primary to-secondary bg-clip-text text-center text-2xl text-transparent font-medium"
                  >
                    Create Realm
                  </Dialog.Title>
                  <form
                    noValidate
                    onSubmit={onSubmit}
                    className="flex flex-col gap-4"
                  >
                    <FormInput
                      {...nameInput}
                      type="text"
                      lable="Name"
                      errorMessage="min/max = 3/20"
                      labelColor="easd"
                    />
                    <FormInput
                      {...descriptionInput}
                      type="text"
                      lable="Description"
                      errorMessage="min/max = 5/200"
                      labelColor="easd"
                    />

                    <ButtonPrimary text="Submit" className="w-fit" />
                  </form>

                  {/* <div className="mt-4">
                    <ButtonPrimary
                      text="Got it, thanks!"
                      onClick={closeModal}
                      className="focus:outline-none text-text-primary text-sm px-4"
                    ></ButtonPrimary>
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
