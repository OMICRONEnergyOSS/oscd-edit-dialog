import { html, TemplateResult } from 'lit';

import { EditV2 } from '@openscd/oscd-api';

import { getReference, updateBay } from '@openscd/scl-lib';

import {
  createElement,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

type RenderOptions = {
  name: string | null;
  reservedValues: string[];
  desc: string | null;
};

export function renderBayWizard(options: RenderOptions): TemplateResult[] {
  return [
    html`<scl-text-field
      label="name"
      .value=${options.name}
      required
      .reservedValues="${options.reservedValues}"
      dialogInitialFocus
    ></scl-text-field>`,
    html`<scl-text-field
      label="desc"
      .value=${options.desc}
      nullable
    ></scl-text-field>`,
  ];
}

export function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!);
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const node = createElement(parent.ownerDocument, 'Bay', {
      name,
      desc,
    });

    const action = {
      parent,
      node,
      reference: getReference(parent, 'Bay'),
    };

    return [action];
  };
}

export function createBayWizard(parent: Element): Wizard {
  return {
    title: 'Add Bay',
    primary: {
      icon: '',
      label: 'add',
      action: createAction(parent),
    },
    content: renderBayWizard({
      name: '',
      reservedValues: reservedNames(parent, 'Bay'),
      desc: '',
    }),
  };
}

export function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = inputs.find(i => i.label === 'name')!.value!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc')
    ) {
      return [];
    }

    return updateBay({ element, attributes: { name, desc } });
  };
}

export function editBayWizard(element: Element): Wizard {
  return {
    title: 'Edit Bay',
    primary: {
      icon: 'edit',
      label: 'save',
      action: updateAction(element),
    },
    content: renderBayWizard({
      name: element.getAttribute('name'),
      reservedValues: reservedNames(element),
      desc: element.getAttribute('desc'),
    }),
  };
}
