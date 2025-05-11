/* eslint-disable import/no-duplicates */
import { html, LitElement, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';

import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

import WizardDialog from './WizardDialog.js';

export default class TriggerWizard extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'wizard-dialog': WizardDialog,
  };

  @property()
  doc!: XMLDocument;

  @query('#tag') input!: HTMLInputElement;

  @query('#parenttag') parentinput!: HTMLInputElement;

  @query('#childtag') childinput!: HTMLInputElement;

  @query('#wizard') wizard!: WizardDialog;

  triggerEditWizard(): void {
    const element = this.doc.querySelector(this.input.value);
    if (!element) return;
    this.wizard.wizardType = { element };
    this.wizard.show();
  }

  triggerCreateWizard(): void {
    const parent = this.doc.querySelector(this.parentinput.value);
    if (!parent) return;

    const tagName = this.childinput.value;
    this.wizard.wizardType = { parent, tagName };
    this.wizard.show();
  }

  render(): TemplateResult {
    return html`<wizard-dialog id="wizard"></wizard-dialog>
      <input id="tag" name="tagname" />
      <button @click="${this.triggerEditWizard}">edit</button>
      <input id="parenttag" name="parentTag" />
      <input id="childtag" name="childTag" />
      <button @click="${this.triggerCreateWizard}">edit</button>`;
  }
}
