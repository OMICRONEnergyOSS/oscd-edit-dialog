import { LitElement, TemplateResult } from 'lit';
import { EditV2 } from '@omicronenergy/oscd-api';
import { SclCheckbox } from '@openenergytools/scl-checkbox';
import { SclSelect } from '@openenergytools/scl-select';
import { SclTextField } from '@openenergytools/scl-text-field';
import { ActionList } from '@openenergytools/filterable-lists/dist/ActionList.js';
import { SelectionList } from '@openenergytools/filterable-lists/dist/SelectionList.js';
import { MdDialog } from '@scopedelement/material-web/dialog/MdDialog.js';
import { MdFilledSelect } from '@scopedelement/material-web/select/MdFilledSelect.js';
import { MdFilledTextField } from '@scopedelement/material-web/textfield/MdFilledTextField.js';
import { MdIcon } from '@scopedelement/material-web/icon/MdIcon.js';
import { MdIconButton } from '@scopedelement/material-web/iconbutton/MdIconButton.js';
import { MdList } from '@scopedelement/material-web/list/MdList.js';
import { MdListItem } from '@scopedelement/material-web/list/MdListItem.js';
import { MdSelectOption } from '@scopedelement/material-web/select/MdSelectOption.js';
import { MdTextButton } from '@scopedelement/material-web/button/MdTextButton.js';
import { WizardInputElement } from './foundation.js';
type EditWizard = {
    element: Element;
};
type CreateWizard = {
    parent: Element;
    tagName: string;
};
declare const OscdEditDialog_base: typeof LitElement & import("@open-wc/scoped-elements/lit-element.js").ScopedElementsHostConstructor;
export default class OscdEditDialog extends OscdEditDialog_base {
    wizardType: EditWizard | CreateWizard | null;
    private dialogClosePromise;
    static scopedElements: {
        'md-dialog': typeof MdDialog;
        'md-text-button': typeof MdTextButton;
        'scl-checkbox': typeof SclCheckbox;
        'scl-text-field': typeof SclTextField;
        'scl-select': typeof SclSelect;
        'md-filled-textfield': typeof MdFilledTextField;
        'md-filled-select': typeof MdFilledSelect;
        'md-select-option': typeof MdSelectOption;
        'md-icon-button': typeof MdIconButton;
        'md-icon': typeof MdIcon;
        'selection-list': typeof SelectionList;
        'action-list': typeof ActionList;
        'md-list': typeof MdList;
        'md-list-item': typeof MdListItem;
    };
    dialog: MdDialog;
    inputs: WizardInputElement[];
    private checkValidity;
    private reportValidity;
    create(wizardType: CreateWizard): Promise<EditV2[]>;
    edit(wizardType: EditWizard): Promise<EditV2[]>;
    close(): void;
    private act;
    render(): TemplateResult;
    static styles: import("lit").CSSResult;
}
export {};
