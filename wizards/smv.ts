import { EditV2 } from '@openscd/oscd-api';

import { SclCheckbox } from '@openenergytools/scl-checkbox';

import {
  getValue,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

import { contentAddress, updateAddress } from './address.js';

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
    if (!addressActions.length) {
      return [];
    }

    addressActions.forEach(addressAction => {
      action.push(addressAction);
    });

    return [action];
  };
}

export function editSMvWizard(element: Element): Wizard {
  const types = ['MAC-Address', 'APPID', 'VLAN-ID', 'VLAN-PRIORITY'];

  return {
    title: 'Edit SMV',
    primary: {
      label: 'save',
      icon: 'edit',
      action: updateAction(element),
    },
    content: [...contentAddress({ element, types })],
  };
}
