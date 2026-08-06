import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'confirm-backdrop';

      const modal = document.createElement('div');
      modal.className = 'confirm-dialog';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'confirm-title');

      const header = document.createElement('div');
      header.className = 'confirm-header';

      const icon = document.createElement('span');
      icon.className = 'confirm-icon';
      icon.setAttribute('aria-hidden', 'true');

      const title = document.createElement('h3');
      title.id = 'confirm-title';
      title.innerText = 'Confirmation';

      header.appendChild(icon);
      header.appendChild(title);

      const body = document.createElement('p');
      body.className = 'confirm-message';
      body.innerText = message;

      const buttonRow = document.createElement('div');
      buttonRow.className = 'confirm-actions';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'confirm-btn confirm-cancel';
      cancelBtn.innerText = 'Cancel';

      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'confirm-btn confirm-submit';
      confirmBtn.innerText = 'Confirm';

      const container = document.querySelector('.admin-theme') || document.body;

      const cleanup = (value: boolean) => {
        document.removeEventListener('keydown', onKeydown);
        if (container.contains(backdrop)) {
          container.removeChild(backdrop);
        }
        resolve(value);
      };

      const onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          cleanup(false);
        }
      };

      backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
          cleanup(false);
        }
      });

      cancelBtn.onclick = () => cleanup(false);
      confirmBtn.onclick = () => cleanup(true);

      buttonRow.appendChild(cancelBtn);
      buttonRow.appendChild(confirmBtn);
      modal.appendChild(header);
      modal.appendChild(body);
      modal.appendChild(buttonRow);
      backdrop.appendChild(modal);

      container.appendChild(backdrop);
      document.addEventListener('keydown', onKeydown);
      confirmBtn.focus();
    });
  }
}
