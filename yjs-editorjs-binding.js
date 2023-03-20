import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

class EditorJSBinding extends Y.AbstractBinding {
  constructor(editor, type) {
    super(type);
    this.editor = editor;
    this.type = type;

    // observe local changes
    this.editor.isReady.then(() => {
      this.editor.on('change', () => {
        const blocks = this.editor.blocks.getBlocks();
        const content = blocks.map(block => block.data);
        this.type.doc.transact(() => {
          this.type.delete(0, this.type.length);
          this.type.insert(0, content);
        });
      });
    });

    // observe remote changes
    this._observeRemoteChanges();
  }

  _observeRemoteChanges() {
    const updateEditorContent = () => {
      const content = this.type.toJSON();
      const blocks = content.map(data => ({ type: data.type, data }));
      this.editor.isReady.then(() => {
        this.editor.blocks.render({ blocks });
      });
    };
    updateEditorContent();
    this._typeObserver = (event) => {
      updateEditorContent();
    };
    this.type.observe(this._typeObserver);
  }
}
