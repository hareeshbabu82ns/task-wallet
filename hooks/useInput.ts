import { type } from "os";
import React, { useState } from "react";

interface ReturnObject<T> {
  value: T;
  isTouched: boolean;
  onBlur: () => void;
  onFocus: () => void;
  onChange: (val: T) => void;
  resetInput: () => void;
  hasError: boolean;
  error: boolean;
  isFocused: boolean;
  showError: boolean;
  showErrorHandler: () => void;
}

const useInput = <T>(
  validationFunction: (value: T) => boolean,
  initialValue: T
): ReturnObject<T> => {
  const [value, setValue] = useState<T>(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  let valueIsValid = typeof value === "string" && validationFunction(value);
  const error = typeof value === "string" && !valueIsValid;
  const [showError, setShowError] = useState(false);
  const hasError = showError && error;

  const onChange = (val: T) => {
    setValue(val);
  };

  const onBlur = () => {
    setIsTouched(true);
    setShowError(true);
  };

  const onFocus = () => {
    setIsFocused(true);
  };

  const showErrorHandler = () => {
    setShowError(true);
  };

  const resetInput = () => {
    setValue(initialValue);
    setShowError(false);
  };

  return {
    value,
    isTouched,
    onBlur,
    onFocus,
    onChange,
    resetInput,
    hasError,
    error,
    isFocused,
    showError,
    showErrorHandler,
  };
};

export default useInput;
