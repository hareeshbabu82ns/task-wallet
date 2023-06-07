import React, { HTMLAttributes } from "react";
import { motion } from "framer-motion";

const ButtonPrimary: React.FC<{
  text: string;
  className?: HTMLAttributes<HTMLButtonElement>["className"];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = (props) => {
  return (
    <motion.button
      className={`w-fir ml-auto mt-6 rounded-lg px-8 py-1 text-lg font-medium text-grey-medium bg-gradient-to-br from-secondary to-primary ${props.className}`}
      type="submit"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={props.onClick}
    >
      {props.text}
    </motion.button>
  );
};

export default ButtonPrimary;
