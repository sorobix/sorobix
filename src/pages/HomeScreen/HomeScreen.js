import React, { useState } from "react";
import "./HomeScreen.scss";
import CodeMirror from "@uiw/react-codemirror";
import { rust } from "@codemirror/lang-rust";
import Sorobix from "../../assets/Sorobix_Logo.svg";
import TextField from "@mui/material/TextField";
import plus_icon from "../../assets/plus_icon.svg";
import Api from "../../utils/api";
import { useSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";

export default function HomeScreen() {
  const [properties, setProperties] = useState([""]);
  const [compileSuccess, setCompileSuccess] = useState(false);
  const [invokeSuccess, setInvokeSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const api = new Api();
  const { enqueueSnackbar } = useSnackbar();
  const showErrorSnack = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      preventDuplicate: true,
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };
  const showSuccessSnack = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      preventDuplicate: true,
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };
  const [code, setCode] = useState(`#![no_std]
use soroban_sdk::{contractimpl, symbol, vec, Env, Symbol, Vec};

pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol!("Hello"), to]
    }
}`);
  const [output, setOutput] = useState("");
  const [results, setResults] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [functionName, setFunctionName] = useState("");
  const onChange = React.useCallback((value, viewUpdate) => {
    setCode(value);
  }, []);
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      "& > fieldset": {
        border: "1px solid gray",
      },
      //   "&:hover": { border: "1px solid white" },
    },
    "& .MuiInputLabel-root": {
      color: "gray",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "gray",
    },
    input: { color: "gray" },
  };
  const tryCompile = async () => {
    setShowLoading(true);
    setCompileSuccess(false);
    setOutput("");
    const data = { lib_file: code, secret_key: "" };
    const res = await api.compileContract(data);
    console.log(res);
    setShowLoading(false);

    if (res.success) {
      setCompileSuccess(true);
      showSuccessSnack("Compilation Successful");
    }
    setOutput(res?.message);
  };
  const tryDeploy = async () => {
    setShowLoading(true);

    setCompileSuccess(false);
    setOutput("");
    const data = { lib_file: code, secret_key: "" };
    const res = await api.deployContract(data);
    console.log(res.message);
    setShowLoading(false);

    if (res.success) {
      setCompileSuccess(true);
      showSuccessSnack(res?.contract_id);
      setOutput(`contract_id: ${res?.contract_id}message: ${res?.message}`);
    } else {
      setOutput(res?.message);
    }
  };
  const tryInvoke = async () => {
    setShowLoading(true);

    setInvokeSuccess(false);
    setResults("");
    const data = {
      contract_id: contractAddress,
      contract_function: functionName,
      secret_key: "SBV4KMJPVSEFVTNQX4TTIRCBQMBG5GH3ZVXBIIZUT46GOKUBWNUGY56M",
      contract_arguments: properties,
    };
    const res = await api.invokeContract(data);
    console.log(res?.results);
    setShowLoading(false);

    if (res.success) {
      setInvokeSuccess(true);
      showSuccessSnack("Success");
      setResults(`message: ${res?.results}`);
    }
  };
  return (
    <article
      style={{ filter: showLoading ? "blur(10px)" : "none" }}
      className="homescreen"
    >
      <Loader showLoading={showLoading} />
      <section className="homescreen_header">
        <div className="homescreen_header_logo">
          <img
            className="homescreen_header_logo_image"
            src={Sorobix}
            alt="sorobix"
          />
        </div>
      </section>
      <section className="homescreen_maincontainer">
        <div className="homescreen_maincontainer_left">
          <div className="homescreen_maincontainer_left_inputcontainer">
            <div className="homescreen_maincontainer_left_inputcontainer_title">
              Input
            </div>

            <CodeMirror
              value={code}
              height="350px"
              theme="dark"
              className="homescreen_maincontainer_left_inputcontainer_text"
              extensions={[rust()]}
              onChange={onChange}
            />
          </div>
          <div className="homescreen_maincontainer_left_outputcontainer">
            {" "}
            <div className="homescreen_maincontainer_left_outputcontainer_title">
              Output
            </div>
            <div
              style={{ color: compileSuccess ? "green" : "red" }}
              className="homescreen_maincontainer_left_outputcontainer_text"
            >
              {output}
            </div>
          </div>
          <div className="homescreen_maincontainer_left_buttoncontainer">
            <div
              onClick={tryCompile}
              className="homescreen_maincontainer_left_buttoncontainer_compile"
            >
              Compile
            </div>
            <div
              onClick={tryDeploy}
              className="homescreen_maincontainer_left_buttoncontainer_deploy"
            >
              Deploy
            </div>
          </div>
        </div>
        <div className="homescreen_maincontainer_right">
          <div className="homescreen_maincontainer_right_title">
            Test Deployed Contracts
          </div>
          <div className="homescreen_maincontainer_right_contractaddresscontainer">
            <input
              className="homescreen_maincontainer_right_contractaddresscontainer_input"
              placeholder="Enter Contract Address"
              value={contractAddress}
              onChange={(e) => {
                setContractAddress(e.target.value);
              }}
            />
            {/* <div className="homescreen_maincontainer_right_contractaddresscontainer_button">{`GO >`}</div> */}
          </div>
          <div className="homescreen_maincontainer_right_functioncontainer">
            <div className="homescreen_maincontainer_right_functioncontainer_title">
              Function
            </div>

            <input
              placeholder="Enter Function Name"
              className="homescreen_maincontainer_right_functioncontainer_input"
              value={functionName}
              onChange={(e) => {
                setFunctionName(e.target.value);
              }}
            />
            <div className="homescreen_maincontainer_right_functioncontainer_property">
              <div className="">Properties</div>
              <div
                onClick={() => {
                  setProperties([...properties, ""]);
                }}
                className="ml-4"
              >
                <img src={plus_icon} alt="plus" />
              </div>
            </div>
            {properties.map((value, index) => {
              return (
                <TextField
                  id="outlined-basic"
                  className="createventscreen_maincontainer_inputcontainer_inputfield"
                  value={properties[index]}
                  onChange={(e) =>
                    setProperties(
                      properties.map((el, i) =>
                        i === index ? e.target.value : el
                      )
                    )
                  }
                  sx={inputStyle}
                  label={`Enter Property ${index + 1}`}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
              );
            })}
            <div className="homescreen_maincontainer_right_functioncontainer_buttoncontainer">
              <div
                onClick={tryInvoke}
                style={{
                  opacity:
                    functionName !== "" && contractAddress !== ""
                      ? "100%"
                      : "50%",
                  pointerEvents:
                    functionName !== "" && contractAddress !== ""
                      ? "auto"
                      : "none",
                }}
                className="homescreen_maincontainer_right_functioncontainer_buttoncontainer_text"
              >{`TEST>`}</div>
            </div>
            <div className="homescreen_maincontainer_right_functioncontainer_output">
              <div className="homescreen_maincontainer_right_functioncontainer_output_title">
                Results
              </div>
              <div
                style={{ color: invokeSuccess ? "green" : "red" }}
                className="homescreen_maincontainer_right_functioncontainer_output_text"
              >
                {results}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
