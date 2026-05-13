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
    perdido: { cls: 'badge-dead', text: 'Perdido' },
    reunion_agendada: { cls: 'badge-contacted', text: 'Reunión agendada' },
    esperando_info: { cls: 'badge-pending', text: 'Esperando info de perfil' }
  };
  const s = map[estado] || map.pendiente;
  return `<span class="badge ${s.cls}">${s.text}</span>`;
}

function fieldLabel(key) {
  const labels = { nombre: 'Nombre', apellidos: 'Apellidos', email: 'Email', telefono: 'Teléfono' };
  return labels[key] || key;
}

function renderTimelineContacts(lead) {
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
        <span class="timeline-date">${formatDateTime(c.fecha)}</span>
      </div>
      <div class="timeline-content">
        <div class="edit-change">
          <span class="field-name">Añadido contacto (${c.via}):</span><br/>
          <span class="new-val" style="color: #10b981;">Nuevo: ${c.notas ? c.notas : '(Sin notas)'}</span>
        </div>
        ${filesHtml}
      </div>
    </div>`;
  }).join('')}</div>`;
}

function renderTimelineEdits(lead) {
  const edits = [...(lead.historialEdiciones || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  if (edits.length === 0) return '<p class="text-muted text-sm">No hay cambios registrados aún.</p>';
  return `<div class="timeline">${edits.map(e => {
    const changesHtml = Object.entries(e.cambios).map(([key, val]) => {
      let label = fieldLabel(key);
      if (key === 'postSubido') label = 'Post subido';
      if (key === 'estadoManual') label = 'Estado manual';
      return `<div class="edit-change">
        <span class="field-name">Cambio en ${label}:</span><br/>
        <span class="old-val" style="color: #ef4444;">Antes: ${val.antes !== undefined && val.antes !== null && val.antes !== '' ? val.antes : '(vacío)'}</span><br/>
        <span class="new-val" style="color: #10b981;">Nuevo: ${val.despues !== undefined && val.despues !== null && val.despues !== '' ? val.despues : '(vacío)'}</span>
      </div>`;
    }).join('');
    return `<div class="timeline-item type-edit" style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px;">
      <div class="timeline-dot" style="background: var(--text-muted)"></div>
      <div class="timeline-header"><span class="timeline-date" style="color: var(--text-muted)">${formatDateTime(e.fecha)}</span></div>
      <div class="timeline-content" style="margin-top: 8px;">${changesHtml}</div>
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
                <button class="status-dropdown-item" data-status="reunion_agendada">📅 Reunión agendada</button>
                <button class="status-dropdown-item" data-status="esperando_info">⏳ Esperando info de perfil</button>
                <button class="status-dropdown-item" data-status="perdido">⚫ Perdido</button>
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
          <div class="detail-section" style="margin-bottom: 20px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
              <input type="checkbox" id="checkbox-post-subido" ${lead.postSubido ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
              Post subido
            </label>
          </div>
          <div class="detail-section">
            <div class="detail-section-title">📝 Notas generales</div>
            <div class="detail-notes ${!lead.notas ? 'empty' : ''}">${lead.notas || 'Sin notas'}</div>
          </div>
        </div>

        <!-- Right column: History with tabs -->
        <div class="detail-col-right">
          <div class="detail-section">
            <div class="history-tabs">
              <button class="history-tab active" data-tab="contacto">📋 Historial contactos</button>
              <button class="history-tab" data-tab="cambios">🕓 Historial cambios</button>
            </div>
            <div class="history-panel" id="panel-contacto">
              ${renderTimelineContacts(lead)}
            </div>
            <div class="history-panel" id="panel-cambios" style="display:none">
              ${renderTimelineEdits(lead)}
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
      document.getElementById('panel-cambios').style.display = target === 'cambios' ? '' : 'none';
    });
  });

  // Post subido
  const checkboxPost = document.getElementById('checkbox-post-subido');
  if (checkboxPost) {
    checkboxPost.addEventListener('change', (e) => {
      Store.updateLead(leadId, { postSubido: e.target.checked });
      renderLeadDetail(leadId, onBack);
    });
  }
  // Edit lead
  document.getElementById('btn-edit-lead').addEventListener('click', () => {
    openEditLeadModal(leadId, () => renderLeadDetail(leadId, onBack));
  });

  // Add contact
  document.getElementById('btn-add-contact').addEventListener('click', () => {
    openAddContactModal(leadId, () => renderLeadDetail(leadId, onBack));
  });
}
