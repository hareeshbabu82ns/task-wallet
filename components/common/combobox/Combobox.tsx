import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import Modal from "../NewRealmModal";
import * as IoMdIcons from "react-icons/io";
import { getRealms, useRealmStore } from "@/utils/zustand/realm/useRealmStore";
import { useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import { IRealm } from "@/utils/zustand/realm/IRealmStore";
import { useRouter } from "next/router";

export const ComboboxList: React.FC<{ className?: string }> = ({
  className,
}) => {
  const [selected, setSelected] = useState<IRealm | null>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [newRealmModal, setNewRealmModal] = useState(false);
  const [realmsIsLoading, setRealmsIsLoading] = useState(false);

  const realmStore = useRealmStore((s) => s);

  const { realms, currentRealm } = realmStore;

  const { user } = useAuthStore((s) => s);

  const onChange: (value: {
    id: string;
    name: string;
    userId: string;
    description?: string;
  }) => void = (val) => {
    if (val.name === "openModal") {
      console.log("ASA");
      setNewRealmModal(true);
      return;
    } else {
      setSelected(val);
      realmStore.setCurrentRealm(val);
    }
  };

  useEffect(() => {
    if (realms && realms?.length > 0 && !selected) {
      realmStore.setCurrentRealm(realms[0]);
    }
  }, [realms, selected]);

  useEffect(() => {
    if (currentRealm) {
      setSelected(currentRealm);
    }
  }, [currentRealm]);

  const filteredRealms =
    query === ""
      ? realms
      : realms?.filter((realm) =>
          realm.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  useEffect(() => {
    if (user && !realmsIsLoading) {
      getRealms(user.$id, realmStore, setRealmsIsLoading);
    }
  }, [user?.$id]);

  return (
    <>
      {realms && selected ? (
        <div className={`"w-fit ml-auto`}>
          <Combobox value={selected} onChange={onChange}>
            <div className="relative z-50">
              <div className="relative w-full cursor-default rounded-lg shadow-shadow-form-input text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Input
                  className={` w-full border-none py-2 pl-3 bg-transparent focus:outline-none text-text-primary pr-10 text-sm leading-5 focus:ring-0`}
                  displayValue={(item) => selected.name}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaChevronDown
                    className="h-3 w-3 mt-1 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="absolute z-40 mt-2 max-h-60 w-full overflow-auto rounded-md text-base shadow-sm ring-1 ring-black ring-opacity-5 bg-bg-primary-light focus:outline-none sm:text-sm">
                  {filteredRealms?.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 flex items-center px-4 pl-6 text-text-primary">
                      <p>Nothing found.</p>
                    </div>
                  ) : (
                    filteredRealms?.map((realm, i) => (
                      <Combobox.Option
                        key={realm.id + i}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-gray-700 text-text-primary"
                              : "text-text-primary"
                          }`
                        }
                        value={realm}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {realm.name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-green-600"
                                }`}
                              >
                                <IoMdIcons.IoMdCheckmark
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                  <Combobox.Option
                    value={{ name: "openModal", id: 12 }}
                    className={({ active }) =>
                      `relative cursor-default select-none py-3 border-t border-t-primary pl-10 pr-4 ${
                        active ? "bg-gray-700 text-white" : "text-white"
                      }`
                    }
                  >
                    <>
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 
                        // active ? "text-white" : "text-teal-600"`}
                      >
                        <IoMdIcons.IoMdAddCircleOutline
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {"Create New"}
                      </span>
                    </>
                  </Combobox.Option>
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
      ) : (
        <div className="w-fir ml-auto relative flex items-center px-6">
          <button
            onClick={() => setNewRealmModal(true)}
            className="relative py-2 gap-2 cursor-pointer w-full pl-3 px-3 flex rounded-lg border border-border-primary shadow-shadow-form-input text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-0 focus-visible:ring-offset-teal-300 sm:text-sm"
          >
            <span
              className={`inset-y-0 left-0 flex items-center 
            // active ? "text-white" : "text-teal-600"`}
            >
              <IoMdIcons.IoMdAddCircleOutline
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
            <span
              className={`block truncate ${
                selected ? "font-medium" : "font-normal"
              }`}
            >
              {"Create Realm"}
            </span>
          </button>
        </div>
      )}
      <Modal open={newRealmModal} setOpen={setNewRealmModal}>
        <button>asas</button>
      </Modal>
    </>
  );
};

export default ComboboxList;
