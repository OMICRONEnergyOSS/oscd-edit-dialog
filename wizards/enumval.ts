import { html, TemplateResult } from 'lit';

import { EditV2 } from '@openscd/oscd-api';
import { getReference } from '@openscd/scl-lib';

import {
  cloneElement,
  createElement,
  getValue,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';
import { patterns } from './patterns.js';

type EnumValContent = {
  ord: string | null;
  desc: string | null;
  value: string | null;
};

function renderContent(content: EnumValContent): TemplateResult[] {
  return [
    html`<scl-text-field
      label="ord"
      .value=${content.ord}
      required
      type="number"
    ></scl-text-field>`,
    html`<scl-text-field
      label="value"
      .value=${content.value}
      pattern="${patterns.normalizedString}"
      dialogInitialFocus
    ></scl-text-field>`,
    html`<scl-text-field
      id="evDesc"
      label="desc"
      .value=${content.desc}
      nullable
      pattern="${patterns.normalizedString}"
    ></scl-text-field>`,
  ];
}

function nextOrd(parent: Element): string {
  const maxOrd = Math.max(
    ...Array.from(parent.children).map(child =>
      parseInt(child.getAttribute('ord') ?? '-2', 10),
    ),
  );

  return isFinite(maxOrd) ? (maxOrd + 1).toString(10) : '0';
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const value = getValue(inputs.find(i => i.label === 'value')!);
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const ord =
      getValue(inputs.find(i => i.label === 'ord')!) || nextOrd(parent);

    const element = createElement(parent.ownerDocument, 'EnumVal', {
      ord,
      desc,
    });

    element.textContent = value;

    const action = [
      {
        parent,
        node: element,
        reference: getReference(parent, 'EnumVal'),
      },
    ];

    return [action];
  };
}

export function createEnumValWizard(parent: Element): Wizard {
  const [ord, desc, value] = [nextOrd(parent), null, ''];

  return {
    title: 'Add EnumVal',
    primary: {
      icon: '',
      label: 'Save',
      action: createAction(parent),
    },
    content: renderContent({ ord, desc, value }),
  };
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const value = getValue(inputs.find(i => i.label === 'value')!) ?? '';
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const ord =
      getValue(inputs.find(i => i.label === 'ord')!) ||
      element.getAttribute('ord') ||
      nextOrd(element.parentElement!);

    if (
      value === element.textContent &&
      desc === element.getAttribute('desc') &&
      ord === element.getAttribute('ord')
    ) {
      return [];
    }

    const newElement = cloneElement(element, { desc, ord });
    newElement.textContent = value;

    return [
      {
        parent: element.parentElement!,
        node: newElement,
        reference: getReference(element.parentElement!, 'EnumVal'),
      },
      { node: element },
    ];
  };
}

export function editEnumValWizard(element: Element): Wizard {
  const [ord, desc, value] = [
    element.getAttribute('ord'),
    element.getAttribute('desc'),
    element.textContent,
  ];

  return {
    title: 'Edit EnumVal',
    primary: {
      icon: '',
      label: 'Save',
      action: updateAction(element),
    },
    content: renderContent({ ord, desc, value }),
  };
}
