import React from 'react';
import "./HomeScreen.scss";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import Sorobix from "../../assets/Sorobix_Logo.svg";

export default function HomeScreen() {
      const onChange = React.useCallback((value, viewUpdate) => {
        console.log("value:", value);
      }, []);
  return (
    <article className="homescreen">
      <section className="homescreen_header">
        <div className="homescreen_header_logo">
          <img className="homescreen_header_logo_image" src={Sorobix} alt="sorobix" />
        </div>
      </section>
      <CodeMirror
        value="console.log('hello world!');"
        height="200px"
        theme="dark"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
    </article>
  );
}
