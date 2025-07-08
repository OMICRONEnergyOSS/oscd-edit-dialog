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

type RenderOptions = {
  name: string | null;
  reservedValues: string[];
  desc: string | null;
  type: string | null;
  virtual: string | null;
};

function contentTransformerWindingWizard(
  options: RenderOptions,
): TemplateResult[] {
  return [
    html`<scl-text-field
      label="name"
      .value=${options.name}
      required
      .reservedValues=${options.reservedValues}
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
    html`<scl-checkbox
      label="virtual"
      .value=${options.virtual}
      nullable
    ></scl-checkbox>`,
  ];
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const attributes: Record<string, string | null> = {};
    const transformerWindingKeys = ['name', 'desc', 'type', 'virtual'];
    transformerWindingKeys.forEach((key) => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const transformerWinding = createElement(
      parent.ownerDocument,
      'TransformerWinding',
      attributes,
    );

    return [
      {
        parent,
        node: transformerWinding,
        reference: getReference(parent, 'TransformerWinding'),
      },
    ];
  };
}

export function createTransformerWindingWizard(parent: Element): Wizard {
  const name = '';
  const desc = null;
  const type = null;
  const virtual = null;

  return {
    title: 'Add TransformerWinding',
    primary: {
      icon: 'save',
      label: 'save',
      action: createAction(parent),
    },
    content: [
      ...contentTransformerWindingWizard({
        name,
        reservedValues: reservedNames(parent, 'TransformerWinding'),
        desc,
        type,
        virtual,
      }),
    ],
  };
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const attributes: Record<string, string | null> = {};
    const transformerWindingKeys = ['name', 'desc', 'type', 'virtual'];
    transformerWindingKeys.forEach((key) => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    if (
      transformerWindingKeys.some(
        key => attributes[key] !== element.getAttribute(key),
      )
    ) {
      return [{ element, attributes }];
    }

    return [];
  };
}

export function editTransformerWindingWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const type = element.getAttribute('type');
  const virtual = element.getAttribute('virtual');

  return {
    title: 'Edit TransformerWinding',
    primary: {
      icon: 'save',
      label: 'save',
      action: updateAction(element),
    },
    content: [
      ...contentTransformerWindingWizard({
        name,
        reservedValues: reservedNames(element),
        desc,
        type,
        virtual,
      }),
    ],
  };
}
