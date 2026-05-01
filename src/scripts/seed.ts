/**
 * Seed script to populate Firestore with initial data.
 * Run with: npx tsx src/scripts/seed.ts
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_KEY env var or
 * GOOGLE_APPLICATION_CREDENTIALS pointing to your service account JSON.
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccount) {
  console.error("❌ Set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local (full JSON string)");
  process.exit(1);
}

const app = initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
const db = getFirestore(app);

// ─── Data ────────────────────────────────────────────────

const games = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", icon: "⚔️", active: true, sortOrder: 1 },
  { id: "val", slug: "valorant", name: "Valorant", icon: "🔫", active: false, sortOrder: 2 },
  { id: "tft", slug: "teamfight-tactics", name: "TFT", icon: "♟️", active: false, sortOrder: 3 },
];

const roles = [
  { id: "top", name: "Top", icon: "🗡️" },
  { id: "jungle", name: "Jungle", icon: "🌲" },
  { id: "mid", name: "Mid", icon: "⚔️" },
  { id: "adc", name: "ADC", icon: "🏹" },
  { id: "support", name: "Support", icon: "🛡️" },
];

const coaches = [
  {
    id: "c1", slug: "darkmaster", displayName: "DarkMaster", avatar: "🧙‍♂️",
    bio: "Ex-jugador profesional de LEC con 5 años de experiencia en coaching. Especialista en mid lane y macro game.",
    longBio: "Empecé a jugar League of Legends en la Season 2. Llegué a Challenger en la Season 5 y desde entonces he mantenido mi nivel en el top 200 de EUW. Jugué profesionalmente durante 2 temporadas en equipos de la LEC Academy antes de dedicarme al coaching a tiempo completo.\n\nMi filosofía de coaching se basa en entender el PORQUÉ detrás de cada decisión. No te voy a decir \"haz esto\" sin explicarte la razón. Creo que un jugador que entiende el juego a nivel profundo mejora mucho más rápido que uno que simplemente sigue instrucciones.\n\nHe entrenado a más de 300 alumnos, y el 87% han subido al menos una división en el primer mes. Mi especialidad es el mid lane y el macro game, pero también trabajo mucho la mentalidad competitiva.",
    country: "ES", countryFlag: "🇪🇸", languages: ["Español", "Inglés"], verified: true,
    ratingAvg: 4.9, totalSessions: 342, totalStudents: 156, eloUpRate: 87, createdAt: "2024-01-15"
  },
  {
    id: "c2", slug: "valkyriesup", displayName: "ValkyrieSup", avatar: "🛡️",
    bio: "Main Support Grandmaster. Especialista en visión, roaming y engage timing. +200 sesiones de coaching.",
    longBio: "Soy main support desde la Season 4. He alcanzado Grandmaster en LAS y LAN jugando principalmente champions de engage como Thresh, Nautilus y Leona.\n\nComo coach, me centro en los aspectos que la mayoría de supports ignoran: el control de visión estratégico, cuándo roamear y cuándo quedarte en lane, y cómo generar presión sin morir.",
    country: "AR", countryFlag: "🇦🇷", languages: ["Español", "Portugués"], verified: true,
    ratingAvg: 4.8, totalSessions: 218, totalStudents: 98, eloUpRate: 82, createdAt: "2024-03-20"
  },
  {
    id: "c3", slug: "jungleking77", displayName: "JungleKing77", avatar: "🐺",
    bio: "Challenger Jungle. Especialista en pathing, ganking y control de objetivos. Ex-competidor regional.",
    longBio: "Llevo 8 años jugando jungle a nivel competitivo. He sido Challenger en las últimas 6 temporadas y he competido en torneos regionales en México y Latinoamérica.\n\nEl jungle es el rol más complejo del juego porque necesitas entender TODOS los lanes para tomar buenas decisiones.",
    country: "MX", countryFlag: "🇲🇽", languages: ["Español", "Inglés"], verified: true,
    ratingAvg: 5.0, totalSessions: 156, totalStudents: 72, eloUpRate: 91, createdAt: "2024-06-10"
  },
  {
    id: "c4", slug: "topside-terror", displayName: "TopsideTerror", avatar: "⚔️",
    bio: "Master Top Laner. Especialista en wave management, split push y matchups difíciles.",
    longBio: "Soy un main top que ha alcanzado Master en EUW. Mi especialidad es el wave management avanzado y saber cuándo split pushear vs agruparse con el equipo.",
    country: "CL", countryFlag: "🇨🇱", languages: ["Español"], verified: true,
    ratingAvg: 4.7, totalSessions: 89, totalStudents: 45, eloUpRate: 78, createdAt: "2024-09-05"
  },
  {
    id: "c5", slug: "adc-machine", displayName: "ADC Machine", avatar: "🎯",
    bio: "Grandmaster ADC. Especialista en positioning, kiting y teamfight execution.",
    longBio: "Main ADC Grandmaster en EUW. Llevo 6 años perfeccionando el arte del kiting y el positioning en teamfights.",
    country: "CO", countryFlag: "🇨🇴", languages: ["Español", "Inglés"], verified: false,
    ratingAvg: 4.6, totalSessions: 67, totalStudents: 34, eloUpRate: 76, createdAt: "2025-01-12"
  },
  {
    id: "c6", slug: "midlane-prodigy", displayName: "MidlaneProdigy", avatar: "✨",
    bio: "Challenger Mid. Ex-jugador profesional LLA. Especialista en assassins y roaming.",
    longBio: "Fui jugador profesional de mid lane en la LLA durante 3 temporadas. Ahora me dedico al coaching a tiempo completo.\n\nMi especialidad son los assassins (Zed, Fizz, Katarina, Akali) y el roaming agresivo.",
    country: "PE", countryFlag: "🇵🇪", languages: ["Español"], verified: true,
    ratingAvg: 4.9, totalSessions: 203, totalStudents: 89, eloUpRate: 85, createdAt: "2024-04-18"
  },
];

const coachGames = [
  { coachId: "c1", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles[2], roles[3]], specialties: ["Macro", "Wave Management", "Trading", "Roaming"], champions: ["Azir", "Orianna", "Viktor", "Syndra"] },
  { coachId: "c2", gameId: "lol", rank: "Grandmaster", rankTier: "grandmaster", roles: [roles[4]], specialties: ["Visión", "Roaming", "Engage Timing", "Warding"], champions: ["Thresh", "Nautilus", "Leona", "Rakan"] },
  { coachId: "c3", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles[1]], specialties: ["Pathing", "Ganking", "Objetivos", "Counter-jungling"], champions: ["Lee Sin", "Elise", "Nidalee", "Viego"] },
  { coachId: "c4", gameId: "lol", rank: "Master", rankTier: "master", roles: [roles[0]], specialties: ["Wave Management", "Split Push", "Matchups", "Trading"], champions: ["Darius", "Camille", "Jax", "Fiora"] },
  { coachId: "c5", gameId: "lol", rank: "Grandmaster", rankTier: "grandmaster", roles: [roles[3]], specialties: ["Positioning", "Kiting", "Teamfight", "Farming"], champions: ["Jinx", "Kai'Sa", "Aphelios", "Ezreal"] },
  { coachId: "c6", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles[2]], specialties: ["Assassins", "Roaming", "Snowballing", "Matchups"], champions: ["Zed", "Fizz", "Katarina", "Akali"] },
];

const coachingOptions = [
  { id: "co1", coachId: "c1", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Sesión en vivo donde juego contigo y te guío en tiempo real.", durationMinutes: 60, priceCents: 3500, active: true },
  { id: "co2", coachId: "c1", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Analizo una replay tuya y te explico cada error y cómo mejorarlo.", durationMinutes: 45, priceCents: 2500, active: true },
  { id: "co3", coachId: "c1", gameId: "lol", type: "duo_coaching", name: "Duo Coaching", description: "Jugamos juntos en ranked y te voy explicando todo en tiempo real.", durationMinutes: 90, priceCents: 5000, active: true },
  { id: "co4", coachId: "c2", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Sesión en vivo enfocada en tu gameplay como support.", durationMinutes: 60, priceCents: 2500, active: true },
  { id: "co5", coachId: "c2", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis detallado de tus replays con foco en visión y roaming.", durationMinutes: 45, priceCents: 2000, active: true },
  { id: "co6", coachId: "c3", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Te guío en tiempo real mientras juegas jungle.", durationMinutes: 60, priceCents: 4000, active: true },
  { id: "co7", coachId: "c3", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis de tu pathing y decisiones de objetivos.", durationMinutes: 45, priceCents: 3000, active: true },
  { id: "co8", coachId: "c3", gameId: "lol", type: "champion_specific", name: "Champion Masterclass", description: "Sesión enfocada en un campeón específico de jungle.", durationMinutes: 60, priceCents: 4500, active: true },
  { id: "co9", coachId: "c4", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Mejora tu top lane en tiempo real.", durationMinutes: 60, priceCents: 2000, active: true },
  { id: "co10", coachId: "c4", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis de wave management y trading.", durationMinutes: 45, priceCents: 1500, active: true },
  { id: "co11", coachId: "c5", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Mejora tu positioning y kiting.", durationMinutes: 60, priceCents: 2500, active: true },
  { id: "co12", coachId: "c5", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis de teamfights y positioning.", durationMinutes: 45, priceCents: 2000, active: true },
  { id: "co13", coachId: "c6", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Sesión en vivo enfocada en mid lane y roaming.", durationMinutes: 60, priceCents: 3500, active: true },
  { id: "co14", coachId: "c6", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis detallado de tus replays de mid.", durationMinutes: 45, priceCents: 2500, active: true },
  { id: "co15", coachId: "c6", gameId: "lol", type: "champion_specific", name: "Assassin Masterclass", description: "Domina un assassin específico con un pro.", durationMinutes: 60, priceCents: 4000, active: true },
];

const availability = [
  // DarkMaster
  { coachId: "c1", dayOfWeek: 1, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
  { coachId: "c1", dayOfWeek: 2, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
  { coachId: "c1", dayOfWeek: 3, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
  { coachId: "c1", dayOfWeek: 4, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
  { coachId: "c1", dayOfWeek: 5, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
  { coachId: "c1", dayOfWeek: 6, startTime: "10:00", endTime: "20:00", timezone: "Europe/Madrid" },
  // ValkyrieSup
  { coachId: "c2", dayOfWeek: 1, startTime: "14:00", endTime: "20:00", timezone: "America/Buenos_Aires" },
  { coachId: "c2", dayOfWeek: 3, startTime: "14:00", endTime: "20:00", timezone: "America/Buenos_Aires" },
  { coachId: "c2", dayOfWeek: 5, startTime: "14:00", endTime: "20:00", timezone: "America/Buenos_Aires" },
  { coachId: "c2", dayOfWeek: 6, startTime: "10:00", endTime: "18:00", timezone: "America/Buenos_Aires" },
  // JungleKing77
  { coachId: "c3", dayOfWeek: 0, startTime: "12:00", endTime: "20:00", timezone: "America/Mexico_City" },
  { coachId: "c3", dayOfWeek: 2, startTime: "18:00", endTime: "23:00", timezone: "America/Mexico_City" },
  { coachId: "c3", dayOfWeek: 4, startTime: "18:00", endTime: "23:00", timezone: "America/Mexico_City" },
  { coachId: "c3", dayOfWeek: 6, startTime: "12:00", endTime: "20:00", timezone: "America/Mexico_City" },
  // TopsideTerror
  { coachId: "c4", dayOfWeek: 1, startTime: "15:00", endTime: "21:00", timezone: "America/Santiago" },
  { coachId: "c4", dayOfWeek: 2, startTime: "15:00", endTime: "21:00", timezone: "America/Santiago" },
  { coachId: "c4", dayOfWeek: 4, startTime: "15:00", endTime: "21:00", timezone: "America/Santiago" },
  { coachId: "c4", dayOfWeek: 5, startTime: "15:00", endTime: "21:00", timezone: "America/Santiago" },
  // ADC Machine
  { coachId: "c5", dayOfWeek: 1, startTime: "17:00", endTime: "22:00", timezone: "America/Bogota" },
  { coachId: "c5", dayOfWeek: 3, startTime: "17:00", endTime: "22:00", timezone: "America/Bogota" },
  { coachId: "c5", dayOfWeek: 5, startTime: "17:00", endTime: "22:00", timezone: "America/Bogota" },
  // MidlaneProdigy
  { coachId: "c6", dayOfWeek: 1, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
  { coachId: "c6", dayOfWeek: 2, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
  { coachId: "c6", dayOfWeek: 3, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
  { coachId: "c6", dayOfWeek: 4, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
  { coachId: "c6", dayOfWeek: 5, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
  { coachId: "c6", dayOfWeek: 6, startTime: "10:00", endTime: "20:00", timezone: "America/Lima" },
  { coachId: "c6", dayOfWeek: 0, startTime: "10:00", endTime: "18:00", timezone: "America/Lima" },
];

const reviews = [
  { coachId: "c1", studentName: "Carlos M.", studentAvatar: "👨‍💻", rating: 5, comment: "De Oro IV a Platino I en 3 semanas. DarkMaster me hizo ver errores de positioning que ni sabía que cometía.", rankBefore: "Oro IV", rankAfter: "Platino I", sessionsCount: 3, createdAt: "2025-02-15" },
  { coachId: "c1", studentName: "María G.", studentAvatar: "👩‍🎓", rating: 5, comment: "Increíble coach. Explica todo con mucha paciencia y se nota que domina el juego a otro nivel.", rankBefore: "Plata I", rankAfter: "Oro II", sessionsCount: 5, createdAt: "2025-03-01" },
  { coachId: "c1", studentName: "Diego L.", studentAvatar: "🧑‍💻", rating: 4, comment: "Muy buen coach. Me ayudó mucho con el wave management.", rankBefore: "Platino III", rankAfter: "Esmeralda IV", sessionsCount: 4, createdAt: "2025-01-20" },
  { coachId: "c2", studentName: "Ana R.", studentAvatar: "👩‍🎮", rating: 5, comment: "ValkyrieSup me cambió completamente la forma de jugar support.", rankBefore: "Plata III", rankAfter: "Oro I", sessionsCount: 6, createdAt: "2025-02-28" },
  { coachId: "c2", studentName: "Pablo F.", studentAvatar: "👨‍🎮", rating: 5, comment: "Excelente visión del juego. Me enseñó ward spots que no conocía.", rankBefore: "Oro II", rankAfter: "Platino III", sessionsCount: 4, createdAt: "2025-03-15" },
  { coachId: "c3", studentName: "Lucía R.", studentAvatar: "👩‍🎮", rating: 5, comment: "Llevaba 2 años estancada en Plata. En 5 sesiones de jungle pathing subí a Oro III.", rankBefore: "Plata II", rankAfter: "Oro III", sessionsCount: 5, createdAt: "2025-01-10" },
  { coachId: "c3", studentName: "Andrés P.", studentAvatar: "🧑‍💻", rating: 5, comment: "El mejor coach de jungle que he tenido.", rankBefore: "Oro I", rankAfter: "Platino II", sessionsCount: 3, createdAt: "2025-02-05" },
  { coachId: "c6", studentName: "Roberto S.", studentAvatar: "👨‍💻", rating: 5, comment: "MidlaneProdigy es un crack. Me enseñó a roamear sin perder CS.", rankBefore: "Platino IV", rankAfter: "Esmeralda II", sessionsCount: 8, createdAt: "2025-03-20" },
];

// ─── Seed function ───────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding Firestore...\n");

  // Games
  console.log("📎 Games...");
  for (const game of games) {
    const { id, ...data } = game;
    await db.collection("games").doc(id).set(data);
  }

  // Coaches
  console.log("👤 Coaches...");
  for (const coach of coaches) {
    const { id, ...data } = coach;
    await db.collection("coaches").doc(id).set(data);
  }

  // Coach-Game relationships
  console.log("🎮 Coach-Game links...");
  for (const cg of coachGames) {
    await db.collection("coachGames").add(cg);
  }

  // Coaching Options
  console.log("📋 Coaching Options...");
  for (const opt of coachingOptions) {
    const { id, ...data } = opt;
    await db.collection("coachingOptions").doc(id).set(data);
  }

  // Availability
  console.log("📅 Availability...");
  for (const avail of availability) {
    await db.collection("availability").add(avail);
  }

  // Reviews
  console.log("💬 Reviews...");
  for (const review of reviews) {
    await db.collection("reviews").add(review);
  }

  console.log("\n✅ Seed complete! Collections created:");
  console.log("   - games (3)");
  console.log("   - coaches (6)");
  console.log("   - coachGames (6)");
  console.log("   - coachingOptions (15)");
  console.log("   - availability (27)");
  console.log("   - reviews (8)");
}

seed().catch(console.error);
