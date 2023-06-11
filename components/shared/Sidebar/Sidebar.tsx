import React from "react";
import Conmbobox from "../../common/combobox/Combobox";
// import Modal from "../common/Dialog";

const Sidebar = () => {
  return (
    <aside className="w-[18%] min-h-full border-r-border-primary border-r py-3">
      <Conmbobox />
      <Routes />
    </aside>
  );
};

export default Sidebar;

//

const Routes = () => {
  const routes = [{ title: "Wallet", links: "" }];
  return (
    <div className="w-full pb-6 px-6 pt-5">
      <div className="w-full h-10 rounded-xl shadow-shadow-form-input"></div>
    </div>
  );
};
