export enum OscdEditDialogEvents {
  CREATE_EVENT = 'oscd-edit-dialog-create',
  EDIT_EVENT = 'oscd-edit-dialog-edit',
  CLOSE_EVENT = 'oscd-edit-dialog-close',
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

export function newEditDialogEditEvent(
  element: Element,
  eventInitDict?: CustomEventInit<Partial<EditEventDetails>>,
): EditDialogEditEvent {
  return new CustomEvent<EditEventDetails>(OscdEditDialogEvents.EDIT_EVENT, {
    bubbles: true,
    composed: true,
    ...eventInitDict,
    detail: { element },
  });
}

export function newEditDialogCreateEvent(
  parent: Element,
  tagName: string,
  eventInitDict?: CustomEventInit<Partial<CreateEventDetails>>,
): EditDialogCreateEvent {
  return new CustomEvent<CreateEventDetails>(
    OscdEditDialogEvents.CREATE_EVENT,
    {
      bubbles: true,
      composed: true,
      ...eventInitDict,
      detail: {
        parent,
        tagName,
      },
    },
  );
}

export function newEditDialogCloseEvent(
  detail: EditDialogEventDetails,
  eventInitDict?: CustomEventInit<Partial<EditDialogEventDetails>>,
): EditDialogCloseEvent {
  return new CustomEvent<EditDialogEventDetails>(
    OscdEditDialogEvents.CLOSE_EVENT,
    {
      bubbles: true,
      composed: true,
      ...eventInitDict,
      detail,
    },
  );
}

declare global {
  interface ElementEventMap {
    [OscdEditDialogEvents.EDIT_EVENT]: EditEventDetails;
    [OscdEditDialogEvents.CREATE_EVENT]: CreateEventDetails;
    [OscdEditDialogEvents.CLOSE_EVENT]: EditDialogEvent;
  }
}
