/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';

// eslint-disable-next-line import/no-duplicates
import { Edit, getReference, updateSubstation } from '@openenergytools/scl-lib';

import {
  createElement,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

type RenderOptions = {
  name: string;
  reservedValues: string[];
  desc: string | null;
};

function render(options: RenderOptions): TemplateResult[] {
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
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!);
    const desc = getValue(inputs.find(i => i.label === 'desc')!);

    parent.ownerDocument.createElement('Substation');
    const substation = createElement(parent.ownerDocument, 'Substation', {
      name,
      desc,
    });

    return [
      {
        parent,
        node: substation,
        reference: getReference(parent, 'Substation'),
      },
    ];
  };
}

export function createSubstationWizard(parent: Element): Wizard {
  return {
    title: 'Create Substation',
    primary: {
      icon: 'add',
      label: 'add',
      action: createAction(parent),
    },
    content: render({
      name: '',
      reservedValues: reservedNames(parent, 'Substation'),
      desc: '',
    }),
  };
}

export function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = inputs.find(i => i.label === 'name')!.value!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc')
    )
      return [];

    return updateSubstation({ element, attributes: { name, desc } });
  };
}

export function editSubstationWizard(element: Element): Wizard {
  return {
    title: 'Edit Substation',
    primary: {
      icon: 'edit',
      label: 'save',
      action: updateAction(element),
    },
    content: render({
      name: element.getAttribute('name') ?? '',
      reservedValues: reservedNames(element),
      desc: element.getAttribute('desc'),
    }),
  };
}
