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
import {
  getValAction,
  renderAbstractDataAttributeContent,
} from './abstractda.js';
import { functionalConstraintEnum } from './patterns.js';

export function renderAdditionalDaContent(
  fc: string,
  dchg: string | null,
  qchg: string | null,
  dupd: string | null,
): TemplateResult[] {
  return [
    html`<scl-select
      label="fc"
      .selectOptions=${functionalConstraintEnum}
      .value=${fc}
      required
    ></scl-select>`,
    html`<scl-checkbox label="dchg" .value=${dchg} nullable></scl-checkbox>`,
    html`<scl-checkbox label="qchg" .value=${qchg} nullable></scl-checkbox>`,
    html`<scl-checkbox label="dupd" .value=${dupd} nullable></scl-checkbox>`,
  ];
}

function createDaAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const bType = getValue(inputs.find(i => i.label === 'bType')!)!;
    const type =
      bType === 'Enum' || bType === 'Struct'
        ? getValue(inputs.find(i => i.label === 'type')!)
        : null;
    const sAddr = getValue(inputs.find(i => i.label === 'sAddr')!);
    const valKind = getValue(inputs.find(i => i.label === 'valKind')!);
    const valImport = getValue(inputs.find(i => i.label === 'valImport')!);
    const valField = inputs.find(
      i => i.label === 'Val' && i.style.display !== 'none',
    );
    const Val = valField ? getValue(valField) : null;

    const fc = getValue(inputs.find(i => i.label === 'fc')!) ?? '';
    const dchg = getValue(inputs.find(i => i.label === 'dchg')!);
    const qchg = getValue(inputs.find(i => i.label === 'qchg')!);
    const dupd = getValue(inputs.find(i => i.label === 'dupd')!);

    const actions: EditV2[] = [];

    const element = createElement(parent.ownerDocument, 'DA', {
      name,
      desc,
      bType,
      type,
      sAddr,
      valKind,
      valImport,
      fc,
      dchg,
      qchg,
      dupd,
    });

    if (Val !== null) {
      const valElement = createElement(parent.ownerDocument, 'Val', {});
      valElement.textContent = Val;
      element.appendChild(valElement);
    }

    actions.push({
      parent,
      node: element,
      reference: getReference(parent, 'DA'),
    });

    return actions;
  };
}

export function createDaWizard(element: Element): Wizard {
  const doc = element.ownerDocument;

  const name = '';
  const desc = null;
  const bType = '';
  const type = null;
  const sAddr = null;
  const Val = null;
  const valKind = null;
  const valImport = null;
  const fc = '';
  const dchg = null;
  const qchg = null;
  const dupd = null;

  const doTypes = Array.from(doc.querySelectorAll('DAType, EnumType')).filter(
    doType => doType.getAttribute('id'),
  );

  const data = element.closest('DataTypeTemplates')!;

  return {
    title: 'Add DA',
    primary: {
      icon: '',
      label: 'save',
      action: createDaAction(element),
    },
    content: [
      ...renderAbstractDataAttributeContent(
        name,
        desc,
        bType,
        doTypes,
        type,
        sAddr,
        valKind,
        valImport,
        Val,
        data,
      ),
      ...renderAdditionalDaContent(fc, dchg, qchg, dupd),
    ],
  };
}

function updateDaAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): EditV2[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const bType = getValue(inputs.find(i => i.label === 'bType')!)!;
    const type =
      bType === 'Enum' || bType === 'Struct'
        ? getValue(inputs.find(i => i.label === 'type')!)
        : null;
    const sAddr = getValue(inputs.find(i => i.label === 'sAddr')!);
    const valKind = getValue(inputs.find(i => i.label === 'valKind')!);
    const valImport = getValue(inputs.find(i => i.label === 'valImport')!);
    const valField = inputs.find(
      i => i.label === 'Val' && i.style.display !== 'none',
    );
    const Val = valField ? getValue(valField) : null;

    const fc = getValue(inputs.find(i => i.label === 'fc')!) ?? '';
    const dchg = getValue(inputs.find(i => i.label === 'dchg')!);
    const qchg = getValue(inputs.find(i => i.label === 'qchg')!);
    const dupd = getValue(inputs.find(i => i.label === 'dupd')!);

    let daAction: EditV2 | null;
    const valAction: EditV2[] = [];

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc') &&
      bType === element.getAttribute('bType') &&
      type === element.getAttribute('type') &&
      sAddr === element.getAttribute('sAddr') &&
      valKind === element.getAttribute('valKind') &&
      valImport === element.getAttribute('valImprot') &&
      fc === element.getAttribute('fc') &&
      dchg === element.getAttribute('dchg') &&
      qchg === element.getAttribute('qchg') &&
      dupd === element.getAttribute('dupd')
    ) {
      daAction = null;
    } else {
      daAction = {
        element,
        attributes: {
          name,
          desc,
          bType,
          type,
          sAddr,
          valKind,
          valImport,
          fc,
          dchg,
          qchg,
          dupd,
        },
      };
    }

    if (Val !== (element.querySelector('Val')?.textContent?.trim() ?? null)) {
      valAction.push(
        getValAction(
          element.querySelector('Val'),
          Val,
          daAction?.element ?? element,
        ),
      );
    }

    const actions: EditV2[] = [];
    if (daAction) {
      actions.push(daAction);
    }
    if (valAction) {
      actions.push(...valAction);
    }
    return actions;
  };
}

export function editDAWizard(element: Element): Wizard {
  const doc = element.ownerDocument;

  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const bType = element.getAttribute('bType') ?? '';
  const type = element.getAttribute('type');
  const sAddr = element.getAttribute('sAddr');
  const Val = element.querySelector('Val')?.innerHTML.trim() ?? null;
  const valKind = element.getAttribute('valKind');
  const valImport = element.getAttribute('valImport');
  const fc = element.getAttribute('fc') ?? '';
  const dchg = element.getAttribute('dchg');
  const qchg = element.getAttribute('qchg');
  const dupd = element.getAttribute('dupd');

  const doTypes = Array.from(doc.querySelectorAll('DAType, EnumType')).filter(
    doType => doType.getAttribute('id'),
  );

  const data = element.closest('DataTypeTemplates')!;

  return {
    title: 'Edit DA',
    primary: {
      icon: '',
      label: 'save',
      action: updateDaAction(element),
    },
    content: [
      ...renderAbstractDataAttributeContent(
        name,
        desc,
        bType,
        doTypes,
        type,
        sAddr,
        valKind,
        valImport,
        Val,
        data,
      ),
      ...renderAdditionalDaContent(fc, dchg, qchg, dupd),
    ],
  };
}
