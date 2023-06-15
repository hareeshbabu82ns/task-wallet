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
import { useWalletStore } from "@/utils/zustand/walletStore/useWalletStore";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  createTask,
  updateTask,
  useTasksStore,
} from "@/utils/zustand/taskStore/useTaskStore";
import {
  ETaskPriorities,
  ETaskStatuses,
  ITask,
} from "@/utils/zustand/taskStore/ITaskStore";

const statusOptions = Object.values(ETaskStatuses).map((val) => {
  return {
    name: val
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-"),
  };
});

const priorityOptions = Object.values(ETaskPriorities).map((val) => {
  return { name: val.charAt(0).toUpperCase() + val.slice(1) };
});

const TaskInfoModal: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  task: ITask;
}> = (props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { task } = props;
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthStore((s) => s);

  const { currentRealm } = useRealmStore((s) => s);

  const walletStore = useWalletStore((s) => s);

  const taskStore = useTasksStore((s) => s);

  const { balance, id: walletId, debit, credit } = walletStore;

  const [selectedImages, setSelectedImages] = useState<File[] | null>(null);

  const [imagesPreviewUrls, setImagesPreviewUrls] = useState<string[] | null>(
    task.images
  );

  const statusInput = useInput<string>(
    validators.charactersValidator(0, 20),
    statusOptions.find((e) => e.name.toLowerCase() === task?.status)?.name || ""
  );

  const priorityInput = useInput<string>(
    validators.charactersValidator(0, 20),
    priorityOptions.find((e) => e.name.toLowerCase() === task?.priority)
      ?.name || ""
  );

  const titleInput = useInput<string>(
    validators.charactersValidator(3, 75),
    task.title
  );

  const descriptionInput = useInput<string>(
    validators.charactersValidator(5, 400),
    task.description
  );

  const [selectedDate, setSelectedDate] = useState<null | string>(
    task.dueDate ? new Date(task.dueDate).toISOString() : null
  );

  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files?.length > 5) {
      toast.warn("Maximum 5 images are allowed.");
      return;
    }
    if (!files) return;
    const selectedFiles = Array.from(files);
    setSelectedImages(selectedFiles);
    if (files && files.length > 0) {
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagesPreviewUrls(previews);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  function closeModal() {
    props.setOpen(false);
  }

  const onSuccess = () => {
    statusInput.resetInput();
    titleInput.resetInput();
    priorityInput.resetInput();
    descriptionInput.resetInput();
    props.setOpen(false);
  };

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!currentRealm || !user) return;

    if (
      statusInput.error ||
      descriptionInput.error ||
      priorityInput.error ||
      titleInput.error
    ) {
      statusInput.onBlur();
      priorityInput.onBlur();
      titleInput.onBlur();
      descriptionInput.onBlur();
      return;
    }

    updateTask({
      taskStore: taskStore,
      task,
      description: descriptionInput.value,
      priority: priorityInput.value.toLowerCase(),
      realm: currentRealm.name,
      status: statusInput.value.toLowerCase() as ETaskStatuses,
      title: titleInput.value,
      userId: user.$id,
      onSuccess,
      images: selectedImages || undefined,
      setIsLoading,
    });
  };

  return (
    <>
      <Transition appear show={props.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 w-full"
          onClick={(e) => e.stopPropagation()}
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

          <div className="fixed z-50 inset-0 w-[min(80vh,80vw)] overflow-visible h-fit rounded-2xl bg-bg-primary top-1/2 py-4  left-1/2 -translate-x-1/2 shadow-lg -translate-y-1/2">
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
                    Update Task
                  </Dialog.Title>
                  <form
                    noValidate
                    onSubmit={onSubmit}
                    className="grid gap-10 gap-y-10 grid-cols-2 flex-col max-[700px]:grid-cols-1"
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
                      errorMessage="Length: min/max = 3/75"
                    />
                    <FormInput
                      {...descriptionInput}
                      type="text"
                      lable="Description"
                      errorMessage="Length: min/max = 5/400"
                      // highlight={false}
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
                          {"Due Date"}
                        </label>
                      </div>
                      <input
                        type="date"
                        id="datepicker"
                        onChange={handleDateChange}
                        value={selectedDate || undefined}
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
                        {"Images"}
                      </label>
                      {!imagesPreviewUrls ? (
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
                        <div className="flex gap-2">
                          {imagesPreviewUrls.map((url, i) => (
                            <label
                              htmlFor={`datepickerTasks`}
                              className="cursor-pointer"
                              key={i}
                            >
                              <Image
                                src={url}
                                alt="Selected Image"
                                className="w-11 h-11 rounded-full object-cover"
                                width={32}
                                height={32}
                              />
                            </label>
                          ))}
                        </div>
                      )}
                      <input
                        type="file"
                        id="datepickerTasks"
                        onClick={() => {
                          inputRef.current?.click();
                        }}
                        onChange={handleImagesChange}
                        multiple
                        placeholder={new Date().getDay().toLocaleString()}
                        accept="image/*"
                        className="w-0 h-0 opacity-0 pointer-events-none"
                      />
                    </div>
                    <div className="w-full flex col-[1/-1] justify-end">
                      <ButtonPrimary
                        isLoading={isLoading}
                        text="Update"
                        className="w-fit mt-2"
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

export default TaskInfoModal;
