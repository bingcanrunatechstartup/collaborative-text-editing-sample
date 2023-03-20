```javascript
const doc = new Y.Doc();
const indexeddbProvider = new IndexeddbPersistence('my-doc', doc);
const webrtcProvider = new WebrtcProvider('my-doc', doc);

const editor = new EditorJS({
  holder: 'editor',
  tools: {
    header: Header,
    list: List,
  },
});

const editorBinding = new EditorJSBinding(editor, doc.getArray('editor'));

// ...
```