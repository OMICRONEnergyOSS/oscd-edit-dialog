import { html } from 'lit';

import { EditV2 } from '@omicronenergy/oscd-api';

import { SclCheckbox } from '@openenergytools/scl-checkbox';

import { getReference } from '@openenergytools/scl-lib';

import {
  createElement,
  getValue,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

import { contentAddress, updateAddress } from './address.js';

function mxxTimeUpdateAction(
  gse: Element,
  oldMxxTime: Element | null,
  newTimeValue: string | null,
  option: {
    minOrMax: 'MinTime' | 'MaxTime';
  },
): EditV2[] {
  if (oldMxxTime === null) {
    const newMxxTime = createElement(gse.ownerDocument, option.minOrMax, {
      unit: 's',
      multiplier: 'm',
    });
    newMxxTime.textContent = newTimeValue;
    return [
      {
        parent: gse,
        node: newMxxTime,
        reference: getReference(gse, option.minOrMax),
      },
    ];
  }

  if (newTimeValue === null) {
    return [
      {
        node: oldMxxTime,
      },
    ];
  }

  const newMxxTime = <Element>oldMxxTime.cloneNode(false);
  newMxxTime.textContent = newTimeValue;
  return [
    {
      parent: gse,
      node: newMxxTime,
      reference: oldMxxTime.nextSibling,
    },
    { node: oldMxxTime },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[], wizard: Element): EditV2[] => {
    const action: EditV2 = [];

    const instType: boolean =
      (wizard.querySelector('#instType') as SclCheckbox).value === 'true';

    const addressContent: Record<string, string | null> = {};
    addressContent['MAC-Address'] = getValue(
      inputs.find(i => i.label === 'MAC-Address')!,
    );
    addressContent.APPID = getValue(inputs.find(i => i.label === 'APPID')!);
    addressContent['VLAN-ID'] = getValue(
      inputs.find(i => i.label === 'VLAN-ID')!,
    );
    addressContent['VLAN-PRIORITY'] = getValue(
      inputs.find(i => i.label === 'VLAN-PRIORITY')!,
    );

    const addressActions = updateAddress(element, addressContent, instType);

    addressActions.forEach(addressAction => {
      action.push(addressAction);
    });

    const minTime = getValue(inputs.find(i => i.label === 'MinTime')!);
    const MaxTime = getValue(inputs.find(i => i.label === 'MaxTime')!);
    if (
      minTime !==
      (element.querySelector('MinTime')?.textContent?.trim() ?? null)
    ) {
      action.push(
        ...mxxTimeUpdateAction(
          element,
          element.querySelector('MinTime'),
          minTime,
          { minOrMax: 'MinTime' },
        ),
      );
    }
    if (
      MaxTime !==
      (element.querySelector('MaxTime')?.textContent?.trim() ?? null)
    ) {
      action.push(
        ...mxxTimeUpdateAction(
          element,
          element.querySelector('MaxTime'),
          minTime,
          { minOrMax: 'MaxTime' },
        ),
      );
    }

    return action;
  };
}

export function editGseWizard(element: Element): Wizard {
  const minTime = element.querySelector('MinTime')?.innerHTML.trim() ?? null;
  const maxTime = element.querySelector('MaxTime')?.innerHTML.trim() ?? null;

  const types = ['MAC-Address', 'APPID', 'VLAN-ID', 'VLAN-PRIORITY'];

  return {
    title: 'Edit GSE',
    primary: {
      label: 'save',
      icon: 'save',
      action: updateAction(element),
    },
    content: [
      ...contentAddress({ element, types }),
      html`<scl-text-field
        label="MinTime"
        .value=${minTime}
        nullable
        suffix="ms"
        type="number"
      ></scl-text-field>`,
      html`<scl-text-field
        label="MaxTime"
        .value=${maxTime}
        nullable
        suffix="ms"
        type="number"
      ></scl-text-field>`,
    ],
  };
}
