import { html, TemplateResult } from 'lit';

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

type DoContent = {
  name: string | null;
  desc: string | null;
  transient: string | null;
  accessControl: string | null;
  type: string | null;
  doTypes: Element[];
};

function renderContent(content: DoContent): TemplateResult[] {
  return [
    html`<scl-text-field
      label="name"
      .value=${content.name}
      required
      pattern="${patterns.alphanumericFirstUpperCase}"
      dialogInitialFocus
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
      .selectOptions=${content.doTypes.map(doType => doType.id)}
      .value=${content.type}
    ></scl-select>`,
    html`<scl-text-field
      label="accessControl"
      .value=${content.accessControl}
      nullable
      pattern="${patterns.normalizedString}"
    ></scl-text-field>`,
    html`<scl-checkbox
      label="transient"
      .value="${content.transient}"
      nullable
    ></scl-checkbox>`,
  ];
}

function createDoAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const type = getValue(inputs.find(i => i.label === 'type')!);
    const accessControl = getValue(
      inputs.find(i => i.label === 'accessControl')!,
    );
    const transient =
      getValue(inputs.find(i => i.label === 'transient')!) !== ''
        ? getValue(inputs.find(i => i.label === 'transient')!)
        : null;

    const actions: EditV2[] = [];

    const element = createElement(parent.ownerDocument, 'DO', {
      name,
      desc,
      type,
      accessControl,
      transient,
    });

    actions.push({
      parent,
      node: element,
      reference: getReference(parent, 'DO'),
    });

    return actions;
  };
}

export function createDoWizard(parent: Element): Wizard {
  const [type, name, desc, accessControl, transient] = [
    null,
    '',
    null,
    null,
    null,
  ];

  const doTypes = Array.from(
    parent.ownerDocument.querySelectorAll('DOType'),
  ).filter(doType => doType.getAttribute('id'));

  return {
    title: 'Add DO',
    primary: { icon: '', label: 'save', action: createDoAction(parent) },
    content: renderContent({
      name,
      desc,
      transient,
      accessControl,
      type,
      doTypes,
    }),
  };
}

function updateDoAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const type = getValue(inputs.find(i => i.label === 'type')!)!;
    const accessControl = getValue(
      inputs.find(i => i.label === 'accessControl')!,
    );
    const transient =
      getValue(inputs.find(i => i.label === 'transient')!) !== ''
        ? getValue(inputs.find(i => i.label === 'transient')!)
        : null;

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc') &&
      type === element.getAttribute('type') &&
      accessControl === element.getAttribute('accessControl') &&
      transient === element.getAttribute('transient')
    ) {
      return [];
    }

    return [
      { element, attributes: { name, desc, type, accessControl, transient } },
    ];
  };
}

export function editDoWizard(element: Element): Wizard {
  const [type, name, desc, accessControl, transient] = [
    element.getAttribute('type'),
    element.getAttribute('name'),
    element.getAttribute('desc'),
    element.getAttribute('accessControl'),
    element.getAttribute('transient'),
  ];

  const doTypes = Array.from(
    element.ownerDocument.querySelectorAll('DOType'),
  ).filter(doType => doType.getAttribute('id'));

  return {
    title: 'Edit DO',
    primary: { icon: '', label: 'save', action: updateDoAction(element) },
    content: renderContent({
      name,
      desc,
      transient,
      accessControl,
      type,
      doTypes,
    }),
  };
}
