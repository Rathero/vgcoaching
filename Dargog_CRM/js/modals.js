// modals.js — Modal system for create/edit lead and add contact
import Store from './store.js';

const overlay = () => document.getElementById('modal-overlay');
const container = () => document.getElementById('modal-container');

let pendingFiles = [];

export function openModal(html) {
  container().innerHTML = html;
  overlay().classList.add('active');
  pendingFiles = [];
  // Close on overlay click
  overlay().onclick = (e) => { if (e.target === overlay()) closeModal(); };
}

export function closeModal() {
  overlay().classList.remove('active');
  setTimeout(() => { container().innerHTML = ''; }, 250);
  pendingFiles = [];
}

function viaSelectHTML(selectedVia) {
  const vias = Store.getVias();
  let opts = vias.map(v => `<option value="${v}" ${v === selectedVia ? 'selected' : ''}>${v}</option>`).join('');
  opts += `<option value="__add__">+ Añadir nueva vía</option>`;
  return `
    <div class="form-group">
      <label>Vía de contacto</label>
      <select class="form-select" id="modal-via">${opts}</select>
      <div class="via-add-container" id="via-add-container">
        <input type="text" class="form-input" id="via-new-input" placeholder="Nueva vía...">
        <button type="button" class="btn btn-primary btn-sm" id="via-new-confirm">Añadir</button>
      </div>
      <button type="button" class="via-manage-toggle" id="via-manage-toggle">🔧 Gestionar vías</button>
      <div class="via-manage-panel" id="via-manage-panel"></div>
    </div>`;
}

function renderViaManagePanel() {
  const panel = document.getElementById('via-manage-panel');
  const sel = document.getElementById('modal-via');
  if (!panel) return;
  const vias = Store.getVias();
  panel.innerHTML = vias.map(v =>
    `<div class="via-manage-item">
      <span>${v}</span>
      <button type="button" class="via-delete-btn" data-via="${v}" title="Eliminar vía">✕</button>
    </div>`
  ).join('');
  panel.querySelectorAll('.via-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const via = btn.dataset.via;
      if (confirm(`¿Eliminar la vía "${via}"? Se vaciará este campo en todos los leads que la usen.`)) {
        Store.deleteVia(via);
        // Refresh select options
        const newVias = Store.getVias();
        const currentVal = sel.value;
        sel.innerHTML = newVias.map(v =>
          `<option value="${v}" ${v === currentVal ? 'selected' : ''}>${v}</option>`
        ).join('') + `<option value="__add__">+ Añadir nueva vía</option>`;
        if (!newVias.includes(currentVal)) sel.selectedIndex = 0;
        renderViaManagePanel();
      }
    });
  });
}

function bindViaSelect() {
  const sel = document.getElementById('modal-via');
  const addC = document.getElementById('via-add-container');
  const manageToggle = document.getElementById('via-manage-toggle');
  const managePanel = document.getElementById('via-manage-panel');
  if (!sel) return;
  sel.addEventListener('change', () => {
    if (sel.value === '__add__') {
      addC.classList.add('visible');
      document.getElementById('via-new-input').focus();
    } else {
      addC.classList.remove('visible');
    }
  });
  const confirmBtn = document.getElementById('via-new-confirm');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const input = document.getElementById('via-new-input');
      const val = input.value.trim();
      if (val) {
        Store.addVia(val);
        const opt = document.createElement('option');
        opt.value = val; opt.textContent = val; opt.selected = true;
        sel.insertBefore(opt, sel.querySelector('option[value="__add__"]'));
        addC.classList.remove('visible');
        input.value = '';
        renderViaManagePanel();
      }
    });
  }
  // Manage vías toggle
  if (manageToggle) {
    manageToggle.addEventListener('click', () => {
      managePanel.classList.toggle('visible');
      if (managePanel.classList.contains('visible')) {
        renderViaManagePanel();
      }
    });
  }
}

function bindFileUpload() {
  const area = document.getElementById('file-upload-area');
  const input = document.getElementById('file-input');
  const list = document.getElementById('file-list');
  if (!area || !input) return;
  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.style.borderColor = 'var(--accent-primary)'; });
  area.addEventListener('dragleave', () => { area.style.borderColor = ''; });
  area.addEventListener('drop', (e) => { e.preventDefault(); area.style.borderColor = ''; handleFiles(e.dataTransfer.files); });
  input.addEventListener('change', () => { handleFiles(input.files); input.value = ''; });

  function handleFiles(files) {
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        pendingFiles.push({ nombre: file.name, tipo: file.type, data: e.target.result });
        renderFileList();
      };
      reader.readAsDataURL(file);
    }
  }

  function renderFileList() {
    if (!list) return;
    list.innerHTML = pendingFiles.map((f, i) =>
      `<span class="file-tag">${f.nombre} <span class="remove-file" data-idx="${i}">✕</span></span>`
    ).join('');
    list.querySelectorAll('.remove-file').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        pendingFiles.splice(parseInt(btn.dataset.idx), 1);
        renderFileList();
      });
    });
  }
}

// === CREATE LEAD MODAL ===
export function openCreateLeadModal(onSaved) {
  openModal(`
    <div class="modal-header"><h2>Crear nuevo lead</h2><button class="modal-close" id="modal-cancel-x">✕</button></div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label>Nombre *</label><input type="text" class="form-input" id="modal-nombre" placeholder="Nombre"></div>
        <div class="form-group"><label>Apellidos</label><input type="text" class="form-input" id="modal-apellidos" placeholder="Apellidos"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Email</label><input type="email" class="form-input" id="modal-email" placeholder="email@ejemplo.com"></div>
        <div class="form-group"><label>Teléfono</label><input type="tel" class="form-input" id="modal-telefono" placeholder="+34 600 000 000"></div>
      </div>
      ${viaSelectHTML('')}
      <div class="form-group"><label>Fecha de contacto</label><input type="date" class="form-input" id="modal-fecha"></div>
      <div class="form-group"><label>Notas</label><textarea class="form-textarea" id="modal-notas" placeholder="Añade notas sobre este lead..."></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" id="modal-cancel">Cancelar</button>
      <button class="btn btn-primary" id="modal-save">Guardar</button>
    </div>
  `);
  bindViaSelect();
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-x').addEventListener('click', closeModal);
  document.getElementById('modal-save').addEventListener('click', () => {
    const nombre = document.getElementById('modal-nombre').value.trim();
    if (!nombre) { document.getElementById('modal-nombre').style.borderColor = 'var(--danger)'; return; }
    const via = document.getElementById('modal-via').value;
    const data = {
      nombre,
      apellidos: document.getElementById('modal-apellidos').value.trim(),
      email: document.getElementById('modal-email').value.trim(),
      telefono: document.getElementById('modal-telefono').value.trim(),
      notas: document.getElementById('modal-notas').value.trim(),
      viaContacto: via !== '__add__' ? via : '',
      fechaContacto: document.getElementById('modal-fecha').value
    };
    Store.createLead(data);
    closeModal();
    if (onSaved) onSaved();
  });
  document.getElementById('modal-nombre').focus();
}

// === EDIT LEAD MODAL ===
export function openEditLeadModal(leadId, onSaved) {
  const lead = Store.getLead(leadId);
  if (!lead) return;
  openModal(`
    <div class="modal-header"><h2>Editar lead</h2><button class="modal-close" id="modal-cancel-x">✕</button></div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label>Nombre</label><input type="text" class="form-input" id="modal-nombre" value="${lead.nombre}"></div>
        <div class="form-group"><label>Apellidos</label><input type="text" class="form-input" id="modal-apellidos" value="${lead.apellidos}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Email</label><input type="email" class="form-input" id="modal-email" value="${lead.email}"></div>
        <div class="form-group"><label>Teléfono</label><input type="tel" class="form-input" id="modal-telefono" value="${lead.telefono}"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" id="modal-cancel">Cancelar</button>
      <button class="btn btn-primary" id="modal-save">Guardar</button>
    </div>
  `);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-x').addEventListener('click', closeModal);
  document.getElementById('modal-save').addEventListener('click', () => {
    Store.updateLead(leadId, {
      nombre: document.getElementById('modal-nombre').value.trim(),
      apellidos: document.getElementById('modal-apellidos').value.trim(),
      email: document.getElementById('modal-email').value.trim(),
      telefono: document.getElementById('modal-telefono').value.trim()
    });
    closeModal();
    if (onSaved) onSaved();
  });
}

// === ADD CONTACT MODAL ===
export function openAddContactModal(leadId, onSaved) {
  openModal(`
    <div class="modal-header"><h2>Añadir contacto</h2><button class="modal-close" id="modal-cancel-x">✕</button></div>
    <div class="modal-body">
      ${viaSelectHTML('')}
      <div class="form-group"><label>Fecha de contacto *</label><input type="date" class="form-input" id="modal-fecha" value="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group"><label>Notas</label><textarea class="form-textarea" id="modal-notas" placeholder="Detalles del contacto..."></textarea></div>
      <div class="form-group">
        <label>Archivos adjuntos</label>
        <div class="file-upload-area" id="file-upload-area">
          <input type="file" id="file-input" multiple accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx">
          <span class="upload-icon">📎</span>
          <span>Haz clic o arrastra archivos aquí</span>
        </div>
        <div class="file-list" id="file-list"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" id="modal-cancel">Cancelar</button>
      <button class="btn btn-primary" id="modal-save">Guardar</button>
    </div>
  `);
  bindViaSelect();
  bindFileUpload();
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-x').addEventListener('click', closeModal);
  document.getElementById('modal-save').addEventListener('click', () => {
    const fecha = document.getElementById('modal-fecha').value;
    const via = document.getElementById('modal-via').value;
    if (!fecha) { document.getElementById('modal-fecha').style.borderColor = 'var(--danger)'; return; }
    if (via === '__add__') { document.getElementById('modal-via').style.borderColor = 'var(--danger)'; return; }
    Store.addContact(leadId, {
      fecha,
      via,
      notas: document.getElementById('modal-notas').value.trim(),
      archivos: [...pendingFiles]
    });
    closeModal();
    if (onSaved) onSaved();
  });
}
