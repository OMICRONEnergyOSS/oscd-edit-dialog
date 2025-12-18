import { TemplateResult } from 'lit';
import { EditV2 } from '@openscd/oscd-api';
interface AddressContentOptions {
    element: Element;
    types: string[];
}
export declare function existDiff(oldAddr: Element, newAddr: Element): boolean;
export declare function createAddressElement(parent: Element, inputs: Record<string, string | null>, instType: boolean): Element;
export declare function updateAddress(parent: Element, inputs: Record<string, string | null>, instType: boolean): EditV2[];
export declare function hasTypeRestriction(element: Element): boolean;
export declare function contentAddress(content: AddressContentOptions): TemplateResult[];
export {};
