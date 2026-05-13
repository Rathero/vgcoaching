// reminders.js — Reminder popup for leads needing follow-up
import Store from './store.js';

let reminderDismissedAt = null; // in-memory only, resets on page load

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function daysAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

export function checkReminders() {
  // Always show on page load — reminderDismissedAt is only in memory
  // so it resets on every new page visit
  if (reminderDismissedAt) {
    const hourMs = 60 * 60 * 1000;
    if ((Date.now() - reminderDismissedAt) < hourMs) return;
  }

  const leads = Store.getLeadsToRemind();
  if (leads.length === 0) return;

  const overlay = document.getElementById('reminder-overlay');
  const container = document.getElementById('reminder-container');

  const rows = leads.map(lead => {
    const last = Store.getLastContact(lead);
    const days = last ? daysAgo(last.fecha) : '—';
    return `<tr>
      <td>${lead.nombre} ${lead.apellidos}</td>
      <td>${last ? formatDate(last.fecha) : '—'} <span class="days-ago">(hace ${days} días)</span></td>
      <td>${last ? last.via : '—'}</td>
    </tr>`;
  }).join('');

  container.innerHTML = `
    <div class="reminder-header">
      <h2>⏰ Leads pendientes de contactar</h2>
      <p>Estos leads llevan más de 2 días sin contacto</p>
    </div>
    <table class="reminder-table">
      <thead><tr><th>Nombre</th><th>Fecha último contacto</th><th>Vía</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="reminder-footer">
      <button class="btn btn-secondary" id="reminder-later">Recordar más tarde</button>
      <button class="btn btn-primary" id="reminder-ok">Okey</button>
    </div>
  `;

  overlay.classList.add('active');

  document.getElementById('reminder-later').addEventListener('click', () => {
    reminderDismissedAt = Date.now();
    overlay.classList.remove('active');
    // Re-show after 1 hour if still on page
    setTimeout(() => checkReminders(), 60 * 60 * 1000);
  });

  document.getElementById('reminder-ok').addEventListener('click', () => {
    overlay.classList.remove('active');
    showToast('Recuerda actualizar la información del último contacto con estos leads');
  });
}
