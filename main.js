import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import QuillBinding from "y-quill";

const doc = new Y.Doc();
const indexeddbProvider = new IndexeddbPersistence('my-doc', doc);
const webrtcProvider = new WebrtcProvider('my-doc', doc);

const Editor = () => {
  const [text, setText] = useState('');

  const quillBinding = new QuillBinding(quillRef.getEditor(), doc.getText('quill'), webrtcProvider.awareness);

  const handleChange = (value) => {
    setText(value);
  };

  const handleMouseOver = (e) => {
  const userId = e.target.getAttribute('data-userid');
  const userInfo = webrtcProvider.awareness.getStates().get(parseInt(userId));
  if (userInfo) {
    e.target.setAttribute('title', userInfo.name);
  }
  };

  return (
    <div>
      <ReactQuill
        value={text}
        onChange={handleChange}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: true
          }
        }}
      />
      <button onClick={() => this.quillRef.getEditor().history.undo()}>Undo</button>
      <button onClick={() => this.quillRef.getEditor().history.redo()}>Redo</button>
      <ul>
      {[...webrtcProvider.awareness.getStates().keys()].map((userId) => (
        <li key={userId}>
          <img src={`https://api.adorable.io/avatars/285/${userId}.png`} data-userid={userId} onMouseOver={handleMouseOver} alt="User Avatar" />
        </li>
      ))}
      </ul>
    </div>
  );
};

export default Editor;
