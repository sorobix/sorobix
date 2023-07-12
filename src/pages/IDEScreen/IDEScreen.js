import React, { useEffect, useRef, useState } from "react";
import "./IDEScreen.scss";
import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import Acc1 from "../../assets/account1pfp.svg";
import plus from "../../assets/plus.svg";
import Api from "../../utils/api";
import { useSnackbar } from "notistack";
import Sorobix from "../../assets/Sorobix_Logo.svg";
import Loader from "../../components/Loader/Loader";
import DropDown from "./DropDown/DropDown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactMarkdown from "react-markdown";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { langs } from "@uiw/codemirror-extensions-langs";

export default function IDEScreen() {
  const [accountID, setAccountID] = useState(0);
  const [functionKeys, setFunctionKeys] = useState(["", "", ""]);
  const [functionValues, setFunctionValues] = useState(["", "", "", ""]);
  const [funcState, setFuncState] = useState("about");
  const [contractAddress, setContractAddress] = useState("");
  const [functionName, setFunctionName] = useState("");
  const defaultCargoToml = `[package]
name = "project_name"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[features]
testutils = ["soroban-sdk/testutils"]

[dependencies]
soroban-sdk = "0.8.4"

[dev_dependencies]
soroban-sdk = { version = "0.8.4", features = ["testutils"] }

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true

[profile.release-with-logs]
inherits = "release"
debug-assertions = true`;
  const about = `# Sorobix IDE

Welcome to Sorobix IDE, where you can write/deploy and invoke contracts on the Stellar Blockchain using Soroban!

## Quickstart

### Import or Generate G/S Keys

Inorder to deploy or invoke contracts, you will need G/S keys, or a wallet. However if you do not have a G/S key, you can generate one automatically!

1. On the bottom left panel, you can add your own G/S keys in the Input Field
2. Incase, you do not have a G/S Key pair, you can generate one using the \`Generate G/S Keys\` button and the Key Pair will be auto-filled!
   
### Compile and Deploy Contract on Stellar Blockchain

1. Code your contract on the right panel (We already have the \`Hello World\` contract ready for you)
2. Click on the \`\`\`Compile\`\`\` Button in the bottom left corner of your screen, this will compile your contract
3. To deploy your contract on the Stellar Blockchain, ensure you have the right G/S KeyPair and click on \`Deploy Contract\` !

### Invoke a Function of a deployed contract

1. Click on the \`Functions\` tab above
2. Input the required fields such as contract address, function name and parameteres
3. Ensure you have the right G/S keys set in the left-bottom panel
4. Click on \`Invoke Contract\` button to invoke the contract on-chain!`;
  const [GSKeys, setGSKeys] = useState([
    { G: "", S: "" },
    { G: "", S: "" },
    { G: "", S: "" },
  ]);
  const [compileSuccess, setCompileSuccess] = useState(false);
  const [invokeSuccess, setInvokeSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [output, setOutput] = useState(``);
  const [compileKey, setCompileKey] = useState("");

  const [socketUrl, setSocketUrl] = useState(
    "wss://backend.sorobix.xyz/ws/format"
  );
  const [formatHistory, setFormatHistory] = useState([]);
  const [compileHistory, setCompileHistory] = useState([]);

  const formatterWS = useWebSocket(socketUrl, {});
  const compilerWS = useWebSocket(
    "wss://backend.sorobix.xyz/handler/ws/compile",
    {}
  );
  const [toml, setToml] = useState(defaultCargoToml);
  const [code, setCode] = useState(`#![no_std]
use soroban_sdk::{contractimpl, vec, Env, Symbol, Vec};
pub struct Contract;
#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, Symbol::short("Hello"), to]
    }
}`);
  const onChange = React.useCallback((value, viewUpdate) => {
    setCode(value);
  }, []);
  const onChangeToml = React.useCallback((value, viewUpdate) => {
    setToml(value);
  }, []);
  const showErrorSnack = (message, id) => {
    toast.update(id, {
      render: message,
      type: "error",
      isLoading: false,
      closeButton: true,
      autoClose: 2500,
      pauseOnFocusLoss: false,
      delay: 50,
    });
  };
  const showSuccessSnack = (message, id) => {
    toast.update(id, {
      render: message,
      type: "success",
      isLoading: false,
      closeButton: true,
      autoClose: 2500,
      pauseOnFocusLoss: false,
      delay: 50,
    });
  };
  const toastId = useRef(null);
  const api = new Api();

  useEffect(() => {
    if (formatterWS.lastMessage !== null) {
      setFormatHistory((prev) => prev.concat(formatterWS.lastMessage));
    }
    if (formatterWS.lastMessage?.data.includes("false")) {
      showErrorSnack("Syntax Error!", toastId.current);
      setShowLoading(false);
    } else {
      const res = formatterWS?.lastMessage?.data
        ? JSON.parse(atob(formatterWS?.lastMessage?.data))
        : "none";
      if (res.Success && res !== "none") {
        showSuccessSnack("Code Formatted!!!", toastId.current);
        const decodedCode = atob(res.Data);
        setCode(decodedCode);
        setShowLoading(false);
      } else if (!res.Success && res !== "none") {
        showErrorSnack("Syntax Error!", toastId.current);
        setShowLoading(false);
      } else {
        showErrorSnack("Something went wrong!", toastId.current);
        setShowLoading(false);
      }
    }
  }, [formatterWS.lastMessage, setFormatHistory]);
  useEffect(() => {
    if (compilerWS.lastMessage !== null) {
      setCompileHistory((prev) => prev.concat(compilerWS.lastMessage));
    }
    if (compilerWS.lastMessage?.data !== "Compiling") {
      const res = compilerWS?.lastMessage?.data
        ? JSON.parse(atob(compilerWS?.lastMessage?.data))
        : "none";
      if (res.Success && res !== "none") {
        setCompileSuccess(true);
        showSuccessSnack("Compilation Successful", toastId.current);
        setOutput(res.Message);
        setCompileKey(res.Id);
      } else if (!res.Success && res !== "none") {
        showErrorSnack("Compilation Failed!", toastId.current);
        const errMessage = res.Message?.split("\\n").join("<br>");
        setOutput(errMessage);
      } else {
        showErrorSnack("Something went wrong!", toastId.current);
      }
    }
  }, [compilerWS.lastMessage, setCompileHistory]);
  useEffect(() => {
    if (localStorage.getItem("GSKeys"))
      setGSKeys(JSON.parse(localStorage.getItem("GSKeys")));
  }, []);
  useEffect(() => {
    localStorage.setItem("GSKeys", JSON.stringify(GSKeys));
  }, [GSKeys]);
  useEffect(() => {}, []);

  // const tryFormat = async () => {
  //   toastId.current = toast.loading("Formatting code...");
  //   setShowLoading(true);
  //   const encodedCode = btoa(code);
  //   formatterWS.sendMessage(encodedCode);
  // };
  const tryFormat = async () => {
    toastId.current = toast.loading("Formatting code...");
    setShowLoading(true);
    const encodedCode = btoa(code);
    const data = {
      data: encodedCode,
    };
    const res = await api.formatCode(data);
    // console.log(res);
    setShowLoading(false);
    if (res.status === 200) {
      showSuccessSnack("Code Formatted!!!", toastId.current);
      const decodedCode = atob(res.data.formatted_code);
      setCode(decodedCode);
    } else {
      if (res?.status === 406) {
        showErrorSnack("Syntax Error!", toastId.current);
      } else showErrorSnack("Something went wrong!", toastId.current);
    }
  };

  const onGenerate = async () => {
    setShowLoading(true);
    toastId.current = toast.loading("Generating G/S Keys...");
    const res = await api.generateKey();
    setShowLoading(false);
    if (res.status) {
      setGSKeys(
        GSKeys.map((el, i) =>
          i === accountID
            ? {
                G: res.data.GenerateAccountResponse.public_key,
                S: res.data.GenerateAccountResponse.private_key,
              }
            : el
        )
      );
      showSuccessSnack("G/S keys generated!", toastId.current);
    } else {
      showErrorSnack("Something went wrong!", toastId.current);
    }
  };
  const tryCompile = async () => {
    toastId.current = toast.loading("Compiling Contract...");
    setShowLoading(true);
    setCompileSuccess(false);
    setOutput("");
    const encodedCode = btoa(code);
    const encodedToml = btoa(toml);
    const data = {
      cargoToml: encodedToml,
      MainRs: encodedCode,
    };
    // const data = {
    //   cargoToml:
    //     "W3BhY2thZ2VdCm5hbWUgPSAic29yb2JpeF90ZW1wIgp2ZXJzaW9uID0gIjAuMS4wIgplZGl0aW9uID0gIjIwMjEiCgpbbGliXQpjcmF0ZS10eXBlID0gWyJjZHlsaWIiXQoKW2ZlYXR1cmVzXQp0ZXN0dXRpbHMgPSBbInNvcm9iYW4tc2RrL3Rlc3R1dGlscyJdCgpbZGVwZW5kZW5jaWVzXQpzb3JvYmFuLXNkayA9ICIwLjguNCIKCltkZXZfZGVwZW5kZW5jaWVzXQpzb3JvYmFuLXNkayA9IHsgdmVyc2lvbiA9ICIwLjguNCIsIGZlYXR1cmVzID0gWyJ0ZXN0dXRpbHMiXSB9CgpbcHJvZmlsZS5yZWxlYXNlXQpvcHQtbGV2ZWwgPSAieiIKb3ZlcmZsb3ctY2hlY2tzID0gdHJ1ZQpkZWJ1ZyA9IDAKc3RyaXAgPSAic3ltYm9scyIKZGVidWctYXNzZXJ0aW9ucyA9IGZhbHNlCnBhbmljID0gImFib3J0Igpjb2RlZ2VuLXVuaXRzID0gMQpsdG8gPSB0cnVlCgpbcHJvZmlsZS5yZWxlYXNlLXdpdGgtbG9nc10KaW5oZXJpdHMgPSAicmVsZWFzZSIKZGVidWctYXNzZXJ0aW9ucyA9IHRydWU=",
    //   MainRs: encodedCode,
    // };
    compilerWS.sendJsonMessage(data);
    setShowLoading(false);
  };
  const tryDeploy = async () => {
    toastId.current = toast.loading("Deploying Contract...");
    setShowLoading(true);
    setOutput("");
    const data = { lib_file: compileKey, secret_key: GSKeys[accountID].S };
    const res = await api.deployContract(data);
    setShowLoading(false);

    if (res.status) {
      setCompileSuccess(true);
      showSuccessSnack("Contract Successfully Deployed!", toastId.current);
      setOutput(
        `contract_id: ${res?.data.DeployContractResponse.contract_hash}`
      );
      // setOutput(
      //   `contract_id: ${res?.data.DeployContractResponse.contract_hash}

      //   message: ${res?.data.DeployContractResponse.compiler_output}`
      // );
    } else {
      setOutput(res?.message);
      showErrorSnack("Contract Deployment Failed!", toastId.current);
    }
  };

  const interleaveArgs = (array1, array2) => {
    const mergedArr = [];
    array1.forEach((val, i) => {
      if (val !== "") mergedArr.push(val);
      if (array2[i] !== "") mergedArr.push(array2[i]);
    });
    return mergedArr;
  };
  const prependDoubleDash = (strings) => {
    return strings.map((str) => (str !== "" ? "--" + str : str));
  };

  const tryInvoke = async () => {
    toastId.current = toast.loading("Invoking Contract...");

    setShowLoading(true);
    setInvokeSuccess(false);
    const data = {
      contract_id: contractAddress,
      contract_function: functionName,
      secret_key: GSKeys[accountID].S,
      contract_arguments: interleaveArgs(
        prependDoubleDash(functionKeys),
        functionValues
      ),
    };
    const res = await api.invokeContract(data);
    setShowLoading(false);

    if (res.status) {
      setInvokeSuccess(true);
      showSuccessSnack("Success", toastId.current);
      setOutput(`message: ${res?.data.InvokeContractResponse.result}`);
    } else {
      setOutput(`message: ${res?.message}`);
      showErrorSnack("Invoke Failed", toastId.current);
    }
  };
  return (
    <article className="IDEScreen">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        draggable
        theme="dark"
      />
      <section className="IDEScreen_maincontainer">
        <div className="IDEScreen_maincontainer_sidebar">
          <div className="IDEScreen_header">
            <div className="IDEScreen_header_logo">
              <img height={"100px"} src={Sorobix} alt="sorobix" />
            </div>
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
                  className={`IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_bar_middle ${
                    funcState === "function" ? "activeBG" : ""
                  }`}
                >
                  Functions
                </div>
                <div
                  onClick={() => {
                    setFuncState("cargo");
                  }}
                  className={`IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_bar_right ${
                    funcState === "cargo" ? "activeBG" : ""
                  }`}
                >
                  Cargo File
                </div>
              </div>
              {funcState === "cargo" && (
                <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_aboutcontainer">
                  <CodeMirror
                    value={toml}
                    theme="dark"
                    className="IDEScreen_maincontainer_innercontainer_codecontainer_codearea"
                    extensions={[langs.toml()]}
                    onChange={onChangeToml}
                  />{" "}
                </div>
              )}
              {funcState === "about" && (
                <div className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_aboutcontainer">
                  <ReactMarkdown escapeHtml={false}>{about}</ReactMarkdown>
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
                          setFunctionValues([...functionValues, ""]);
                        }}
                      >
                        <img className="pointer" src={plus} alt="plus icon" />
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

                  <div
                    style={{
                      opacity:
                        (functionName !== "" && contractAddress !== "") ||
                        !showLoading
                          ? "100%"
                          : "50%",
                      pointerEvents:
                        (functionName !== "" && contractAddress !== "") ||
                        !showLoading
                          ? "auto"
                          : "none",
                    }}
                    onClick={tryInvoke}
                    className="IDEScreen_maincontainer_sidebar_outercontainer_topcontainer_functioncontainer_invokebutton"
                  >
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
                <div className="w-full">
                  <DropDown accountID={accountID} setAccountID={setAccountID} />
                </div>
                <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_generatecontainer">
                  <div
                    onClick={onGenerate}
                    style={{
                      opacity: !showLoading ? "100%" : "50%",
                      pointerEvents: !showLoading ? "auto" : "none",
                    }}
                    className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_generatecontainer_generatebutton"
                  >
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
                    <input
                      className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_keycontainer_value_input"
                      value={GSKeys[accountID].G}
                      onChange={(e) => {
                        setGSKeys(
                          GSKeys.map((el, i) =>
                            i === accountID
                              ? {
                                  G: e.target.value,
                                  S: el.S,
                                }
                              : el
                          )
                        );
                      }}
                    />
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
                    <input
                      className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_keycontainer_value_input"
                      value={GSKeys[accountID].S}
                      onChange={(e) => {
                        setGSKeys(
                          GSKeys.map((el, i) =>
                            i === accountID
                              ? {
                                  G: el.G,
                                  S: e.target.value,
                                }
                              : el
                          )
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_buttonscontainer">
                  <div
                    onClick={tryCompile}
                    style={{
                      opacity: !showLoading ? "100%" : "50%",
                      pointerEvents: !showLoading ? "auto" : "none",
                    }}
                    className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_buttonscontainer_compile"
                  >
                    Compile Contract
                  </div>
                  <div
                    onClick={tryDeploy}
                    style={{
                      opacity:
                        !showLoading && GSKeys[accountID].S && compileSuccess
                          ? "100%"
                          : "50%",
                      pointerEvents:
                        !showLoading && GSKeys[accountID].S && compileSuccess
                          ? "auto"
                          : "none",
                    }}
                    className="IDEScreen_maincontainer_sidebar_outercontainer_bottomcontainer_executecontainer_buttonscontainer_deploy"
                  >
                    Deploy Contract
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="IDEScreen_maincontainer_innercontainer">
          <div className="IDEScreen_maincontainer_innercontainer_codecontainer">
            <div
              onClick={tryFormat}
              style={{
                opacity: !showLoading ? "100%" : "50%",
                pointerEvents: !showLoading ? "auto" : "none",
              }}
              className="IDEScreen_maincontainer_innercontainer_codecontainer_formatbutton"
            >
              Format Code
            </div>
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
            <div className="IDEScreen_maincontainer_innercontainer_outputcontainer_textcontainer">
              <div dangerouslySetInnerHTML={{ __html: output }}></div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
