import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { LZMA_WORKER } from "lzma/src/lzma_worker.js";
import { toByteArray, fromByteArray } from "base64-js";
import "./App.scss";

import TextBox from "./components/textbox"

const DELIMITER = "!@#$%^&*()";
const HASHED_DELIMITER = "XQAAAAIKAAAAAAAAAAAQkABiQLFNXahyuyIk7f//uSAAAA==";
const TEMPLATE = "XQAAAAI+AgAAAAAAAAAkGkAHQ3z02RwUSwoZnrEUJg0Z0Iy73ycWbTqb+TsPe7Qn/cedbhHRYxBkZKTZlcaOTcEcC2A0O/wBnTw1y/WX75WkzcZgZhKiXFEekInLXeLagifUS6LpMvp5ABLCW2Kn4Bc6EyCsblKeWj+BsNkcw3yJ95X2w8d9hjpXgRtWlpcwbKk65YKFBhqsMFpD6hvD4xgRDFM/AsfQ2Rra7V3vlE9kJMlTVaoTBh4PBs66hkNkRJmTxSPSnX8CovCH5n/QkO/5tZlxjO6GwIygMJIprg1yRrw2/o+2k2mIANvUcwHlah0hKa0iOnlkH/140ux5JcXLwQkLZggCSCKRvCtBULhTycNDDVmEGKLA4gRU2WY3FwSv4TnhzdBZwVKushFiMgTK5cYlCaSzd8ZqdVF2Xfqbvv899t0AqcFCg2KCRLQaxI+b1JzVahXiBbOaPs7QTxei3Cr2xG6B4kP3kVk/9WvUmAQjBSdqw9dfUQ2RVuU2Wtd3gcqGZLNvC19jS0yD3VrWHQjulIhczIhpIGii7jN700gpnhxVdgQBlk3RXsjpWi3opC5l4Z0T8pbUHtJubwPCvZuy53OK8gJ+lOP+42rn";

function App() {
  let urlParsed = true;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const parseUrl = (url: string | null) => {
    if(url && url.length !== 0){
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
    let hash = window.location.pathname.substring(1);
    if(hash === ""){
      hash = TEMPLATE;
    }
    let merged = parseUrl(hash);
    if(merged === DELIMITER){
      const urlParams = new URLSearchParams(window.location.search);
      merged = parseUrl(urlParams.get("q"));
    }
    let [t, ...c] = merged.split(DELIMITER);
    if (t === "" && c === ""){
      
    }
    setContent(c.join(DELIMITER));
    setTitle(t);
  }, []);
  
  useEffect(
  () => {
    const hash = getHash(title, content);
    window.history.pushState(null, "", "/" + hash);
  }, [title, content]);
  
  let pagetitle = "Scrambled";
  if(title !== ""){
    pagetitle = `${title} - Scrambled`
  }
  
  return (
    <div className="Scrambled">
        <Helmet>
            <title>{pagetitle}</title>
        </Helmet>
        <TextBox title={title} setTitle={setTitle} content={content} setContent={setContent}/>
    </div>
  );
}

export default App;
