import { html, TemplateResult } from 'lit';

import { EditV2 } from '@openscd/oscd-api';

import { getReference } from '@openscd/scl-lib';

import {
  createElement,
  crossProduct,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

const types: Partial<Record<string, string>> = {
  // standard
  CBR: 'Circuit Breaker',
  DIS: 'Disconnector',
  // custom
  ERS: 'Earth Switch',
  CTR: 'Current Transformer',
  VTR: 'Voltage Transformer',
  AXN: 'Auxiliary Network',
  BAT: 'Battery',
  BSH: 'Bushing',
  CAP: 'Capacitor Bank',
  CON: 'Converter',
  EFN: 'Earth Fault Neutralizer',
  FAN: 'Fan',
  GIL: 'Gas Insulated Line',
  GEN: 'Generator',
  IFL: 'Infeeding Line',
  MOT: 'Motor',
  RES: 'Neutral Resistor',
  REA: 'Reactor',
  PSH: 'Power Shunt',
  CAB: 'Power Cable',
  PMP: 'Pump',
  LIN: 'Power Overhead Line',
  RRC: 'Rotating Reactive Component',
  SCR: 'Semiconductor Controlled Rectifier',
  SAR: 'Surge Arrester',
  SMC: 'Synchronous Machine',
  TCF: 'Thyristor Controlled Frequency Converter',
  TCR: 'Thyristor Controlled Reactive Component',
};

function getLogicalNodeInstance(lNode: Element | null): Element | null {
  if (!lNode) {
    return null;
  }
  const [lnInst, lnClass, iedName, ldInst, prefix] = [
    'lnInst',
    'lnClass',
    'iedName',
    'ldInst',
    'prefix',
  ].map(attribute => lNode?.getAttribute(attribute));
  const iedSelector = [`IED[name="${iedName}"]`, 'IED'];
  const lDevicePath = ['AccessPoint > Server'];
  const lNSelector = [
    `LDevice[inst="${ldInst}"] > LN[inst="${lnInst}"][lnClass="${lnClass}"]`,
  ];
  const lNPrefixSelector =
    prefix && prefix !== ''
      ? [`[prefix="${prefix}"]`]
      : ['[prefix=""]', ':not(prefix)'];
  return lNode.ownerDocument.querySelector(
    crossProduct(
      iedSelector,
      [' > '],
      lDevicePath,
      [' > '],
      lNSelector,
      lNPrefixSelector,
    )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((strings: any[]) => strings.join(''))
      .join(','),
  );
}

function getSwitchTypeValueFromDTT(lNorlNode: Element): string | undefined {
  const rootNode = lNorlNode?.ownerDocument;
  const lNodeType = lNorlNode.getAttribute('lnType');
  const lnClass = lNorlNode.getAttribute('lnClass');
  const dObj = rootNode.querySelector(
    `DataTypeTemplates > LNodeType[id="${lNodeType}"][lnClass="${lnClass}"] > DO[name="SwTyp"]`,
  );
  if (dObj) {
    const dORef = dObj.getAttribute('type');
    return rootNode
      .querySelector(
        `DataTypeTemplates > DOType[id="${dORef}"] > DA[name="stVal"] > Val`,
      )
      ?.innerHTML.trim();
  }

  return undefined;
}

function getSwitchTypeValue(lN: Element): string | undefined {
  const daInstantiated = lN.querySelector(
    'DOI[name="SwTyp"] > DAI[name="stVal"]',
  );

  if (daInstantiated) {
    return daInstantiated.querySelector('Val')?.innerHTML.trim();
  }

  return getSwitchTypeValueFromDTT(lN);
}

function containsGroundedTerminal(condEq: Element): boolean {
  return Array.from(condEq.querySelectorAll('Terminal')).some(
    t => t.getAttribute('cNodeName') === 'grounded',
  );
}

function containsEarthSwitchDefinition(condEq: Element): boolean {
  const lNodeXSWI = condEq.querySelector('LNode[lnClass="XSWI"]');
  const lN = getLogicalNodeInstance(lNodeXSWI);
  let swTypVal;
  if (lN) {
    swTypVal = getSwitchTypeValue(lN);
  } else if (lNodeXSWI) {
    swTypVal = getSwitchTypeValueFromDTT(lNodeXSWI);
  }
  return swTypVal
    ? ['Earthing Switch', 'High Speed Earthing Switch'].includes(swTypVal)
    : false;
}

function typeStr(condEq: Element): string {
  if (
    condEq.getAttribute('type') === 'DIS' &&
    (containsGroundedTerminal(condEq) || containsEarthSwitchDefinition(condEq))
  ) {
    return 'ERS';
  }

  return condEq.getAttribute('type') ?? '';
}

function typeName(condEq: Element): string {
  return types[typeStr(condEq)] ?? 'Unknown Type';
}

function renderTypeSelector(
  option: 'edit' | 'create',
  type: string,
): TemplateResult {
  return option === 'create'
    ? html`<scl-select
        required
        label="type"
        .selectOptions=${Object.values(types)}
      ></scl-select>`
    : html`<scl-select
        label="type"
        disabled
        .selectOptions=${Object.values(types)}
        .value=${type}
      >
      </scl-select>`;
}

type RenderOptions = {
  name: string | null;
  desc: string | null;
  option: 'edit' | 'create';
  type: string;
  reservedValues: string[];
};

function renderConductingEquipmentWizard(
  options: RenderOptions,
): TemplateResult[] {
  return [
    renderTypeSelector(options.option, options.type),
    html`<scl-text-field
      label="name"
      .value=${options.name}
      required
      dialogInitialFocus
      .reservedValues=${options.reservedValues}
    ></scl-text-field>`,
    html`<scl-text-field
      label="desc"
      .value=${options.desc}
      nullable
    ></scl-text-field>`,
  ];
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!);
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const hrType = getValue(inputs.find(i => i.label === 'type')!);
    const proxyType = Object.entries(types).find(
      ([_, value]) => value === hrType,
    )![0];
    const type = proxyType === 'ERS' ? 'DIS' : proxyType;

    const element = createElement(parent.ownerDocument, 'ConductingEquipment', {
      name,
      type,
      desc,
    });
    const action = {
      parent,
      node: element,
      reference: getReference(parent, 'ConductingEquipment'),
    };

    if (hrType !== 'ERS') {
      return [action];
    }

    const groundNode = parent
      .closest('VoltageLevel')
      ?.querySelector('ConnectivityNode[name="grounded"]');

    const substationName = groundNode
      ? (groundNode.closest('Substation')?.getAttribute('name') ?? null)
      : (parent.closest('Substation')?.getAttribute('name') ?? null);
    const voltageLevelName = groundNode
      ? (groundNode.closest('VoltageLevel')?.getAttribute('name') ?? null)
      : (parent.closest('VoltageLevel')?.getAttribute('name') ?? null);
    const bayName = groundNode
      ? (groundNode.closest('Bay')?.getAttribute('name') ?? null)
      : (parent.closest('Bay')?.getAttribute('name') ?? null);
    const connectivityNode =
      bayName && voltageLevelName && substationName
        ? `${substationName}/${voltageLevelName}/${bayName}/grounded`
        : null;

    const groundTerminal = createElement(parent.ownerDocument, 'Terminal', {
      name: 'T1',
      cNodeName: 'grounded',
      substationName,
      voltageLevelName,
      bayName,
      connectivityNode,
    });

    const terminalAction = {
      parent: element,
      node: groundTerminal,
      reference: getReference(element, 'Terminal'),
    };
    if (groundNode) {
      return [action, terminalAction];
    }

    const cNodeElement = createElement(
      parent.ownerDocument,
      'ConnectivityNode',
      {
        name: 'grounded',
        pathName: connectivityNode,
      },
    );

    const cNodeAction = {
      parent,
      node: cNodeElement,
      reference: getReference(parent, 'ConnectivityNode'),
    };
    return [action, terminalAction, cNodeAction];
  };
}

export function createConductingEquipmentWizard(parent: Element): Wizard {
  return {
    title: 'Add ConductingEquipment',
    primary: {
      icon: 'add',
      label: 'add',
      action: createAction(parent),
    },
    content: renderConductingEquipmentWizard({
      name: '',
      desc: '',
      option: 'create',
      type: '',
      reservedValues: reservedNames(parent, 'ConductingEquipment'),
    }),
  };
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc')
    ) {
      return [];
    }

    return [{ element, attributes: { name, desc } }];
  };
}

export function editConductingEquipmentWizard(element: Element): Wizard {
  return {
    title: 'Edit ConductingEquipment',
    primary: {
      icon: 'edit',
      label: 'save',
      action: updateAction(element),
    },
    content: renderConductingEquipmentWizard({
      name: element.getAttribute('name'),
      desc: element.getAttribute('desc'),
      option: 'edit',
      type: typeName(element),
      reservedValues: reservedNames(element),
    }),
  };
}
