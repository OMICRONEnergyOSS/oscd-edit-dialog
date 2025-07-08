import { html } from 'lit';

import { EditV2 } from '@omicronenergy/oscd-api';
import { getReference } from '@openenergytools/scl-lib';

import {
  createElement,
  getValue,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';
import { patterns } from './patterns.js';

function createLNodeTypeAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const lNodeTypeAttrs: Record<string, string | null> = {};
    const lNodeTypeKeys = ['id', 'desc', 'lnClass'];
    lNodeTypeKeys.forEach((key) => {
      lNodeTypeAttrs[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const lNodeType = createElement(
      parent.ownerDocument,
      'LNodeType',
      lNodeTypeAttrs,
    );

    return [
      { parent, node: lNodeType, reference: getReference(parent, 'LNodeType') },
    ];
  };
}

export function createLNodeTypeWizard(parent: Element): Wizard {
  return {
    title: 'Add LNodeType',
    primary: {
      icon: 'Save',
      label: 'Save',
      action: createLNodeTypeAction(parent),
    },
    content: [
      html`<scl-text-field
        label="id"
        .value=${''}
        required
        maxlength="127"
        minlength="1"
        pattern="${patterns.nmToken}"
      ></scl-text-field>`,
      html`<scl-text-field
        label="desc"
        .value=${null}
        nullable
        pattern="${patterns.normalizedString}"
      ></scl-text-field>`,
      html`<scl-text-field
        label="lnClass"
        .value=${'LLN0'}
        pattern="${patterns.lnClass}"
      ></scl-text-field>`,
    ],
  };
}
