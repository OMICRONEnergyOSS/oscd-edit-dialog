import OscdEditDialog from './OscdEditDialog.js';

declare global {
  interface HTMLElementTagNameMap {
    'oscd-edit-dialog': OscdEditDialog;
  }
}

customElements.define('oscd-edit-dialog', OscdEditDialog);
export { OscdEditDialog };
