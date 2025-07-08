import { html, TemplateResult } from 'lit';

import { EditV2 } from '@omicronenergy/oscd-api';

import { Wizard, WizardActor, WizardInputElement } from '../foundation.js';

function render(
  inst: string,
  name: string | null,
  ldNames: string[],
): TemplateResult[] {
  return [
    html`<scl-text-field
      label="inst"
      .value=${inst}
      disabled
    ></scl-text-field>`,
    html`<scl-text-field
      label="name"
      .value=${name}
      nullable
      .reservedValues=${ldNames}
    ></scl-text-field>`,
  ];
}

export function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = inputs.find(i => i.label === 'name')!.value!;

    if (name === element.getAttribute('name')) {
      return [];
    }

    return [
      {
        element,
        attributes: { name },
      },
    ];
  };
}

export function editLDeviceWizard(element: Element): Wizard {
  const ldNames: string[] = Array.from(
    element.ownerDocument.querySelectorAll(
      ':root > IED > AccessPoint > Server > LDevice',
    ),
  ).map(ied => ied.getAttribute('name')!);

  return {
    title: 'Edit LDevice',
    primary: {
      icon: 'edit',
      label: 'save',
      action: updateAction(element),
    },
    content: render(
      element.getAttribute('inst') ?? '',
      element.getAttribute('name'),
      ldNames,
    ),
  };
}
