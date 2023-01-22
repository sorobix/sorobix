import React from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default function HomeScreen() {
      const onChange = React.useCallback((value, viewUpdate) => {
        console.log("value:", value);
      }, []);
  return (
    <>
      <div>Sorobix IDE</div>
      <CodeMirror
        value="console.log('hello world!');"
        height="200px"
        theme="dark"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
    </>
  );
}
