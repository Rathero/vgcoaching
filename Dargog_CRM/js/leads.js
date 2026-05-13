// leads.js — Main leads table rendering
import Store from './store.js';
import { initDragColumns } from './dragColumns.js';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function statusBadge(estado) {
  const map = {
    pendiente: { cls: 'badge-pending', text: 'Pendiente' },
    contactado: { cls: 'badge-contacted', text: 'Contactado' },
    cliente: { cls: 'badge-client', text: 'Cliente' },
    muerto: { cls: 'badge-dead', text: 'Muerto' }
  };
  const s = map[estado] || map.pendiente;
  return `<span class="badge ${s.cls}">${s.text}</span>`;
}

function getCellValue(lead, colKey) {
  const last = Store.getLastContact(lead);
  switch (colKey) {
    case 'nombre': return lead.nombre || '—';
    case 'apellidos': return lead.apellidos || '—';
    case 'fechaUltimoContacto': return formatDate(last ? last.fecha : null);
    case 'viaUltimoContacto': return last ? last.via : '—';
    case 'estado': return statusBadge(Store.calcEstado(lead));
    case 'email': return lead.email || '—';
    case 'telefono': return lead.telefono || '—';
    default: return '';
  }
}

export function renderLeadsTable(onRowClick) {
  const columns = Store.getColumnOrder();
  const leads = Store.getLeads();
  const table = document.getElementById('leads-table');
  const emptyState = document.getElementById('empty-state');
  const countEl = document.getElementById('leads-count');

  // Count
  if (countEl) countEl.textContent = `${leads.length} lead${leads.length !== 1 ? 's' : ''} en total`;

  // Empty state
  if (leads.length === 0) {
    table.style.display = 'none';
    emptyState.style.display = '';
    return;
  }
  table.style.display = '';
  emptyState.style.display = 'none';

  // Thead
  const thead = table.querySelector('thead');
  thead.innerHTML = '<tr>' + columns.map(col =>
    `<th class="draggable" data-col="${col}">${Store.COLUMN_LABELS[col] || col}</th>`
  ).join('') + '</tr>';

  // Tbody
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = leads.map(lead => {
    const cells = columns.map(col =>
      `<td data-col="${col}">${getCellValue(lead, col)}</td>`
    ).join('');
    return `<tr data-id="${lead.id}">${cells}</tr>`;
  }).join('');

  // Row click events
  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => {
      if (onRowClick) onRowClick(row.dataset.id);
    });
  });

  // Init drag & drop on columns
  initDragColumns(() => renderLeadsTable(onRowClick));
}
