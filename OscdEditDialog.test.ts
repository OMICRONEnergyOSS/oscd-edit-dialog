/* eslint-disable @typescript-eslint/no-unused-expressions */
import { OpenSCD } from '@omicronenergy/oscd-shell/oscd-shell.js';
import { expect } from '@open-wc/testing';

const factor = window.process && process.env.CI ? 4 : 2;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(2000 * factor);

const doc = new DOMParser().parseFromString(
  `<testdoc></testdoc>`,
  'application/xml',
);

let editor: OpenSCD;

beforeEach(async () => {
  editor = document.createElement('oscd-shell');
  document.body.prepend(editor);
  editor.plugins = {
    menu: [],
    editor: [],
  };
  editor.docs = { testdoc: doc };
  await editor.updateComplete;
});

afterEach(() => {
  editor.remove();
});

it(`placeholder until real VRT's are implemented`, async () => {
  await timeout(0);
  expect('change').to.be.ok;
});
