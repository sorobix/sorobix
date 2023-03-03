import React, { useState } from "react";
import "./IDEScreen.scss";
import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import Acc1 from "../../assets/account1pfp.svg";
import TextField from "@mui/material/TextField";
import plus from "../../assets/plus.svg";
import Api from "../../utils/api";
import { useSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";
import DropDown from "./DropDown/DropDown";

export default function IDEScreen() {
  const [sortBy, setSortBy] = useState("Account 1");
  const [functionKeys, setFunctionKeys] = useState(["","","",""]);
    const [functionValues, setFunctionValues] = useState(["","","","",""]);
  const [funcState, setFuncState] = useState("about");
  const [contractAddress, setContractAddress] = useState("");
  const [functionName, setFunctionName] = useState("");
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
      <section className="IDEScreen_maincontainer">
        <div className="IDEScreen_maincontainer_sidebar">
          <div className="IDEScreen_header">
            <div className="IDEScreen_header_logo">SOROBIX IDE</div>
          </div>
          <div className="IDEScreen_maincontainer_sidebar_outercontainer">
            <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer">
              <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_bar">
                <div
                  onClick={() => {
                    setFuncState("about");
                  }}
                  className={`IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_bar_left ${
                    funcState === "about" ? "activeBG" : ""
                  }`}
                >
                  About
                </div>
                <div
                  onClick={() => {
                    setFuncState("function");
                  }}
                  className={`IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_bar_right ${
                    funcState === "function" ? "activeBG" : ""
                  }`}
                >
                  Functions
                </div>
              </div>
              {funcState === "about" && (
                <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_aboutcontainer">
                  Sorobix is your beginner friendly playground to try out
                  Soroban contracts on the fly.
                </div>
              )}
              {funcState === "function" && (
                <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer">
                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox">
                    <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_title">
                      Deployed Contract Address
                    </div>
                    <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_value">
                      <input
                        className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_value_input"
                        placeholder="Enter Contract Address"
                        value={contractAddress}
                        onChange={(e) => {
                          setContractAddress(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox">
                    <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_title">
                      Function Name
                    </div>
                    <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_value">
                      <input
                        className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_value_input"
                        placeholder="Enter Function Name"
                        value={functionName}
                        onChange={(e) => {
                          setFunctionName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox">
                    <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_title">
                      <div>Function Parameters</div>
                      <div
                      className="pointer"
                        onClick={() => {
                          setFunctionKeys([...functionKeys, ""]);
                          setFunctionValues([...functionValues,""]);
                        }}
                      >
                        <img className="pointer" src={plus} alt="plus icon"/>
                      </div>
                    </div>
                    <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table">
                      <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table_row">
                        <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table_row_l">
                          Key
                        </div>
                        <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table_row_r">
                          Value
                        </div>
                      </div>
                      <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table_height">
                        {functionKeys.map((value, index) => {
                          return (
                            <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table_row">
                              <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table_row_l">
                                <input
                                  value={functionKeys[index]}
                                  placeholder={`Enter Key ${index + 1}`}
                                  onChange={(e) =>
                                    setFunctionKeys(
                                      functionKeys.map((el, i) =>
                                        i === index ? e.target.value : el
                                      )
                                    )
                                  }
                                  className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table_row_l_input"
                                />
                              </div>
                              <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table_row_r">
                                <input
                                  value={functionValues[index]}
                                  placeholder={`Enter Value ${index + 1}`}
                                  onChange={(e) =>
                                    setFunctionValues(
                                      functionValues.map((el, i) =>
                                        i === index ? e.target.value : el
                                      )
                                    )
                                  }
                                  className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_inputbox_table_row_r_input"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_invokebutton">
                    Invoke Contract
                  </div>
                  {/* <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer"></div> */}
                </div>
              )}
            </div>
            <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer">
              <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_bar">
                Execution Center
              </div>
              <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer">
                {/* <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_accountscontainer">
                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_accountscontainer_image">
                    <img src={Acc1} alt="account" />
                  </div>
                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_accountscontainer_separator"></div>
                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_accountscontainer_accountname">
                    Account 1
                  </div>
                </div> */}
                <div className="w-full">
                  <DropDown sortBy={sortBy} setSortBy={setSortBy} />
                </div>
                <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_generatecontainer">
                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_generatecontainer_generatebutton">
                    Generate G/S Keys
                  </div>
                </div>
                <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_keycontainer">
                  <div
                    id="gkey"
                    className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_keycontainer_title"
                  >
                    G Key
                  </div>
                  <div
                    id="gvalue"
                    className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_keycontainer_value"
                  >
                    GDHMW6QZOL73SHKG2JA3YHXFDS5ZRW....
                  </div>
                  <div
                    id="skey"
                    className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_keycontainer_title"
                  >
                    S Key
                  </div>
                  <div
                    id="svalue"
                    className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_keycontainer_value"
                  >
                    GDHMW6QZOL73SHKG2JA3YHXFDSS5ZRW....
                  </div>
                </div>
                <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_buttonscontainer">
                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_buttonscontainer_compile">
                    Compile Contract
                  </div>
                  <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_buttonscontainer_deploy">
                    Deploy Contract
                  </div>
                </div>
              </div>
            </div>
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
            <div className="IDEScreen_maincontainer_innercontainer_outputcontainer_titlecontainer">
              Output
            </div>
            <div className="IDEScreen_maincontainer_innercontainer_outputcontainer_textcontainer">{`>`}</div>
          </div>
        </div>
      </section>
    </article>
  );
}
