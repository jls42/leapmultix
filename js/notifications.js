/**
 * Notification utilities (ESM)
 * Provides showNotification with a legacy window bridge.
 */
import { createSafeElement } from './security-utils.js';

export function showNotification(type, icon, message) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;

  const iconSpan = createSafeElement('span', String(icon || ''), { class: 'notification-icon' });
  const messageSpan = createSafeElement('span', String(message || ''), {
    class: 'notification-message',
  });

  notification.appendChild(iconSpan);
  notification.appendChild(messageSpan);

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.add('active');
  }, 10);
  setTimeout(() => {
    notification.classList.remove('active');
    setTimeout(() => {
      if (document.body.contains(notification)) document.body.removeChild(notification);
    }, 400);
  }, 6000);
}
export default { showNotification };
