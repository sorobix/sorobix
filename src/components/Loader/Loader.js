import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import nftix_logo from "../../assets/Sorobix_Logo.svg";
import Box from "@mui/material/Box";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
};
export default function Loader({ showLoading }) {
  return (
    <Modal
      open={showLoading}
      aria-labelledby="loader"
      aria-describedby="loading"
      className="flex justify-center items-center modal outline-none"
      style={{ outline: 0 }}
    >
      <Box sx={style} style={{ outline: 0 }}>
        <img
          alt="logo"
          src={nftix_logo}
          style={{ outline: 0 }}
          className="animate-pulse align-middle justify-center m-auto outline-none"
        />
      </Box>
    </Modal>
  );
}
