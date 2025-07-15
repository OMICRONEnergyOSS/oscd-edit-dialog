import { html, TemplateResult } from 'lit';

import {
  SelectionList,
  SelectItem,
} from '@openenergytools/filterable-lists/dist/SelectionList.js';
import { MdList } from '@scopedelement/material-web/list/MdList.js';
import { MdListItem } from '@scopedelement/material-web/list/MdListItem.js';

import { EditV2, Insert } from '@omicronenergy/oscd-api';

import { getReference, lnInstGenerator } from '@openenergytools/scl-lib';

import {
  createElement,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

type LNodeCandidate = {
  anyLn: Element;
  existInScope: boolean;
  existOutOfScope: boolean;
};

// global variables
const selectedIEDs: Element[] = [];
let isLogicalNodeInstance = true;
let isIedListVisable = true;

function lNodeItems(doc: XMLDocument): SelectItem[] {
  return Array.from(
    doc.querySelectorAll(':root > DataTypeTemplates > LNodeType'),
  ).map(lNodeType => {
    const lnClass = lNodeType.getAttribute('lnClass');
    const id = lNodeType.getAttribute('id');

    return {
      headline: `${lnClass}`,
      supportingText: `#${id}`,
      attachedElement: lNodeType,
      selected: false,
      disabled: false,
    };
  });
}

function anyLnAttrs(anyLn: Element): {
  prefix: string;
  lnClass: string;
  inst: string;
  iedName: string;
  ldInst: string;
  lnType: string;
} {
  const prefix = anyLn.getAttribute('prefix') ?? '';
  const lnClass = anyLn.getAttribute('lnClass') ?? '';
  const inst = anyLn.getAttribute('inst') ?? '';
  const lnType = anyLn.getAttribute('lnType') ?? '';

  const iedName = anyLn.closest('IED')?.getAttribute('name') ?? '';
  const ldInst = anyLn.closest('LDevice')?.getAttribute('inst') ?? '';

  return { prefix, lnClass, inst, iedName, ldInst, lnType };
}

function createSelectedItem(lNode: LNodeCandidate): SelectItem {
  const { iedName, ldInst, prefix, lnClass, inst } = anyLnAttrs(lNode.anyLn);

  return {
    headline: `${prefix}${lnClass}${inst}`,
    supportingText: `${iedName} | ${ldInst}`,
    attachedElement: lNode.anyLn,
    selected: lNode.existInScope,
    disabled: lNode.existOutOfScope || lNode.existInScope,
  };
}

function compare(
  a: { anyLn: Element; existOutOfScope: boolean; existInScope: boolean },
  b: { anyLn: Element; existOutOfScope: boolean; existInScope: boolean },
): number {
  if (a.existInScope !== b.existInScope) {
    return a.existInScope ? -1 : 1;
  }

  if (a.existOutOfScope !== b.existOutOfScope) {
    return b.existOutOfScope ? -1 : 1;
  }

  return 0;
}

function lNodeCandidates(parent: Element, anyLn: Element): LNodeCandidate {
  const { iedName, ldInst, prefix, lnClass, inst } = anyLnAttrs(anyLn);

  // const title = `${prefix}${lnClass}${inst}`;

  const lNode = Array.from(
    parent.closest('Substation')?.querySelectorAll('LNode') ?? [],
  ).find(child => {
    if (child.tagName !== 'LNode') {
      return false;
    }
    return (
      child.getAttribute('iedName') === iedName &&
      child.getAttribute('ldInst') === ldInst &&
      (child.getAttribute('prefix') ?? '') === prefix &&
      child.getAttribute('lnClass') === lnClass &&
      (child.getAttribute('lnInst') ?? '') === inst
    );
  });

  const existInScope = !!lNode && lNode.parentElement === parent;
  const existOutOfScope = !!lNode && lNode.parentElement !== parent;

  return { anyLn, existInScope, existOutOfScope };
}

function anyLnItems(parent: Element): SelectItem[] {
  const ldSelector = ':scope > AccessPoint > Server > LDevice';

  return selectedIEDs.flatMap(ied => {
    const anyLns = ied.querySelectorAll(
      `${ldSelector} > LN0, ${ldSelector} > LN`,
    )!;

    return Array.from(anyLns)
      .map(anyLn => lNodeCandidates(parent, anyLn))
      .sort(compare)
      .map(createSelectedItem);
  });
}

function lNodeList(target: HTMLElement): SelectionList {
  return target
    .closest('#createLNodeWizardContent')
    ?.querySelector('#lnList') as SelectionList;
}

function iedContainer(target: HTMLElement): Element {
  return target
    .closest('#createLNodeWizardContent')
    ?.querySelector('#iedContainer') as Element;
}

function showLogicalNodeTypes(evt: Event, parent: Element): void {
  isLogicalNodeInstance = !isLogicalNodeInstance;

  const target = evt.target as HTMLElement;

  if (isLogicalNodeInstance) {
    iedContainer(target).classList.remove('hidden');
  } else {
    iedContainer(target).classList.add('hidden');
  }

  const items = isLogicalNodeInstance
    ? anyLnItems(parent)
    : lNodeItems(parent.ownerDocument);

  lNodeList(target).items = []; // reset for better update performance
  lNodeList(target).items = items;
}

function addIED(evt: Event, ied: Element, sclParent: Element): void {
  const target = evt.target as HTMLElement;
  if (selectedIEDs.includes(ied)) {
    const index = selectedIEDs.indexOf(ied);
    selectedIEDs.splice(index, 1);
    // Updated list items
    (target.closest('md-list-item') as MdListItem).activated = false;
  } else {
    selectedIEDs.push(ied);
    // Updated list items
    (target.closest('md-list-item') as MdListItem).activated = true;
  }

  lNodeList(target).items = [];
  lNodeList(target).items = anyLnItems(sclParent);
}

function renderIEDItems(parent: Element): TemplateResult[] {
  const doc = parent.ownerDocument;

  return Array.from(doc.querySelectorAll(':root > IED')).map(ied => {
    const [iedName, manufacturer] = ['name', 'manufacturer'].map(value =>
      ied.getAttribute(value),
    );

    return html`<md-list-item
      .activated=${selectedIEDs.includes(ied)}
      type="button"
      @click="${(evt: Event) => {
        addIED(evt, ied, parent);
      }}"
    >
      <div slot="headline">${iedName ?? 'unknown IED'}</div>
      <div slot="supporting-text">
        ${manufacturer ?? 'unknown manufacturer'}
      </div>
    </md-list-item>`;
  });
}

function showIEdFilterList(evt: Event): void {
  isIedListVisable = !isIedListVisable;

  const ieds = (evt.target as HTMLElement)
    .closest('#createLNodeWizardContent')
    ?.querySelector('#iedList') as MdList;

  if (!isIedListVisable) {
    ieds.classList.remove('hidden');
  } else {
    ieds.classList.add('hidden');
  }
}

function createAction(parent: Element): WizardActor {
  function createSingleLNode(lNode: Element): Insert | null {
    if (lNode.tagName === 'LNodeType') {
      const lnClass = lNode.getAttribute('lnClass');
      if (!lnClass) {
        return null;
      }

      const lnType = lNode.getAttribute('id');
      const lnInst = lnInstGenerator(parent, 'LNode')(lnClass);
      if (!lnInst) {
        return null;
      }

      const node = createElement(parent.ownerDocument, 'LNode', {
        iedName: 'None',
        lnClass,
        lnInst,
        lnType,
      });

      return {
        parent,
        node,
        reference: getReference(parent, 'LNode'),
      };
    }

    const { iedName, ldInst, prefix, lnClass, inst, lnType } =
      anyLnAttrs(lNode);
    const node = createElement(parent.ownerDocument, 'LNode', {
      iedName,
      ldInst,
      prefix,
      lnClass,
      lnInst: inst,
      lnType,
    });

    return {
      parent,
      node,
      reference: getReference(parent, 'LNode'),
    };
  }

  return (_: WizardInputElement[], wizard: Element): EditV2[] => {
    const list = wizard.querySelector('#lnList') as SelectionList;

    const selectedLNs = list.items
      .filter(item => item.selected)
      .filter(item => !item.disabled)
      .map(item => item.attachedElement!);

    return selectedLNs
      .map(lNode => createSingleLNode(lNode))
      .filter(insert => insert) as Insert[];
  };
}

export function createLNodeWizard(parent: Element): Wizard {
  // const iedNames = Array.from(parent.children)
  //   .filter(child => child.tagName === 'LNode' && child.getAttribute('iedName'))
  //   .map(lNode => lNode.getAttribute('iedName')!);

  return {
    title: 'Add LNode',
    primary: {
      icon: 'save',
      label: 'save',
      action: createAction(parent),
    },
    content: [
      html`<div id="createLNodeWizardContent" style="min-height: fit-content;">
        <style>
          .hidden {
            display: none;
          }
        </style>
        <div
          id="radioContainer"
          style="display: flex; align-items: center; gap: 16px;"
        >
          <label
            style="display: flex; align-items: center; cursor: pointer; font-size: 14px;"
          >
            <input
              type="radio"
              name="nodeType"
              value="type"
              style="margin-right: 8px; cursor: pointer;"
              @change="${(evt: Event) => showLogicalNodeTypes(evt, parent)}"
              checked
            />
            Logical Node Type
          </label>
          <label
            style="display: flex; align-items: center; cursor: pointer; font-size: 14px;"
          >
            <input
              type="radio"
              name="nodeType"
              value="instance"
              style="margin-right: 8px; cursor: pointer;"
              @change="${(evt: Event) => showLogicalNodeTypes(evt, parent)}"
            />
            Logical Node Instance
          </label>
        </div>
        <div style="display: flex; flex-direction: row;">
          <div id="iedContainer">
            s
            <div
              id="iedFilterButton"
              tabindex="0"
              style="cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border: 1px solid #ccc; border-radius: 4px; margin-top: 20px;"
              @click="${showIEdFilterList}"
              @keydown="${(evt: KeyboardEvent) => {
                if (evt.key === 'Enter' || evt.key === ' ') {
                  evt.preventDefault();
                  showIEdFilterList(evt);
                }
              }}"
            >
              <md-icon>filter_list</md-icon>
            </div>
            <md-list id="iedList"> ${renderIEDItems(parent)} </md-list>
          </div>
          <selection-list
            id="lnList"
            multi
            .items=${anyLnItems(parent)}
            filterable
          ></selection-list>
        </div>
      </div>`,
    ],
  };
}
