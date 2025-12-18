import { html, TemplateResult } from 'lit';

import { EditV2 } from '@openscd/oscd-api';

import { getReference } from '@openscd/scl-lib';

import {
  createElement,
  getValue,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';
import { patterns } from './patterns.js';

type DoContent = {
  name: string | null;
  desc: string | null;
  type: string | null;
  doTypes: Element[];
};

function renderContent(content: DoContent): TemplateResult[] {
  return [
    html`<scl-text-field
      label="name"
      .value=${content.name}
      required
      pattern="${patterns.alphanumericFirstLowerCase}"
      dialogInitialFocus
      disabled
    ></scl-text-field>`,
    html`<scl-text-field
      label="desc"
      .value=${content.desc}
      nullable
      pattern="${patterns.normalizedString}"
    ></scl-text-field>`,
    html`<scl-select
      label="type"
      required
      .selectOptions=${content.doTypes.map(dataType => dataType.id)}
      .value=${content.type}
      disabled
    ></scl-select>`,
  ];
}

function createSDoAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const type = getValue(inputs.find(i => i.label === 'type')!);

    const actions: EditV2 = [];

    const element = createElement(parent.ownerDocument, 'SDO', {
      name,
      desc,
      type,
    });

    actions.push({
      parent,
      node: element,
      reference: getReference(parent, 'SDO'),
    });

    return actions;
  };
}

export function createSDoWizard(parent: Element): Wizard {
  const [type, name, desc] = [null, '', null];

  const doTypes = Array.from(
    parent.ownerDocument.querySelectorAll('DOType'),
  ).filter(doType => doType.getAttribute('id'));

  return {
    title: 'Add SDO',
    primary: { icon: '', label: 'save', action: createSDoAction(parent) },
    content: renderContent({
      name,
      desc,
      type,
      doTypes,
    }),
  };
}

function updateSDoAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const type = getValue(inputs.find(i => i.label === 'type')!)!;

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc') &&
      type === element.getAttribute('type')
    ) {
      return [];
    }

    return [{ element, attributes: { name, desc, type } }];
  };
}

export function editSDoWizard(element: Element): Wizard {
  const [type, name, desc] = [
    element.getAttribute('type'),
    element.getAttribute('name'),
    element.getAttribute('desc'),
  ];

  const doTypes = Array.from(
    element.ownerDocument.querySelectorAll('DOType'),
  ).filter(doType => doType.getAttribute('id'));

  return {
    title: 'Edit SDO',
    primary: { icon: '', label: 'save', action: updateSDoAction(element) },
    content: renderContent({
      name,
      desc,
      type,
      doTypes,
    }),
  };
}
