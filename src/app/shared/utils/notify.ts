import Swal from 'sweetalert2';

/**
 * Messages and questions shown to the user, as proper popups instead of the browser's plain
 * alert()/confirm() boxes (which show "localhost:4200 says" and can't be styled).
 */

/** Success: closes by itself after 2 seconds. */
export function notifySuccess(text: string, title = 'Success'): Promise<unknown> {
  return Swal.fire({ icon: 'success', title, text, timer: 2000, timerProgressBar: true, showConfirmButton: false });
}

/** Something went wrong: stays until the user presses OK. */
export function notifyError(text: string, title = 'Error'): Promise<unknown> {
  return Swal.fire({ icon: 'error', title, text, confirmButtonText: 'OK' });
}

/** The user needs to fix something first (e.g. pick a role). */
export function notifyWarning(text: string, title = 'Please check'): Promise<unknown> {
  return Swal.fire({ icon: 'warning', title, text, confirmButtonText: 'OK' });
}

/** Asks a yes/no question; resolves true only if the user confirms. */
export function confirmAction(options: {
  title: string;
  text?: string;
  confirmText?: string;
  danger?: boolean;
}): Promise<boolean> {
  return Swal.fire({
    icon: options.danger ? 'warning' : 'question',
    title: options.title,
    text: options.text,
    showCancelButton: true,
    confirmButtonText: options.confirmText ?? 'Yes',
    cancelButtonText: 'Cancel',
    confirmButtonColor: options.danger ? '#d33' : undefined,
    focusCancel: !!options.danger
  }).then((result) => result.isConfirmed);
}
