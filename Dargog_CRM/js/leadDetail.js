// leadDetail.js — Lead detail view with two-column layout and tabbed history
import Store from './store.js';
import { openEditLeadModal, openAddContactModal } from './modals.js';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function statusBadge(estado) {
  const map = {
    pendiente: { cls: 'badge-pending', text: 'Pendiente de contactar' },
    contactado: { cls: 'badge-contacted', text: 'Contactado' },
    cliente: { cls: 'badge-client', text: 'Cliente' },
    muerto: { cls: 'badge-dead', text: 'Muerto' }
  };
  const s = map[estado] || map.pendiente;
  return `<span class="badge ${s.cls}">${s.text}</span>`;
}

function fieldLabel(key) {
  const labels = { nombre: 'Nombre', apellidos: 'Apellidos', email: 'Email', telefono: 'Teléfono' };
  return labels[key] || key;
}

function renderTimeline(lead) {
  const contacts = [...(lead.contactos || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  if (contacts.length === 0) return '<p class="text-muted text-sm">No hay contactos registrados aún.</p>';
  return `<div class="timeline">${contacts.map(c => {
    const filesHtml = (c.archivos && c.archivos.length > 0)
      ? `<div class="timeline-files">${c.archivos.map(f =>
          `<a class="timeline-file-link" href="${f.data}" download="${f.nombre}">📎 ${f.nombre}</a>`
        ).join('')}</div>` : '';
    return `<div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-header">
        <span class="timeline-via">${c.via}</span>
        <span class="timeline-date">${formatDate(c.fecha)}</span>
      </div>
      <div class="timeline-content">
        ${c.notas ? `<div class="timeline-notes">${c.notas}</div>` : '<div class="timeline-notes text-muted">Sin notas</div>'}
        ${filesHtml}
      </div>
    </div>`;
  }).join('')}</div>`;
}

function renderEditHistory(lead) {
  const edits = [...(lead.historialEdiciones || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  if (edits.length === 0) return '<p class="text-muted text-sm">No hay ediciones registradas.</p>';
  return `<div class="timeline">${edits.map(e => {
    const changesHtml = Object.entries(e.cambios).map(([key, val]) =>
      `<div class="edit-change"><span class="field-name">${fieldLabel(key)}:</span> <span class="old-val">${val.antes || '(vacío)'}</span> → <span class="new-val">${val.despues || '(vacío)'}</span></div>`
    ).join('');
    return `<div class="timeline-item type-edit">
      <div class="timeline-dot"></div>
      <div class="timeline-header"><span class="timeline-date">${formatDateTime(e.fecha)}</span></div>
      <div class="timeline-content">${changesHtml}</div>
    </div>`;
  }).join('')}</div>`;
}

export function renderLeadDetail(leadId, onBack) {
  const lead = Store.getLead(leadId);
  const view = document.getElementById('lead-detail-view');
  if (!lead) { if (onBack) onBack(); return; }

  const estado = Store.calcEstado(lead);
  const last = Store.getLastContact(lead);

  view.innerHTML = `
    <button class="detail-back" id="detail-back">← Volver a leads</button>
    <div class="detail-card">
      <div class="detail-header">
        <div class="detail-header-info">
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
            <h2>${lead.nombre} ${lead.apellidos}</h2>
            <div class="detail-status-control">
              <button class="detail-status-btn" id="status-toggle">${statusBadge(estado)}</button>
              <div class="status-dropdown" id="status-dropdown">
                <button class="status-dropdown-item" data-status="auto">🔄 Automático</button>
                <button class="status-dropdown-item" data-status="cliente">🟢 Cliente</button>
                <button class="status-dropdown-item" data-status="muerto">⚫ Muerto</button>
              </div>
            </div>
          </div>
          <div class="detail-header-meta">
            ${lead.email ? `<span class="detail-meta-item"><span class="meta-icon">✉️</span> ${lead.email}</span>` : ''}
            ${lead.telefono ? `<span class="detail-meta-item"><span class="meta-icon">📞</span> ${lead.telefono}</span>` : ''}
            ${last ? `<span class="detail-meta-item"><span class="meta-icon">📅</span> Último contacto: ${formatDate(last.fecha)}</span>` : ''}
          </div>
        </div>
        <div class="detail-header-actions">
          <button class="btn btn-secondary btn-sm" id="btn-edit-lead">✏️ Editar lead</button>
          <button class="btn btn-primary btn-sm" id="btn-add-contact">+ Añadir contacto</button>
        </div>
      </div>

      <!-- Two-column layout -->
      <div class="detail-body detail-two-col">
        <!-- Left column: Notes -->
        <div class="detail-col-left">
          <div class="detail-section">
            <div class="detail-section-title">📝 Notas generales</div>
            <div class="detail-notes ${!lead.notas ? 'empty' : ''}">${lead.notas || 'Sin notas'}</div>
          </div>
        </div>

        <!-- Right column: History with tabs -->
        <div class="detail-col-right">
          <div class="detail-section">
            <div class="history-tabs">
              <button class="history-tab active" data-tab="contacto">📋 Historial de contacto</button>
              <button class="history-tab" data-tab="ediciones">🕓 Historial de ediciones</button>
            </div>
            <div class="history-panel" id="panel-contacto">
              ${renderTimeline(lead)}
            </div>
            <div class="history-panel" id="panel-ediciones" style="display:none">
              ${renderEditHistory(lead)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Back button
  document.getElementById('detail-back').addEventListener('click', () => { if (onBack) onBack(); });

  // Status dropdown
  const toggleBtn = document.getElementById('status-toggle');
  const dropdown = document.getElementById('status-dropdown');
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('visible');
  });
  document.addEventListener('click', () => dropdown.classList.remove('visible'), { once: true });
  dropdown.querySelectorAll('.status-dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const st = item.dataset.status;
      Store.setEstadoManual(leadId, st === 'auto' ? null : st);
      dropdown.classList.remove('visible');
      renderLeadDetail(leadId, onBack);
    });
  });

  // History tabs
  view.querySelectorAll('.history-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      view.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('panel-contacto').style.display = target === 'contacto' ? '' : 'none';
      document.getElementById('panel-ediciones').style.display = target === 'ediciones' ? '' : 'none';
    });
  });

  // Edit lead
  document.getElementById('btn-edit-lead').addEventListener('click', () => {
    openEditLeadModal(leadId, () => renderLeadDetail(leadId, onBack));
  });

  // Add contact
  document.getElementById('btn-add-contact').addEventListener('click', () => {
    openAddContactModal(leadId, () => renderLeadDetail(leadId, onBack));
  });
}
