import { TemplateResult } from 'lit';
import { EditV2 } from '@openscd/oscd-api';
import { MdFilledSelect } from '@scopedelement/material-web/select/MdFilledSelect';
import { MdFilledTextField } from '@scopedelement/material-web/textfield/MdFilledTextField';
import { SclCheckbox } from '@openenergytools/scl-checkbox';
import { SclSelect } from '@openenergytools/scl-select';
import { SclTextField } from '@openenergytools/scl-text-field';
export type WizardInputElement = SclTextField | SclSelect | SclCheckbox | MdFilledTextField | MdFilledSelect;
export type WizardActor = (inputs: WizardInputElement[], wizard: Element) => EditV2[];
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
export declare function getValue(input: WizardInputElement): string | null;
/** @returns a new [[`tag`]] element owned by [[`doc`]]. */
export declare function createElement(doc: Document, tag: string, attrs: Record<string, string | null>): Element;
export declare function getChildElementsByTagName(parent: Element | null | undefined, tag: string | null | undefined): Element[];
/** @returns reserved siblings names attributes */
export declare function reservedNames(element: Element, tagName?: string): string[];
export declare function isSclTextfield(type: any): type is SclTextField;
/** @returns the `multiplier` of `input` if available. */
export declare function getMultiplier(input: WizardInputElement): string | null;
/** @returns a clone of `element` with attributes set to values from `attrs`. */
export declare function cloneElement(element: Element, attrs: Record<string, string | null>): Element;
/** @returns the cartesian product of `arrays` */
export declare function crossProduct<T>(...arrays: T[][]): T[][];
/** Whether `P` element is required within `Address` */
export declare const typeNullable: Partial<Record<string, boolean>>;
export declare function getTypes(element: Element): string[];
/** Sorts selected `ListItem`s to the top and disabled ones to the bottom. */
export declare function compareNames(a: Element | string, b: Element | string): number;
