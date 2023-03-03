import React, { useState } from "react";
import "./DropDown.scss";
import Acc1 from "../../../assets/account1pfp.svg";

function DropDown({accountID, setAccountID}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div
        className={`dropdown-button relative ${open ? "" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <div className="dropdown-inner">
          <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_accountscontainer_image">
            <img src={Acc1} alt="account" />
          </div>
          <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_accountscontainer_separator"></div>
          <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_accountscontainer_accountname">
            {accountID===0?"Account 1":accountID===1?"Account 2":"Account 3"}
          </div>
        </div>
        {/* <span className="mr-4">
          {accountID === "inProgress" ? "In Progress" : accountID}
        </span> */}

        <svg
          className="w-2 h-2 text-white dark:text-white absolute dropdown-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#D99BFF"
          style={{paddingRight:"16px"}}
          height={"24px"}
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      {open && (
        <div className="dropdown-modal">
          <p
            className="option"
            onClick={() => {
              setAccountID(0);
              setOpen(false);
            }}
          >
            Account 1
          </p>
          <p
            className="option"
            onClick={() => {
              setAccountID(1);
              setOpen(false);
            }}
          >
            Account 2
          </p>
          <p
            className="option"
            onClick={() => {
              setAccountID(2);
              setOpen(false);
            }}
          >
            Account 3
          </p>
        </div>
      )}
    </div>
  );
}

export default DropDown;
