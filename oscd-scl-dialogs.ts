import OscdSclDialogs from './OscdSclDialogs.js';

declare global {
  interface HTMLElementTagNameMap {
    'oscd-scl-dialogs': OscdSclDialogs;
  }
}

customElements.define('oscd-scl-dialogs', OscdSclDialogs);
export { OscdSclDialogs };
