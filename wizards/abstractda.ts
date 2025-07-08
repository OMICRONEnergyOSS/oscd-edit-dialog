import { html, TemplateResult } from 'lit';

import { MdFilledSelect } from '@scopedelement/material-web/select/MdFilledSelect.js';
import { MdSelectOption } from '@scopedelement/material-web/select/MdSelectOption.js';

import { EditV2 } from '@omicronenergy/oscd-api';

import { SclSelect } from '@openenergytools/scl-select';
import { SclTextField } from '@openenergytools/scl-text-field';

import { getReference } from '@openenergytools/scl-lib';

import { createElement } from '../foundation.js';

import {
  maxLength,
  patterns,
  predefinedBasicTypeEnum,
  valKindEnum,
} from './patterns.js';

function setSelValue(
  typeInput: MdFilledSelect,
  data: Element,
  Val: string | null,
): void {
  const typeValue = typeInput.value;

  const selValInput = typeInput.parentElement!.querySelector(
    'scl-select[label="Val"]',
  ) as SclSelect;

  // If enum make sure to load select Val
  const enumVals = Array.from(
    data.querySelectorAll(`EnumType[id="${typeValue}"] > EnumVal`),
  ).map(enumval => enumval.textContent?.trim() ?? '');
  selValInput.selectOptions = enumVals;
  selValInput.value = Val;

  selValInput.requestUpdate();
}

function changeType(e: Event, data: Element, Val: string | null): void {
  if (!e.target || !(e.target as SclSelect).parentElement) {
    return;
  }

  // Query all needed inputs
  const typeInput = e.target as MdFilledSelect;
  const bTypeInput = typeInput.parentElement!.querySelector(
    'scl-select[label="bType"]',
  ) as SclSelect;

  //TODO: declared but not used - figure out if it's needed and the implementation is incomplete, or just a copy paste oversight
  // const selValInput = typeInput.parentElement!.querySelector(
  //   'scl-select[label="Val"]'
  // ) as SclSelect;

  // Get values
  // const typeValue = typeInput.value;
  const bTypeValue = bTypeInput.value;

  if (bTypeValue !== 'Enum') {
    return;
  }

  setSelValue(typeInput, data, Val);
}

function changeBType(
  e: Event,
  bType: string | null,
  type: string | null,
  data: Element,
): void {
  // Query all needed inputs
  const bTypeInput = e.target as SclSelect;
  const typeInput = bTypeInput.parentElement!.querySelector(
    '*[label="type"]',
  ) as MdFilledSelect;
  const selValInput = bTypeInput.parentElement!.querySelector(
    'scl-select[label="Val"]',
  ) as SclSelect;
  const textValInput = bTypeInput.parentElement!.querySelector(
    'scl-text-field[label="Val"]',
  ) as SclTextField;

  // Get necassary values
  const bTypeValue = bTypeInput.value!;

  // Disable/enable inputs based on bType
  typeInput.disabled = !(bTypeValue === 'Enum' || bTypeValue === 'Struct');
  if (typeInput.disabled) {
    typeInput.value = '';
  }

  // Hide/show EnumType/DAType based on bType selection
  const enabledItems: MdSelectOption[] = [];
  Array.from(typeInput.children).forEach((child) => {
    const childItem = child as MdSelectOption;
    childItem.disabled = !child.classList.contains(bTypeValue);
    childItem.style.display = !child.classList.contains(bTypeValue)
      ? 'none'
      : '';
    if (!childItem.disabled) {
      enabledItems.push(childItem);
    }
  });

  // Set the type input value to the first enabled item or empty if none
  if (type && bType === bTypeValue) {
    typeInput.value = type;
  } else {
    typeInput.value = enabledItems.length ? enabledItems[0].value : '';
  }

  // Hide/show Val input based on bType selection
  if (bTypeValue === 'Enum') {
    selValInput.style.display = '';
  } else {
    selValInput.style.display = 'none';
  }
  setSelValue(typeInput, data, null);

  // Hide/show Val input based on bType selection
  if (bTypeValue === 'Enum' || bTypeValue === 'Struct') {
    textValInput.style.display = 'none';
  } else {
    textValInput.style.display = '';
  }

  // Update inputs
  selValInput.requestUpdate();
  textValInput.requestUpdate();
  typeInput.requestUpdate();
}

function filterType(bType: string, tag: string): string {
  if (bType === 'Enum' || tag === 'EnumType') {
    return '';
  }
  if (bType === 'Struct' || tag === 'DAType') {
    return '';
  }
  if (bType === 'Enum' || tag === 'DAType') {
    return 'none';
  }

  return 'none';
}

export function renderAbstractDataAttributeContent(
  name: string | null,
  desc: string | null,
  bType: string,
  types: Element[],
  type: string | null,
  sAddr: string | null,
  valKind: string | null,
  valImport: string | null,
  Val: string | null,
  data: Element,
): TemplateResult[] {
  return [
    html`<scl-text-field
      label="name"
      .value=${name}
      required
      pattern="${patterns.abstractDataAttributeName}"
      maxLength="${maxLength.abstracDaName}"
    ></scl-text-field>`,
    html`<scl-text-field
      label="desc"
      .value=${desc}
      nullable
      pattern="${patterns.normalizedString}"
    ></scl-text-field>`,
    html`<scl-select
      label="bType"
      .selectOptions=${predefinedBasicTypeEnum}
      .value=${bType}
      required
      @input=${(e: Event) => changeBType(e, bType, type, data)}
    ></scl-select>`,
    html`<md-filled-select
      label="type"
      .value=${type}
      .disabled=${bType !== 'Enum' && bType !== 'Struct'}
      @change=${(e: Event) => changeType(e, data, Val)}
      >${types.map(
        dataType =>
          html`<md-select-option
            class="${dataType.tagName === 'EnumType' ? 'Enum' : 'Struct'}"
            style="display: ${filterType(bType, dataType.tagName)}"
            value=${dataType.id}
            >${dataType.id}</md-select-option
          >`,
      )}</md-filled-select
    >`,
    html`<scl-text-field
      label="sAddr"
      .value=${sAddr}
      nullable
      pattern="${patterns.normalizedString}"
    ></scl-text-field>`,
    html`<scl-select
      label="valKind"
      .selectOptions=${valKindEnum}
      .value=${valKind}
      nullable
      required
    ></scl-select>`,
    html`<scl-checkbox
      label="valImport"
      .value=${valImport}
      nullable
      required
    ></scl-checkbox>`,
    html`<scl-select
      label="Val"
      .selectOptions=${Array.from(
        data.querySelectorAll(
          `:root > DataTypeTemplates > EnumType > EnumVal[id="${type}"]`,
        ),
      ).map(enumVal => enumVal.textContent?.trim() ?? '')}
      .value=${Val}
      nullable
      style="display: ${bType === 'Enum' ? '' : 'none'}"
    ></scl-select>`,
    html`<scl-text-field
      label="Val"
      .value=${Val}
      nullable
      style="display: ${bType === 'Enum' || bType === 'Struct' ? 'none' : ''}"
    ></scl-text-field>`,
  ];
}

export function getValAction(
  oldVal: Element | null,
  Val: string | null,
  abstractda: Element,
): EditV2[] {
  if (oldVal === null) {
    const element = createElement(abstractda.ownerDocument, 'Val', {});
    element.textContent = Val;
    return [
      {
        parent: abstractda,
        node: element,
        reference: getReference(abstractda, 'Val'),
      },
    ];
  }

  if (Val === null) {
    return [{ node: oldVal }];
  }

  const newVal = <Element>oldVal.cloneNode(false);
  newVal.textContent = Val;
  return [
    {
      parent: oldVal.parentElement!,
      node: newVal,
      reference: getReference(oldVal.parentElement!, 'Val'),
    },
    { node: oldVal },
  ];
}
