import { LitElement } from 'lit';
import type WizardDialog from '../OscdEditDialog.js';
import '../oscd-edit-dialog.js';
import { XMLEditor } from '@omicronenergy/oscd-editor';
export default class TriggerWizard extends LitElement {
    doc: XMLDocument;
    editor: XMLEditor;
    docsState: unknown;
    newTagName: HTMLSelectElement;
    parentSelector: HTMLInputElement;
    childinput: HTMLInputElement;
    tagSelector: HTMLInputElement;
    editDialog: WizardDialog;
    triggerWizardCreate(): Promise<void>;
    triggerWizardEdit(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
