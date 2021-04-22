import React from "react";
import ContentEditable from "react-contenteditable"
import "./index.scss";

interface TextBoxProp {
  title: string;
  setTitle: Function;
  content: string;
  setContent: Function;
}

function TextBox({
  title,
  setTitle,
  content,
  setContent
}: TextBoxProp) {
  
  return (
    <div className="textbox">
        <input className="title" value={title} onChange={e => setTitle(e.target.value)} />
        <ContentEditable
            className="content"
            html={content}
            disabled={false}
            onChange={e => setContent(e.target.value)} 
            tagName="article"
        />
    </div>
  );
}

export default TextBox;
