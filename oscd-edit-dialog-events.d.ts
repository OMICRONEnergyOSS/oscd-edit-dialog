export declare enum OscdEditDialogEvents {
    CREATE_EVENT = "oscd-edit-dialog-create",
    EDIT_EVENT = "oscd-edit-dialog-edit",
    CLOSE_EVENT = "oscd-edit-dialog-close"
}
export interface EditEventDetails {
    element: Element;
}
export interface CreateEventDetails {
    parent: Element;
    tagName: string;
}
export type EditDialogEventDetails = EditEventDetails | CreateEventDetails;
export type EditDialogEditEvent = CustomEvent<EditEventDetails>;
export type EditDialogCreateEvent = CustomEvent<CreateEventDetails>;
export type EditDialogEvent = EditDialogEditEvent | EditDialogCreateEvent;
type EditDialogCloseEvent = CustomEvent<EditDialogEventDetails>;
export declare function newEditDialogEditEvent(element: Element, eventInitDict?: CustomEventInit<Partial<EditEventDetails>>): EditDialogEditEvent;
export declare function newEditDialogCreateEvent(parent: Element, tagName: string, eventInitDict?: CustomEventInit<Partial<CreateEventDetails>>): EditDialogCreateEvent;
export declare function newEditDialogCloseEvent(detail: EditDialogEventDetails, eventInitDict?: CustomEventInit<Partial<EditDialogEventDetails>>): EditDialogCloseEvent;
declare global {
    interface ElementEventMap {
        [OscdEditDialogEvents.EDIT_EVENT]: EditEventDetails;
        [OscdEditDialogEvents.CREATE_EVENT]: CreateEventDetails;
        [OscdEditDialogEvents.CLOSE_EVENT]: EditDialogEvent;
    }
}
export {};
