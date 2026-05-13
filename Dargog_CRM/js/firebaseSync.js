import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import Store from './store.js';

// Configuración extraída del proyecto principal (vgcoaching)
const firebaseConfig = {
  apiKey: "AIzaSyAV3-HCIVJIqNTWOUmO1wj1BBsfTcOOHUM",
  authDomain: "videogamecoaching-a4794.firebaseapp.com",
  projectId: "videogamecoaching-a4794",
  storageBucket: "videogamecoaching-a4794.firebasestorage.app",
  messagingSenderId: "266704815891",
  appId: "1:266704815891:web:b85c15bce443f9e7eafce6",
  measurementId: "G-9Z7Y0QLRY9",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function syncCoaches() {
  try {
    const coachesSnapshot = await getDocs(collection(db, "coaches"));
    const leads = Store.getLeads();
    let importedCount = 0;

    coachesSnapshot.forEach((doc) => {
      const coachData = doc.data();
      const coachId = doc.id;
      
      // Comprobar si ya existe el coach como lead (por coachId o por nombre)
      const exists = leads.find(l => l.coachId === coachId || l.nombre.toLowerCase() === coachData.displayName.toLowerCase());
      
      if (!exists) {
        // Preparar notas con información social disponible
        let notasAdicionales = `Coach importado de Dargog (ID: ${coachId}).\n`;
        if (coachData.discordUsername) notasAdicionales += `Discord: ${coachData.discordUsername}\n`;
        if (coachData.instagramUsername) notasAdicionales += `Instagram: @${coachData.instagramUsername}\n`;
        if (coachData.twitterUsername) notasAdicionales += `Twitter: @${coachData.twitterUsername}\n`;
        if (coachData.twitchUsername) notasAdicionales += `Twitch: ${coachData.twitchUsername}\n`;
        if (coachData.bio) notasAdicionales += `\nBio:\n${coachData.bio}\n`;

        Store.createLead({
          coachId: coachId,
          nombre: coachData.displayName || 'Desconocido',
          apellidos: '', 
          email: '', // No disponemos de email directo en public Coach document
          telefono: '',
          notas: notasAdicionales.trim()
        });
        
        importedCount++;
      }
    });

    return importedCount;
  } catch (error) {
    console.error("Error al sincronizar coaches:", error);
    throw error;
  }
}
