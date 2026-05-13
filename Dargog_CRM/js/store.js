// store.js — Data management with localStorage
const KEYS = {
  leads: 'dargog_leads',
  vias: 'dargog_vias',
  columns: 'dargog_columns',
  reminder: 'dargog_reminder_later'
};

const DEFAULT_VIAS = ['Instagram', 'Discord', 'Twitter', 'Email', 'WhatsApp'];
const DEFAULT_COLUMNS = ['nombre', 'apellidos', 'fechaUltimoContacto', 'viaUltimoContacto', 'estado', 'email', 'telefono'];

const COLUMN_LABELS = {
  nombre: 'Nombre',
  apellidos: 'Apellidos',
  fechaUltimoContacto: 'Fecha último contacto',
  viaUltimoContacto: 'Vía último contacto',
  estado: 'Estado',
  email: 'Email',
  telefono: 'Teléfono'
};

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
}

function load(key, fallback) {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch { return fallback; }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function calcEstado(lead) {
  if (lead.estadoManual === 'cliente') return 'cliente';
  if (lead.estadoManual === 'muerto') return 'muerto';
  if (lead.contactos && lead.contactos.length > 0) return 'contactado';
  return 'pendiente';
}

function getLastContact(lead) {
  if (!lead.contactos || lead.contactos.length === 0) return null;
  const sorted = [...lead.contactos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  return sorted[0];
}

// Public API
const Store = {
  getLeads() { return load(KEYS.leads, []); },

  getLead(id) { return this.getLeads().find(l => l.id === id) || null; },

  createLead(data) {
    const leads = this.getLeads();
    const lead = {
      id: generateId(),
      nombre: data.nombre || '',
      apellidos: data.apellidos || '',
      email: data.email || '',
      telefono: data.telefono || '',
      estadoManual: null,
      notas: data.notas || '',
      contactos: [],
      historialEdiciones: [],
      creadoEn: new Date().toISOString()
    };
    // If initial contact data provided
    if (data.fechaContacto && data.viaContacto) {
      lead.contactos.push({
        id: generateId(),
        fecha: data.fechaContacto,
        via: data.viaContacto,
        notas: data.notasContacto || '',
        archivos: []
      });
    }
    leads.push(lead);
    save(KEYS.leads, leads);
    return lead;
  },

  updateLead(id, changes) {
    const leads = this.getLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    const lead = leads[idx];
    const edicion = { fecha: new Date().toISOString(), cambios: {} };
    for (const key of Object.keys(changes)) {
      if (lead[key] !== changes[key]) {
        edicion.cambios[key] = { antes: lead[key], despues: changes[key] };
        lead[key] = changes[key];
      }
    }
    if (Object.keys(edicion.cambios).length > 0) {
      lead.historialEdiciones.push(edicion);
    }
    leads[idx] = lead;
    save(KEYS.leads, leads);
    return lead;
  },

  setEstadoManual(id, estado) {
    const leads = this.getLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx === -1) return;
    leads[idx].estadoManual = estado;
    save(KEYS.leads, leads);
    return leads[idx];
  },

  addContact(leadId, contactData) {
    const leads = this.getLeads();
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx === -1) return null;
    const contact = {
      id: generateId(),
      fecha: contactData.fecha,
      via: contactData.via,
      notas: contactData.notas || '',
      archivos: contactData.archivos || []
    };
    leads[idx].contactos.push(contact);
    save(KEYS.leads, leads);
    return leads[idx];
  },

  deleteLead(id) {
    const leads = this.getLeads().filter(l => l.id !== id);
    save(KEYS.leads, leads);
  },

  // Vías de contacto
  getVias() { return load(KEYS.vias, [...DEFAULT_VIAS]); },
  addVia(via) {
    const vias = this.getVias();
    if (!vias.includes(via)) { vias.push(via); save(KEYS.vias, vias); }
    return vias;
  },

  deleteVia(via) {
    // Remove from vías list
    const vias = this.getVias().filter(v => v !== via);
    save(KEYS.vias, vias);
    // Clear from all leads' contacts and register in edit history
    const leads = this.getLeads();
    let changed = false;
    for (const lead of leads) {
      const affected = lead.contactos.filter(c => c.via === via);
      if (affected.length > 0) {
        for (const c of affected) { c.via = '(eliminada)'; }
        lead.historialEdiciones.push({
          fecha: new Date().toISOString(),
          cambios: {
            viaContacto: {
              antes: via,
              despues: '(eliminada) — Vía eliminada del sistema'
            }
          }
        });
        changed = true;
      }
    }
    if (changed) save(KEYS.leads, leads);
    return vias;
  },

  // Column order
  getColumnOrder() { return load(KEYS.columns, [...DEFAULT_COLUMNS]); },
  setColumnOrder(order) { save(KEYS.columns, order); },

  // Reminders
  getReminderLater() { return load(KEYS.reminder, null); },
  setReminderLater() { save(KEYS.reminder, Date.now()); },
  clearReminderLater() { save(KEYS.reminder, null); },

  shouldShowReminder() {
    const ts = this.getReminderLater();
    if (!ts) return true; // never postponed
    const hourMs = 60 * 60 * 1000;
    return (Date.now() - ts) > hourMs;
  },

  getLeadsToRemind() {
    const leads = this.getLeads();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return leads.filter(lead => {
      const estado = calcEstado(lead);
      if (estado === 'muerto' || estado === 'cliente') return false;
      const last = getLastContact(lead);
      if (!last) return false; // pendiente, no reminder needed for those with no contact
      return (now - new Date(last.fecha).getTime()) > twoDaysMs;
    });
  },

  // Helpers
  calcEstado,
  getLastContact,
  COLUMN_LABELS,
  DEFAULT_COLUMNS
};

export default Store;
