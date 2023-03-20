import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import QuillBinding from "y-quill";

window.addEventListener('online', () => {
  // handle online status
});
window.addEventListener('offline', () => {
  // handle offline status
});

const doc = new Y.Doc();
const indexeddbProvider = new IndexeddbPersistence('my-doc', doc);
const webrtcProvider = new WebrtcProvider('my-doc', doc);

const userName = prompt("Please enter your name");
webrtcProvider.awareness.setLocalStateField('name', userName);

// generate random color for each user
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// update awareness with user's color
webrtcProvider.awareness.setLocalStateField('color', getRandomColor());

// create cursor element for each user
const createCursor = (user) => {
  const cursor = document.createElement('span');
  cursor.classList.add('remote-cursor');
  cursor.style.borderLeftColor = user.color;
  return cursor;
};

// update cursors on awareness change
webrtcProvider.awareness.on('change', () => {
  const states = webrtcProvider.awareness.getStates();
  quillBinding.cursors.clear();
  states.forEach((state, userId) => {
    if (userId !== doc.clientID) {
      const userCursor = createCursor(state);
      quillBinding.cursors.insert(userId.toString(), userCursor);
    }
  });
});

// save snapshot on update
doc.on('update', async () => {
    const currentState = Y.encodeStateAsUpdate(doc);
    await indexeddbProvider.saveSnapshot(currentState);
  });
  
  // get list of snapshots
  const getSnapshots = async () => {
    const snapshots = await indexeddbProvider.getSnapshotList();
    return snapshots;
  };
  
  // restore snapshot
  const restoreSnapshot = async (snapshot) => {
    const state = await indexeddbProvider.getSnapshot(snapshot);
    Y.applyUpdate(doc, state);
  };

  const getSnapshots = async () => {
    const snapshots = await indexeddbProvider.getSnapshotList();
    return snapshots;
  };

  const handleShowSnapshots = async () => {
    const snapshots = await getSnapshots();
    console.log('Snapshots:');
    snapshots.forEach((snapshot) => {
      console.log(`- ${new Date(snapshot.time).toLocaleString()}`);
    });
  };

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
      <h2>Versions</h2>
    <ul>
      {versions.map((version, index) => (
        <li key={index}>
          <a href="#" onClick={() => handleRestoreVersion(index)}>Version {index + 1}</a>
        </li>
      ))}
    </ul>
    <button onClick={handleShowSnapshots}>Show Snapshots</button>
    <button onClick={handleDownloadDocument}>Download Document</button>
    </div>
  );
};

export default Editor;
