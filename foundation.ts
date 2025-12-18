import { TemplateResult } from 'lit';

import { EditV2 } from '@openscd/oscd-api';
import { MdFilledSelect } from '@scopedelement/material-web/select/MdFilledSelect';
import { MdFilledTextField } from '@scopedelement/material-web/textfield/MdFilledTextField';
import { SclCheckbox } from '@openenergytools/scl-checkbox';
import { SclSelect } from '@openenergytools/scl-select';
import { SclTextField } from '@openenergytools/scl-text-field';

export type WizardInputElement =
  | SclTextField
  | SclSelect
  | SclCheckbox
  | MdFilledTextField
  | MdFilledSelect;

export type WizardActor = (
  inputs: WizardInputElement[],
  wizard: Element,
) => EditV2[];

export interface Wizard {
  title: string;
  content?: TemplateResult[];
  primary?: {
    icon: string;
    label: string;
    action: WizardActor;
    auto?: boolean;
  };
  secondary?: {
    icon: string;
    label: string;
  };
}

/** @returns the `value` or `maybeValue` of `input` depending on type. */
export function getValue(input: WizardInputElement): string | null {
  return input.value;
}

/** @returns a new [[`tag`]] element owned by [[`doc`]]. */
export function createElement(
  doc: Document,
  tag: string,
  attrs: Record<string, string | null>,
): Element {
  const element = doc.createElementNS(doc.documentElement.namespaceURI, tag);
  Object.entries(attrs)
    .filter(([_, value]) => value !== null)
    .forEach(([name, value]) => element.setAttribute(name, value!));
  return element;
}

export function getChildElementsByTagName(
  parent: Element | null | undefined,
  tag: string | null | undefined,
): Element[] {
  if (!parent || !tag) {
    return [];
  }
  return Array.from(parent.children).filter(element => element.tagName === tag);
}

/** @returns reserved siblings names attributes */
export function reservedNames(element: Element, tagName?: string): string[] {
  if (tagName) {
    return getChildElementsByTagName(element, tagName).map(
      sibling => sibling.getAttribute('name')!,
    );
  }

  if (!element.parentElement) {
    return [];
  }
  return getChildElementsByTagName(element.parentElement, element.tagName)
    .filter(sibling => sibling !== element)
    .map(sibling => sibling.getAttribute('name')!);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSclTextfield(type: any): type is SclTextField {
  return 'value' in type && 'multiplier' in type;
}

/** @returns the `multiplier` of `input` if available. */
export function getMultiplier(input: WizardInputElement): string | null {
  if (isSclTextfield(input)) {
    return input.multiplier;
  }
  return null;
}

/** @returns a clone of `element` with attributes set to values from `attrs`. */
export function cloneElement(
  element: Element,
  attrs: Record<string, string | null>,
): Element {
  const newElement = <Element>element.cloneNode(false);
  Object.entries(attrs).forEach(([name, value]) => {
    if (value === null) {
      newElement.removeAttribute(name);
    } else {
      newElement.setAttribute(name, value);
    }
  });
  return newElement;
}

/** @returns the cartesian product of `arrays` */
export function crossProduct<T>(...arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (a, b) => <T[][]>a.flatMap(d => b.map(e => [d, e].flat())),
    [[]],
  );
}

/** Whether `P` element is required within `Address` */
export const typeNullable: Partial<Record<string, boolean>> = {
  IP: false,
  'IP-SUBNET': false,
  'IP-GATEWAY': true,
  'OSI-TSEL': true,
  'OSI-SSEL': true,
  'OSI-PSEL': true,
  'OSI-AP-Title': true,
  'OSI-AP-Invoke': true,
  'OSI-AE-Qualifier': true,
  'OSI-AE-Invoke': true,
  'OSI-NSAP': true,
  'MAC-Address': false,
  APPID: false,
  'VLAN-ID': true,
  'VLAN-PRIORITY': true,
  'SNTP-Port': true,
  'MMS-Port': true,
  DNSName: true,
  'UDP-Port': true,
  'TCP-Port': true,
  'C37-118-IP-Port': true,
  IPv6: true,
  'IPv6-SUBNET': true,
  'IPv6-GATEWAY': true,
  IPv6FlowLabel: true,
  IPv6ClassOfTraffic: true,
  'IPv6-IGMPv3Src': true,
  'IP-IGMPv3Sr': true,
  'IP-ClassOfTraffic': true,
};

export function getTypes(element: Element): string[] {
  if (!element.ownerDocument.documentElement) {
    return [];
  }

  const pTypes2003: string[] = [
    'IP',
    'IP-SUBNET',
    'IP-GATEWAY',
    'OSI-TSEL',
    'OSI-SSEL',
    'OSI-PSEL',
    'OSI-AP-Title',
    'OSI-AP-Invoke',
    'OSI-AE-Qualifier',
    'OSI-AE-Invoke',
    'OSI-NSAP',
    'VLAN-ID',
    'VLAN-PRIORITY',
  ];

  const pTypes2007B: string[] = [
    ...pTypes2003,
    'SNTP-Port',
    'MMS-Port',
    'DNSName',
    'UDP-Port',
    'TCP-Port',
    'C37-118-IP-Port',
  ];

  const pTypes2007B4: string[] = [
    ...pTypes2007B,
    'IPv6',
    'IPv6-SUBNET',
    'IPv6-GATEWAY',
    'IPv6FlowLabel',
    'IPv6ClassOfTraffic',
    'IPv6-IGMPv3Src',
    'IP-IGMPv3Sr',
    'IP-ClassOfTraffic',
  ];

  const scl: Element = element.ownerDocument.documentElement;

  const type =
    (scl.getAttribute('version') ?? '2003') +
    (scl.getAttribute('revision') ?? '') +
    (scl.getAttribute('release') ?? '');

  if (type === '2003') {
    return pTypes2003;
  }

  if (type === '2007B') {
    return pTypes2007B;
  }

  return pTypes2007B4;
}

/** Sorts selected `ListItem`s to the top and disabled ones to the bottom. */
export function compareNames(a: Element | string, b: Element | string): number {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  if (typeof a === 'object' && typeof b === 'string') {
    return (a.getAttribute('name') ?? '').localeCompare(b);
  }

  if (typeof a === 'string' && typeof b === 'object') {
    return a.localeCompare(b.getAttribute('name')!);
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return (a.getAttribute('name') ?? '').localeCompare(
      b.getAttribute('name') ?? '',
    );
  }

  return 0;
}
