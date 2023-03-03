import React, { useState } from "react";
import "./IDEScreen.scss";
import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import Sorobix from "../../assets/Sorobix_Logo.svg";
import TextField from "@mui/material/TextField";
import plus_icon from "../../assets/plus_icon.svg";
import Api from "../../utils/api";
import { useSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";
export default function IDEScreen() {
      const [code, setCode] = useState(`#![no_std]
use soroban_sdk::{contractimpl, symbol, vec, Env, Symbol, Vec};

pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol!("Hello"), to]
    }
}`);
  const onChange = React.useCallback((value, viewUpdate) => {
    setCode(value);
  }, []);
  return (
    <article className="IDEScreen">
      <section className="IDEScreen_header">
        <div className="IDEScreen_header_logo">
          <img
            className="IDEScreen_header_logo_image"
            src={Sorobix}
            alt="sorobix"
          />
        </div>
      </section>
      <section className="IDEScreen_maincontainer">
        <div className="IDEScreen_maincontainer_sidebar">
          <div className="IDEScreen_maincontainer_sidebar_maincontainer">
            <div className="IDEScreen_maincontainer_sidebar_maincontainer_title">Welcome to Sorobix</div>
            <div className="IDEScreen_maincontainer_sidebar_maincontainer_text">Start your Stellar journey here through our basic snippets and easy to access playground.</div>
          </div>
        </div>
        <div className="IDEScreen_maincontainer_innercontainer">
          <div className="IDEScreen_maincontainer_innercontainer_codecontainer">
            <CodeMirror
              value={code}
              theme="dark"
              className="IDEScreen_maincontainer_innercontainer_codecontainer_codearea"
              extensions={[rust()]}
              onChange={onChange}
            />
          </div>
          <div className="IDEScreen_maincontainer_innercontainer_outputcontainer">
            <div className="IDEScreen_maincontainer_innercontainer_outputcontainer_title">
              Output
            </div>
            <div className="IDEScreen_maincontainer_innercontainer_outputcontainer_text">{`>`}</div>
          </div>
        </div>
      </section>
    </article>
  );
}
