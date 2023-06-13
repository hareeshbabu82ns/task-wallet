import React, { useState } from "react";
import * as faIcons from "react-icons/fa";

type Props = {
  hasError: boolean;
  onChange: (val: string) => void;
  onBlur: () => void;
  type: React.HTMLInputTypeAttribute;
  lable: string;
  value: string | null;
  errorMessage: string;
  onFocus: () => void;
  error: boolean;
  isTouched: boolean;
  highlight?: boolean;
  labelColor?: string;
  min?: number;
};

const FormInput: React.FC<Props> = (props) => {
  const {
    hasError,
    onChange,
    onBlur,
    type,
    lable,
    value,
    errorMessage,
    onFocus,
    labelColor,
    error,
    min,
    isTouched,
    highlight = true,
  } = props;

  const labelModifier = labelColor ? labelColor : "currentColor";
  const [inititalType, setInitialType] = useState(type);

  const toggleTypeToText = () => {
    setInitialType((prev) => (prev === "text" ? "password" : "text"));
  };

  return (
    <div className="z-0 flex flex-col gap-2 w-full">
      <div className={`flex items-center`}>
        <label
          className="text-grey-light"
          htmlFor={`form-${lable.toLowerCase().split(" ").join("-")}`}
          style={{ color: labelModifier }}
        >
          {lable}
        </label>

        {hasError && (
          <span className="ml-auto text-xs text-red-400">{errorMessage}</span>
        )}
      </div>
      <div className="form-input relative">
        <input
          className={`input2 w-full rounded-lg px-3 py-1.5 shadow-shadow-form-input !bg-transparent autofill:shadow-shadow-form-autofill autofill:!text-red-200 outline-0 outline-offset-2 focus:outline-blue-700 ${
            hasError
              ? "outline !outline-1 outline-red-500"
              : !error && isTouched && highlight
              ? "outline !outline-1 !outline-green-600"
              : ""
          }`}
          onFocus={onFocus}
          type={inititalType}
          id={`form-${lable?.toLowerCase().split(" ").join("-")}`}
          onBlur={onBlur}
          onChange={(e) => onChange(e.currentTarget.value)}
          value={value || ""}
          hidden={false}
          min={min}
          style={{
            WebkitTextFillColor: "#f8f9fa",
          }}
        />
        {type === "password" && (
          <faIcons.FaRegEye
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer ${
              inititalType === "password" ? "" : "form-input-svg--open"
            }`}
            onClick={toggleTypeToText}
          />
        )}
      </div>
    </div>
  );
};

export default FormInput;
