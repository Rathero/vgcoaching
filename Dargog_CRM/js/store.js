import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAV3-HCIVJIqNTWOUmO1wj1BBsfTcOOHUM",
  authDomain: "videogamecoaching-a4794.firebaseapp.com",
  projectId: "videogamecoaching-a4794",
  storageBucket: "videogamecoaching-a4794.firebasestorage.app",
  messagingSenderId: "266704815891",
  appId: "1:266704815891:web:b85c15bce443f9e7eafce6",
  measurementId: "G-9Z7Y0QLRY9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

// In-memory state for synchronous UI rendering (Optimistic UI)
let state = {
  leads: [],
  vias: [...DEFAULT_VIAS],
  columns: [...DEFAULT_COLUMNS],
  reminder: null
};

// Async helpers to sync to Firestore
async function saveLeadToDB(lead) {
  try {
    await setDoc(doc(db, "crm_leads", lead.id), lead);
  } catch (error) {
    console.error("Error saving lead to DB:", error);
  }
}

async function deleteLeadFromDB(id) {
  try {
    await deleteDoc(doc(db, "crm_leads", id));
  } catch (error) {
    console.error("Error deleting lead from DB:", error);
  }
}

async function saveSettingsToDB() {
  try {
    await setDoc(doc(db, "crm_settings", "global"), {
      vias: state.vias,
      columns: state.columns,
      reminder: state.reminder
    });
  } catch (error) {
    console.error("Error saving settings to DB:", error);
  }
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

const Store = {
  // Initialization - called by app.js on startup
  async init() {
    try {
      // 1. Fetch settings
      const settingsDoc = await getDoc(doc(db, "crm_settings", "global"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        if (data.vias) state.vias = data.vias;
        if (data.columns) state.columns = data.columns;
        if (data.reminder !== undefined) state.reminder = data.reminder;
      }

      // 2. Fetch leads
      const leadsSnap = await getDocs(collection(db, "crm_leads"));
      const loadedLeads = [];
      leadsSnap.forEach(doc => {
        loadedLeads.push(doc.data());
      });
      state.leads = loadedLeads;

      // 3. Fetch coaches and auto-sync
      const coachesSnap = await getDocs(collection(db, "coaches"));
      let newLeadsAdded = false;

      coachesSnap.forEach((coachDoc) => {
        const coachData = coachDoc.data();
        const coachId = coachDoc.id;
        
        const exists = state.leads.find(l => l.coachId === coachId || l.nombre.toLowerCase() === coachData.displayName.toLowerCase());
        
        if (!exists) {
          let notasAdicionales = `Coach importado dinámicamente de Dargog (ID: ${coachId}).\n`;
          if (coachData.discordUsername) notasAdicionales += `Discord: ${coachData.discordUsername}\n`;
          if (coachData.instagramUsername) notasAdicionales += `Instagram: @${coachData.instagramUsername}\n`;
          if (coachData.twitterUsername) notasAdicionales += `Twitter: @${coachData.twitterUsername}\n`;
          if (coachData.twitchUsername) notasAdicionales += `Twitch: ${coachData.twitchUsername}\n`;
          if (coachData.bio) notasAdicionales += `\nBio:\n${coachData.bio}\n`;

          const lead = {
            id: generateId(),
            coachId: coachId,
            nombre: coachData.displayName || 'Desconocido',
            apellidos: '', 
            email: '', 
            telefono: '',
            estadoManual: null,
            notas: notasAdicionales.trim(),
            contactos: [],
            historialEdiciones: [],
            creadoEn: new Date().toISOString()
          };
          
          state.leads.push(lead);
          saveLeadToDB(lead);
          newLeadsAdded = true;
        }
      });
      
      return newLeadsAdded;
    } catch (error) {
      console.error("Error initializing Store from Firebase:", error);
      throw error;
    }
  },

  getLeads() { return state.leads; },

  getLead(id) { return state.leads.find(l => l.id === id) || null; },

  createLead(data) {
    const lead = {
      id: generateId(),
      coachId: data.coachId || null,
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
    if (data.fechaContacto && data.viaContacto) {
      lead.contactos.push({
        id: generateId(),
        fecha: data.fechaContacto,
        via: data.viaContacto,
        notas: data.notasContacto || '',
        archivos: []
      });
    }
    state.leads.push(lead);
    saveLeadToDB(lead);
    return lead;
  },

  updateLead(id, changes) {
    const idx = state.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    const lead = state.leads[idx];
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
    state.leads[idx] = lead;
    saveLeadToDB(lead);
    return lead;
  },

  setEstadoManual(id, estado) {
    const idx = state.leads.findIndex(l => l.id === id);
    if (idx === -1) return;
    
    const oldEstado = state.leads[idx].estadoManual;
    if (oldEstado !== estado) {
      state.leads[idx].historialEdiciones.push({
        fecha: new Date().toISOString(),
        cambios: {
          estadoManual: { antes: oldEstado || '(vacío)', despues: estado || '(vacío)' }
        }
      });
    }

    state.leads[idx].estadoManual = estado;
    saveLeadToDB(state.leads[idx]);
    return state.leads[idx];
  },

  addContact(leadId, contactData) {
    const idx = state.leads.findIndex(l => l.id === leadId);
    if (idx === -1) return null;
    const contact = {
      id: generateId(),
      fecha: contactData.fecha,
      via: contactData.via,
      notas: contactData.notas || '',
      archivos: contactData.archivos || []
    };
    state.leads[idx].contactos.push(contact);
    saveLeadToDB(state.leads[idx]);
    return state.leads[idx];
  },

  deleteLead(id) {
    state.leads = state.leads.filter(l => l.id !== id);
    deleteLeadFromDB(id);
  },

  getVias() { return state.vias; },
  
  addVia(via) {
    if (!state.vias.includes(via)) { 
      state.vias.push(via); 
      saveSettingsToDB();
    }
    return state.vias;
  },

  deleteVia(via) {
    state.vias = state.vias.filter(v => v !== via);
    saveSettingsToDB();
    
    let changed = false;
    for (const lead of state.leads) {
      const affected = lead.contactos.filter(c => c.via === via);
      if (affected.length > 0) {
        for (const c of affected) { c.via = '(eliminada)'; }
        lead.historialEdiciones.push({
          fecha: new Date().toISOString(),
          cambios: {
            viaContacto: { antes: via, despues: '(eliminada) — Vía eliminada del sistema' }
          }
        });
        saveLeadToDB(lead);
        changed = true;
      }
    }
    return state.vias;
  },

  getColumnOrder() { return state.columns; },
  setColumnOrder(order) { 
    state.columns = order; 
    saveSettingsToDB(); 
  },

  getReminderLater() { return state.reminder; },
  setReminderLater() { 
    state.reminder = Date.now(); 
    saveSettingsToDB();
  },
  clearReminderLater() { 
    state.reminder = null; 
    saveSettingsToDB();
  },

  shouldShowReminder() {
    const ts = this.getReminderLater();
    if (!ts) return true;
    const hourMs = 60 * 60 * 1000;
    return (Date.now() - ts) > hourMs;
  },

  getLeadsToRemind() {
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return state.leads.filter(lead => {
      const estado = calcEstado(lead);
      if (estado === 'muerto' || estado === 'cliente') return false;
      const last = getLastContact(lead);
      if (!last) return false; 
      return (now - new Date(last.fecha).getTime()) > twoDaysMs;
    });
  },

  calcEstado,
  getLastContact,
  COLUMN_LABELS,
  DEFAULT_COLUMNS
};

export default Store;
