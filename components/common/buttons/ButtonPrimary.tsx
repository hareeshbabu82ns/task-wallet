import React, { HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";

const ButtonPrimary: React.FC<{
  text: string;
  isLoading?: boolean;
  className?: HTMLAttributes<HTMLButtonElement>["className"];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = (props) => {
  return (
    <motion.button
      className={`w-fir relative ml-auto rounded-lg px-8 py-1 text-lg font-medium text-grey-medium bg-gradient-to-br from-secondary to-primary ${props.className}`}
      type="submit"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={props.onClick}
      disabled={props.isLoading}
    >
      <span className={`${props.isLoading ? "opacity-0" : "opacity-100"}`}>
        {props.text}
      </span>
      {props.isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ThreeDots
            height="10"
            width="50"
            radius="12"
            color="#fff"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      )}
    </motion.button>
  );
};

export default ButtonPrimary;
