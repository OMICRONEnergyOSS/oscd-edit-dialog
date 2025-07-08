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

function createEnumTypeAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const enumTypeAttrs: Record<string, string | null> = {};
    const enumTypeKeys = ['id', 'desc'];
    enumTypeKeys.forEach((key) => {
      enumTypeAttrs[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const enumType = createElement(
      parent.ownerDocument,
      'EnumType',
      enumTypeAttrs,
    );

    return [
      { parent, node: enumType, reference: getReference(parent, 'EnumType') },
    ];
  };
}

export function createEnumTypeWizard(parent: Element): Wizard {
  return {
    title: 'Add EnumType',
    primary: {
      icon: 'Save',
      label: 'Save',
      action: createEnumTypeAction(parent),
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
    ],
  };
}
