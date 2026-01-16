import { CreateWizard, EditWizard } from './OscdSclDialogs.js';
export declare enum OscdEditDialogEvents {
    CREATE_EVENT = "oscd-scl-dialogs-create",
    EDIT_EVENT = "oscd-scl-dialogs-edit",
    CLOSE_EVENT = "oscd-scl-dialogs-close"
}
export declare function newEditDialogEditEvent(element: Element, eventInitDict?: CustomEventInit<Partial<EditWizard>>): CustomEvent<EditWizard>;
export declare function newEditDialogCreateEvent(parent: Element, tagName: string, eventInitDict?: CustomEventInit<Partial<CreateWizard>>): CustomEvent<CreateWizard>;
export declare function newEditDialogCloseEvent(detail: EditWizard, eventInitDict?: CustomEventInit<Partial<EditWizard>>): CustomEvent<EditWizard>;
declare global {
    interface ElementEventMap {
        [OscdEditDialogEvents.EDIT_EVENT]: CustomEvent<EditWizard>;
        [OscdEditDialogEvents.CREATE_EVENT]: CustomEvent<CreateWizard>;
        [OscdEditDialogEvents.CLOSE_EVENT]: CustomEvent<EditWizard>;
    }
}
