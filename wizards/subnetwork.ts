import { html, TemplateResult } from 'lit';

import { EditV2 } from '@omicronenergy/oscd-api';
import { getReference } from '@openenergytools/scl-lib';

import {
  cloneElement,
  createElement,
  getMultiplier,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';
import { patterns } from './patterns.js';

/** Initial attribute values suggested for `SubNetwork` creation */
const initial = {
  type: '8-MMS',
  bitrate: '100',
  multiplier: 'M',
};

interface RenderOptions {
  name: string | null;
  reservedValues: string[];
  desc: string | null;
  type: string | null;
  BitRate: string | null;
  multiplier: string | null;
}

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
      pattern="${patterns.normalizedString}"
    ></scl-text-field>`,
    html`<scl-text-field
      label="BitRate"
      .value=${options.BitRate}
      nullable
      unit="b/s"
      .multipliers=${[null, 'M']}
      .multiplier=${options.multiplier}
      required
      pattern="${patterns.decimal}"
    ></scl-text-field>`,
  ];
}

export function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!);
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const type = getValue(inputs.find(i => i.label === 'type')!);
    const BitRate = getValue(inputs.find(i => i.label === 'BitRate')!);
    const multiplier = getMultiplier(inputs.find(i => i.label === 'BitRate')!);

    const element = createElement(parent.ownerDocument, 'SubNetwork', {
      name,
      desc,
      type,
    });

    if (BitRate !== null) {
      const bitRateElement = createElement(parent.ownerDocument, 'BitRate', {
        unit: 'b/s',
        multiplier,
      });
      bitRateElement.textContent = BitRate;
      element.appendChild(bitRateElement);
    }

    const action = {
      parent,
      node: element,
      reference: getReference(parent, 'SubNetwork'),
    };

    return [action];
  };
}

export function createSubNetworkWizard(parent: Element): Wizard {
  return {
    title: 'Add SubNetwork',
    primary: {
      icon: 'add',
      label: 'add',
      action: createAction(parent),
    },
    content: renderContent({
      name: '',
      reservedValues: reservedNames(parent, 'SubNetwork'),
      desc: '',
      type: initial.type,
      BitRate: initial.bitrate,
      multiplier: initial.multiplier,
    }),
  };
}

function getBitRateAction(
  oldBitRate: Element | null,
  BitRate: string | null,
  multiplier: string | null,
  SubNetwork: Element,
): EditV2 {
  if (oldBitRate === null) {
    const bitRateElement = createElement(SubNetwork.ownerDocument, 'BitRate', {
      unit: 'b/s',
    });

    if (multiplier) {
      bitRateElement.setAttribute('multiplier', multiplier);
    }
    if (BitRate) {
      bitRateElement.textContent = BitRate;
    }

    return {
      parent: SubNetwork,
      node: bitRateElement,
      reference: getReference(SubNetwork, 'BitRate'),
    };
  }

  if (BitRate === null) {
    return {
      parent: SubNetwork,
      node: oldBitRate,
      reference: oldBitRate.nextSibling,
    };
  }

  const newBitRate = cloneElement(oldBitRate, { multiplier });
  newBitRate.textContent = BitRate;

  return [
    {
      parent: oldBitRate.parentElement!,
      node: newBitRate,
      reference: getReference(oldBitRate.parentElement!, 'BitRate'),
    },
    { node: oldBitRate },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = inputs.find(i => i.label === 'name')!.value!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const type = getValue(inputs.find(i => i.label === 'type')!);
    const BitRate = getValue(inputs.find(i => i.label === 'BitRate')!);
    const multiplier = getMultiplier(inputs.find(i => i.label === 'BitRate')!);

    let subNetworkAction: EditV2 | null;
    let bitRateAction: EditV2 | null;

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc') &&
      type === element.getAttribute('type')
    ) {
      subNetworkAction = null;
    } else {
      subNetworkAction = { element, attributes: { name, desc, type } };
    }

    if (
      BitRate ===
        (element.querySelector('SubNetwork > BitRate')?.textContent?.trim() ??
          null) &&
      multiplier ===
        (element
          .querySelector('SubNetwork > BitRate')
          ?.getAttribute('multiplier') ?? null)
    ) {
      bitRateAction = null;
    } else {
      bitRateAction = getBitRateAction(
        element.querySelector('SubNetwork > BitRate'),
        BitRate,
        multiplier,
        subNetworkAction?.element ?? element,
      );
    }

    const actions: EditV2[] = [];
    if (subNetworkAction) {
      actions.push(subNetworkAction);
    }
    if (bitRateAction) {
      actions.push(bitRateAction);
    }
    return actions;
  };
}

export function editSubNetworkWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const type = element.getAttribute('type');
  const BitRate =
    element.querySelector('SubNetwork > BitRate')?.textContent?.trim() ?? null;
  const multiplier =
    element.querySelector('SubNetwork > BitRate')?.getAttribute('multiplier') ??
    null;

  const reservedValues = reservedNames(element);

  return {
    title: 'Edit SubNetwork',
    primary: {
      icon: 'save',
      label: 'save',
      action: updateAction(element),
    },
    content: renderContent({
      name,
      reservedValues,
      desc,
      type,
      BitRate,
      multiplier,
    }),
  };
}
