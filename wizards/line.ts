import { html, TemplateResult } from 'lit';
import { EditV2 } from '@omicronenergy/oscd-api';

import { getReference } from '@openenergytools/scl-lib';

import {
  createElement,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

import { patterns } from './patterns.js';

type RenderOptions = {
  name: string;
  reservedValues: string[];
  desc: string | null;
  type: string | null;
  nomFreq: string | null;
  numPhases: string | null;
};

function renderContent(options: RenderOptions): TemplateResult[] {
  return [
    html`<scl-text-field
      label="name"
      .value=${options.name}
      required
      dialogInitialFocus
    ></scl-text-field>`,
    html`<scl-text-field
      label="desc"
      .value=${options.desc}
      nullable
    ></scl-text-field>`,
    html`<scl-text-field
      label="type"
      .value=${options.type}
      nullable
    ></scl-text-field>`,
    html`<scl-text-field
      label="nomFreq"
      .value=${options.nomFreq}
      nullable
      suffix="Hz"
      pattern="${patterns.unsigned}"
    ></scl-text-field>`,
    html`<scl-text-field
      label="numPhases"
      .value=${options.numPhases}
      nullable
      suffix="#"
      type="number"
      min="1"
      max="255"
    ></scl-text-field>`,
  ];
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const attributes: Record<string, string | null> = {};
    const lineKeys = ['name', 'desc', 'type', 'nomFreq', 'numPhases'];
    lineKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const line = createElement(parent.ownerDocument, 'Line', attributes);

    return [{ parent, node: line, reference: getReference(parent, 'Line') }];
  };
}

export function createLineWizard(parent: Element): Wizard {
  const name = '';
  const desc = '';
  const type = '';
  const nomFreq = '';
  const numPhases = '';
  const reservedValues = reservedNames(parent, 'Line');

  return {
    title: 'Add Line',
    primary: {
      icon: 'save',
      label: 'save',
      action: createAction(parent),
    },
    content: [
      ...renderContent({
        name,
        reservedValues,
        desc,
        type,
        nomFreq,
        numPhases,
      }),
    ],
  };
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const attributes: Record<string, string | null> = {};
    const lineKeys = ['name', 'desc', 'type', 'nomFreq', 'numPhases'];
    lineKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    if (lineKeys.some(key => attributes[key] !== element.getAttribute(key))) {
      return [{ element, attributes }];
    }
    return [];
  };
}

export function editLineWizard(element: Element): Wizard {
  return {
    title: 'Edit Line',
    primary: {
      icon: 'edit',
      label: 'save',
      action: updateAction(element),
    },
    content: renderContent({
      name: element.getAttribute('name') ?? '',
      reservedValues: reservedNames(element),
      desc: element.getAttribute('desc'),
      type: element.getAttribute('type'),
      nomFreq: element.getAttribute('nomFreq'),
      numPhases: element.getAttribute('numPhases'),
    }),
  };
}
