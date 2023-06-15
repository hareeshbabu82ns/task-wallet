import { Dialog, Transition } from "@headlessui/react";
import React, {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ButtonPrimary from "../buttons/ButtonPrimary";

const Alert: React.FC<{
  text: string;
  onConfirm: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ onConfirm, open, setOpen, text }) => {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 w-full"
          onClose={() => setOpen(false)}
          onClick={(e) => e.stopPropagation()}
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

          <div className="fixed z-50 inset-0 w-[min(40vh,40vw)] overflow-visible h-fit rounded-2xl bg-bg-primary top-1/2 py-6  left-1/2 -translate-x-1/2 shadow-lg -translate-y-1/2">
            <div className="flex min-h-full items-center justify-center text-center w-full">
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
                    className="mx-auto mb-8 text-lg font-medium text-center"
                  >
                    {text}
                  </Dialog.Title>
                  <div className="w-full justify-end flex gap-2">
                    <ButtonPrimary
                      text="Cancle"
                      onClick={() => setOpen(false)}
                      className="text-sm !ml-0 !px-3 !py-1"
                    />
                    <ButtonPrimary
                      onClick={onConfirm}
                      text="Confirm"
                      className="text-sm !ml-0 !px-3 !py-1"
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Alert;
