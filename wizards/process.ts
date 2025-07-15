import { html, TemplateResult } from 'lit';

import { EditV2 } from '@omicronenergy/oscd-api';
import { getReference } from '@openenergytools/scl-lib';

import {
  createElement,
  getChildElementsByTagName,
  getValue,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

type ContentOptions = {
  name: string | null;
  desc: string | null;
  type: string | null;
  reservedNames: string[];
};

function contentProcessWizard(content: ContentOptions): TemplateResult[] {
  return [
    html`<scl-text-field
      label="name"
      .value=${content.name}
      required
      .reservedValues=${content.reservedNames}
      dialogInitialFocus
    ></scl-text-field>`,
    html`<scl-text-field
      label="desc"
      .value=${content.desc}
      nullable
    ></scl-text-field>`,
    html`<scl-text-field
      label="type"
      .value=${content.type}
      nullable
    ></scl-text-field>`,
  ];
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const attributes: Record<string, string | null> = {};
    const processKeys = ['name', 'desc', 'type'];
    processKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const process = createElement(parent.ownerDocument, 'Process', attributes);

    return [
      { parent, node: process, reference: getReference(parent, 'Process') },
    ];
  };
}

export function createProcessWizard(parent: Element): Wizard {
  const name = '';
  const desc = '';
  const type = '';
  const reservedNames: string[] = getChildElementsByTagName(
    parent.parentElement!,
    'Process',
  )
    .filter(sibling => sibling !== parent)
    .map(sibling => sibling.getAttribute('name')!);
  return {
    title: 'Add Process',
    primary: {
      icon: 'save',
      label: 'save',
      action: createAction(parent),
    },
    content: [
      ...contentProcessWizard({
        name,
        desc,
        type,
        reservedNames,
      }),
    ],
  };
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const attributes: Record<string, string | null> = {};
    const tapProcessKeys = ['name', 'desc', 'type'];
    tapProcessKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    if (
      tapProcessKeys.some(key => attributes[key] !== element.getAttribute(key))
    ) {
      return [{ element, attributes }];
    }
    return [];
  };
}

export function editProcessWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const type = element.getAttribute('type');
  const reservedNames: string[] = getChildElementsByTagName(
    element.parentElement!,
    'Process',
  )
    .filter(sibling => sibling !== element)
    .map(sibling => sibling.getAttribute('name')!);

  return {
    title: 'Edit Process',
    primary: {
      icon: 'save',
      label: 'save',
      action: updateAction(element),
    },
    content: [
      ...contentProcessWizard({
        name,
        desc,
        type,
        reservedNames,
      }),
    ],
  };
}
