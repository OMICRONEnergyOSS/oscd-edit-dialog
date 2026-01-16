import { CreateWizard, EditWizard } from './OscdSclDialogs.js';

export enum OscdEditDialogEvents {
  CREATE_EVENT = 'oscd-scl-dialogs-create',
  EDIT_EVENT = 'oscd-scl-dialogs-edit',
  CLOSE_EVENT = 'oscd-scl-dialogs-close',
}

export function newEditDialogEditEvent(
  element: Element,
  eventInitDict?: CustomEventInit<Partial<EditWizard>>,
): CustomEvent<EditWizard> {
  return new CustomEvent<EditWizard>(OscdEditDialogEvents.EDIT_EVENT, {
    bubbles: true,
    composed: true,
    ...eventInitDict,
    detail: { element },
  });
}

export function newEditDialogCreateEvent(
  parent: Element,
  tagName: string,
  eventInitDict?: CustomEventInit<Partial<CreateWizard>>,
): CustomEvent<CreateWizard> {
  return new CustomEvent<CreateWizard>(OscdEditDialogEvents.CREATE_EVENT, {
    bubbles: true,
    composed: true,
    ...eventInitDict,
    detail: {
      parent,
      tagName,
    },
  });
}

export function newEditDialogCloseEvent(
  detail: EditWizard,
  eventInitDict?: CustomEventInit<Partial<EditWizard>>,
): CustomEvent<EditWizard> {
  return new CustomEvent<EditWizard>(OscdEditDialogEvents.CLOSE_EVENT, {
    bubbles: true,
    composed: true,
    ...eventInitDict,
    detail,
  });
}

declare global {
  interface ElementEventMap {
    [OscdEditDialogEvents.EDIT_EVENT]: CustomEvent<EditWizard>;
    [OscdEditDialogEvents.CREATE_EVENT]: CustomEvent<CreateWizard>;
    [OscdEditDialogEvents.CLOSE_EVENT]: CustomEvent<EditWizard>;
  }
}
