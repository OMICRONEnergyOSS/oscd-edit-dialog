import { TemplateResult } from 'lit';
import { EditV2 } from '@omicronenergy/oscd-api';
export declare function renderAbstractDataAttributeContent(name: string | null, desc: string | null, bType: string, types: Element[], type: string | null, sAddr: string | null, valKind: string | null, valImport: string | null, Val: string | null, data: Element): TemplateResult[];
export declare function getValAction(oldVal: Element | null, Val: string | null, abstractda: Element): EditV2[];
