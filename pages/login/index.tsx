import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ButtonPrimary from "@/components/common/buttons/ButtonPrimary";
import useInput from "@/hooks/useInput";
import FormInput from "@/components/common/form/FormInput";
import {
  loginUser,
  useAuthStore,
} from "@/utils/zustand/authStore/useAuthStore";
import * as validators from "@/utils/formValidators";

const SignIn = () => {
  const emailInput = useInput<string>(validators.emailValidator, "");
  const passwordInput = useInput<string>(validators.passwordValidator, "");

  const router = useRouter();

  const authStore = useAuthStore((s) => s);
  const { loggedIn, user } = authStore;

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (emailInput.error || passwordInput.error) {
      emailInput.onBlur();
      passwordInput.onBlur();
      return;
    }
    loginUser(emailInput.value, passwordInput.value, authStore);
  };

  useEffect(() => {
    if (loggedIn) router.push("/");
  }, [loggedIn]);

  return (
    <div className="flex items-center h-full">
      <div className="mx-auto w-fit min-w-[40vh] rounded-xl bg-bg-primary px-8 py-12 shadow-shadow-primary-sm">
        <h2 className="mx-auto mb-10 bg-gradient-to-b from-primary to-secondary bg-clip-text text-center text-3xl font-medium text-transparent">
          Login
        </h2>
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
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
            Not a member?{" "}
            <Link href={"/sign-up"} className="text-primary">
              Sign-up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
