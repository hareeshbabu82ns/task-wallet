import React, { useEffect } from "react";
import Link from "next/link";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import useInput from "@/hooks/useInput";
import FormInput from "@/components/common/form/FormInput";
import { signUp, useAuthStore } from "@/utils/zustand/authStore/useAuthStore";
import * as validators from "@/utils/formValidators";
import { useRouter } from "next/router";
import { useRealmStore } from "@/utils/zustand/realm/useRealmStore";

const SignUp = () => {
  const emailInput = useInput<string>(validators.emailValidator, "");
  const passwordInput = useInput<string>(validators.passwordValidator, "");
  const nameInput = useInput<string>(validators.passwordValidator, "");

  const router = useRouter();
  const authStore = useAuthStore((s) => s);
  const { loggedIn, user } = authStore;

  const { currentRealm } = useRealmStore((s) => s);

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (
      emailInput.error ||
      passwordInput.error ||
      nameInput.error ||
      !nameInput.value ||
      !emailInput.value ||
      !passwordInput.value
    ) {
      emailInput.onBlur();
      passwordInput.onBlur();
      nameInput.onBlur();
      return;
    }

    signUp(nameInput.value, emailInput.value, passwordInput.value, authStore);
  };

  useEffect(() => {
    if (authStore.loggedIn && currentRealm) {
      router.push(`/${currentRealm.name}/dashboard`);
    }
  }, [loggedIn, currentRealm]);

  useEffect(() => {
    if (loggedIn) {
      router.push("/");
    }
  }, [loggedIn]);

  return (
    <div className="flex items-cente h-full">
      <div className="mx-auto w-fit min-w-[40vh] h-fit my-auto rounded-xl bg-bg-primary px-8 py-12 shadow-shadow-primary-sm">
        <h2 className="mx-auto mb-10 bg-gradient-to-b from-primary to-secondary bg-clip-text text-center text-3xl font-medium text-transparent">
          Sign-Up
        </h2>
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormInput
            {...nameInput}
            type="text"
            lable="Name"
            errorMessage="Password must contain 3 characters."
            labelColor="easd"
          />
          <FormInput
            {...emailInput}
            type="email"
            lable="Email"
            errorMessage="Please provide a valid email."
            labelColor="easd"
          />
          <FormInput
            {...passwordInput}
            type="password"
            lable="Password"
            errorMessage="Password must contain 8 characters."
            labelColor="easd"
          />

          <ButtonPrimary text="Submit" className="w-fit" />
          <p className="ml-auto mt-2 text-center text-sm">
            Already a member?{" "}
            <Link href={"/login"} className="text-primary">
              Sign-in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
