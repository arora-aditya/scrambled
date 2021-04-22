import React, {useState, useEffect} from "react";
import { LZMA_WORKER } from "lzma/src/lzma_worker.js";
import { toByteArray, fromByteArray } from "base64-js";
import "./App.scss";

import TextBox from "./components/textbox"

const DELIMITER = "!@#$%^&*()";

function App() {
  let urlParsed = true;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const parseUrl = (url: string) => {
    if(url.length !== 0){
      const byteArray = toByteArray(url);
      return LZMA_WORKER.decompress(byteArray);
    }
    return DELIMITER;
  }
  
  const getHash = (title: string, content: string) => {
    const result = LZMA_WORKER.compress(title + DELIMITER + content, 9);
    const base64 = fromByteArray(Uint8Array.from(result));
    return base64;
  }
  
  useEffect(
  () => {
    urlParsed = false;
    const merged = parseUrl(window.location.pathname.substring(1));
    let [t, ...c] = merged.split(DELIMITER);
    setContent(c.join(DELIMITER));
    setTitle(t);
  }, []);
  
  useEffect(
  () => {
    const hash = getHash(title, content);
    window.history.pushState(null, "", "/" + hash);
  }, [title, content]);
  
  return (
    <div className="Xena">
       <TextBox title={title} setTitle={setTitle} content={content} setContent={setContent}/>
    </div>
  );
}

export default App;
