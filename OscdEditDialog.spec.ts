/* eslint-disable @typescript-eslint/no-unused-expressions */

import { OpenSCD } from '@omicronenergy/oscd-shell/oscd-shell.js';
import { expect } from '@open-wc/testing';

const doc = new DOMParser().parseFromString(
  `<testdoc></testdoc>`,
  'application/xml',
);

let editor: OpenSCD;
beforeEach(() => {
  editor = document.createElement('oscd-shell');
  document.body.prepend(editor);
});

afterEach(() => {
  editor.remove();
});

describe('with editor plugins loaded', () => {
  beforeEach(async () => {
    editor.plugins = {
      menu: [],
      editor: [],
    };
    editor.docs = { 'test-doc.scd': doc };
    editor.docName = 'test-doc.scd';
    await editor.updateComplete;
  });

  it('is not a real test - they need to be implemented', async () => {
    expect('change').to.be.ok;
  });
});
