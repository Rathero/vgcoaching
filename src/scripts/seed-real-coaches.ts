/**
 * Seed real coaches for go-to-market.
 * Run: npx tsx src/scripts/seed-real-coaches.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sa = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!sa) { console.error("❌ FIREBASE_SERVICE_ACCOUNT_KEY missing"); process.exit(1); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) }, "seed-real");
const db = getFirestore(app);

const coaches = [
  {
    id: "amr-coach", slug: "amr", displayName: "AMR", avatar: "👑",
    bio: "Coach #1 en Metafy con +4500 alumnos. Challenger desde Season 5. Especialista en todos los roles.",
    longBio: "Soy AMR, el coach número 1 en Metafy con más de 4500 estudiantes y 8 años de experiencia en coaching profesional. He alcanzado Challenger desde la Season 5 y he competido en el Campeonato Mundial 2016 en Jakarta.\n\nMi filosofía es simple: no importa tu nivel actual, puedo ayudarte a mejorar. He trabajado con jugadores desde Bronce hasta Grandmaster, y muchos de mis alumnos han alcanzado rangos que nunca pensaron posibles.\n\nCoacheo todos los roles en todos los servidores. Mi enfoque combina análisis de macro, mejora mecánica y mentalidad competitiva para resultados rápidos y duraderos.",
    country: "EG", countryFlag: "🇪🇬", languages: ["Inglés", "Árabe"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
  {
    id: "coach-karakal", slug: "coach-karakal", displayName: "Coach Karakal", avatar: "🦅",
    bio: "Ex-pro 6 años, Challenger. Coach de MAD Lions y equipos Tier 1. Coaching en todos los roles y servidores.",
    longBio: "Soy Coach Karakal, jugador profesional durante 6 años y Challenger. He sido coach de equipos Tier 1 como MAD Lions durante 4 años.\n\nMi experiencia en el competitivo me da una perspectiva única: no solo te enseño a subir en SoloQ, sino a pensar como un profesional. Trabajo draft, macro, rotaciones de mid-game y dominio de campeones.\n\nGrabo y subo las sesiones a YouTube para que puedas repasar las lecciones. Coacheo todos los roles en NA, EUW, EUNE, TR, BR, LAS y LAN.",
    country: "TR", countryFlag: "🇹🇷", languages: ["Inglés", "Turco"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
  {
    id: "dan-jungle", slug: "dan-fnatic", displayName: "Dan", avatar: "🦁",
    bio: "Ex-pro jungler de Fnatic y Excel (LEC). 11+ años de experiencia. Challenger desde Season 3.",
    longBio: "Soy Dan, jungler profesional con más de 11 años de experiencia. He competido en la LEC con Fnatic y Excel, y actualmente soy Assistant Coach de Team Heretics Academy en la LES.\n\nHe sido Challenger cada año desde la Season 3 y he alcanzado GM+ en todos los roles. Mi experiencia como líder in-game durante más de 10 años me permite aportar valor a cualquier rol y estilo de juego.\n\nTanto si aspiras a ser profesional como si solo quieres mejorar en SoloQ, te ayudo a entender el juego a un nivel más profundo.",
    country: "GB", countryFlag: "🇬🇧", languages: ["Inglés", "Español"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
  {
    id: "vrow-mid", slug: "vrow", displayName: "Vrow", avatar: "⚡",
    bio: "Challenger EUW desde Season 6. Ex-competidor mid laner. Mejor Akali de EUW y ex-mejor Taliyah del mundo.",
    longBio: "Soy Vrow, jugador Challenger en EUW desde la Season 6 y ex mid laner competitivo. Fui considerado el mejor Taliyah del mundo entre las Seasons 7 y 10, y actualmente soy el mejor Akali de EUW.\n\nMi coaching se enfoca en consejos mecánicos reales y tips aplicables para subir de elo. No te enseño a jugar como en competitivo — te enseño a ganar en SoloQ.\n\nSi quieres mejorar tu mid lane con un enfoque práctico y directo, sin teoría innecesaria, soy tu coach.",
    country: "FR", countryFlag: "🇫🇷", languages: ["Inglés", "Francés"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
  {
    id: "sawyer-jg", slug: "sawyer-jungle", displayName: "Sawyer", avatar: "🌿",
    bio: "Content creator educativo de Jungle. Challenger desde Season 3. Coach de todos los rangos, de Pro a Unranked.",
    longBio: "Soy Sawyer, creador de contenido educativo de Jungle y coach de League of Legends. Alcancé Challenger por primera vez en la Season 3 y llevo años dedicado al coaching.\n\nHe coachedado a jugadores de todos los rangos, desde profesionales hasta unranked. Mi enfoque es positivo y colaborativo: trabajamos juntos para mejorar tu juego sin negatividad ni presión.\n\nCreo que aprender y divertirse van de la mano. Si buscas un coach que te ayude a mejorar en un ambiente relajado y productivo, reserva una sesión.",
    country: "US", countryFlag: "🇺🇸", languages: ["Inglés"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
  {
    id: "shadow-adc", slug: "vanshadow", displayName: "Shadow", avatar: "🌑",
    bio: "Challenger ADC/Support/Mid/Jungle. 14 años de experiencia. +100 alumnos y equipos Tier 3 coacheados.",
    longBio: "Soy Vanshadow, jugador Challenger con más de 14 años de experiencia en League of Legends. He coachedado a más de 100 jugadores en todo el mundo, incluyendo equipos Tier 3.\n\nMi versatilidad es mi mayor fortaleza: juego ADC, Support, Mid y Jungle a nivel Challenger, lo que me permite entender el juego desde múltiples perspectivas.\n\nAhora me dedico al coaching a tiempo completo. Si quieres mejorar de verdad, agenda una consulta gratuita para ver si encajamos.",
    country: "US", countryFlag: "🇺🇸", languages: ["Inglés"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
  {
    id: "xblademojo", slug: "xblademojo", displayName: "xBlademojo", avatar: "⚔️",
    bio: "6+ años de coaching profesional. Métodos únicos y enfoque individual. Reembolso del 50% si no te convence.",
    longBio: "Soy xBlademojo y llevo más de 6 años dedicado al coaching profesional de League of Legends. He sido coach número 1 en Metafy y mi enfoque es directo: si no te gusta la sesión, te devuelvo el 50%.\n\nMis métodos de enseñanza son únicos y adaptados a cada alumno. No soy un 'yes man' — te digo la verdad sobre tu juego, incluso si no es lo que quieres oír. Así es como se mejora de verdad.\n\nNo necesitas ser un genio para subir de elo. Necesitas un mentor real que te guíe con estructura y honestidad.",
    country: "DE", countryFlag: "🇩🇪", languages: ["Inglés", "Alemán"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
  {
    id: "milionaire-coach", slug: "milionaire", displayName: "MILIOnaire", avatar: "💎",
    bio: "Challenger, Head Coach en LTXAcademy. 13+ años de experiencia. Planes de entrenamiento estructurados.",
    longBio: "Soy MILIOnaire, Head Coach en LTXAcademy y jugador Challenger con más de 13 años de experiencia. Coacheo todos los roles y ayudo a estudiantes de todos los niveles a alcanzar sus objetivos lo más rápido posible.\n\nLeague puede ser frustrante, por eso mi objetivo es ayudarte a superar tus obstáculos personales y alcanzar tu rango máximo a través de coaching estructurado. Ya sea mecánicas, macro, drafts, rotaciones o dominio de campeón.\n\nIdentificar tus debilidades y reforzar tus fortalezas es la clave para mejorar rápido. Ofrezco consultas gratuitas y planes de entrenamiento personalizados.",
    country: "US", countryFlag: "🇺🇸", languages: ["Inglés"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
  {
    id: "fearless-coach", slug: "fearless", displayName: "Fearless", avatar: "🔥",
    bio: "Multi-season Master+. 14 años de experiencia gaming. Estrategias probadas para subir incluso con malos equipos.",
    longBio: "Soy Fearless, jugador Master+ en múltiples temporadas con más de 14 años de experiencia en gaming. Estuve atascado en bajo elo hasta la Season 10, cuando descubrí estrategias efectivas que funcionan consistentemente.\n\nHe jugado cientos de partidas en bajo elo, enfocándome en entender las formas más fiables de ganar y carry en situaciones difíciles. Eso me da una perspectiva única: sé exactamente qué se siente estar atascado y cómo salir.\n\nOfrezco sesiones 1 a 1, VOD reviews y consultas gratuitas para ayudarte a alcanzar tu objetivo de rango.",
    country: "SA", countryFlag: "🇸🇦", languages: ["Inglés", "Árabe"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
  {
    id: "rift-school", slug: "rift-school", displayName: "Rift School", avatar: "📚",
    bio: "Coaching estructurado con 6+ años de experiencia. Enfoque en macro, mentalidad y mejora real. Todos los roles.",
    longBio: "Soy el fundador de Rift School, un programa de coaching con más de 6 años de experiencia tanto en LoL como en coaching de rendimiento. Empecé a hacer coaching antes de que fuera tendencia.\n\nMi enfoque es simple, estructurado y real. Sin teoría complicada. Sin positividad falsa. Te doy soporte completo de principio a fin, con materiales adicionales y acceso permanente a mi Discord.\n\nCambiaré la forma en que ves el juego y cómo mejoras. Si buscas un mentor real que te acompañe en tu progreso, aquí estoy.",
    country: "PL", countryFlag: "🇵🇱", languages: ["Inglés", "Polaco"], verified: false, listed: false,
    ratingAvg: 0, totalSessions: 0, totalStudents: 0, eloUpRate: 0, createdAt: "2025-04-30"
  },
];

const roles = {
  top: { id: "top", name: "Top", icon: "🗡️" },
  jungle: { id: "jungle", name: "Jungle", icon: "🌲" },
  mid: { id: "mid", name: "Mid", icon: "⚔️" },
  adc: { id: "adc", name: "ADC", icon: "🏹" },
  support: { id: "support", name: "Support", icon: "🛡️" },
};

const coachGames = [
  { coachId: "amr-coach", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles.mid, roles.jungle], specialties: ["Macro", "Climbing", "Mentalidad", "All Roles"], champions: ["Varios", "All Champions", "Meta Picks", "Counter Picks"] },
  { coachId: "coach-karakal", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles.mid, roles.top], specialties: ["Draft", "Macro", "Rotaciones", "Mentalidad Pro"], champions: ["Varios", "Meta Picks", "Flex Picks", "Counter Picks"] },
  { coachId: "dan-jungle", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles.jungle], specialties: ["Pathing", "Ganking", "Liderazgo", "Objetivos"], champions: ["Lee Sin", "Elise", "Viego", "Rek'Sai"] },
  { coachId: "vrow-mid", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles.mid], specialties: ["Mecánicas", "Assassins", "Roaming", "SoloQ Climbing"], champions: ["Akali", "Diana", "Taliyah", "Sylas"] },
  { coachId: "sawyer-jg", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles.jungle], specialties: ["Pathing", "Tracking", "Early Game", "Objetivos"], champions: ["Varios", "Meta Junglers", "Lee Sin", "Nidalee"] },
  { coachId: "shadow-adc", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles.adc, roles.support], specialties: ["Positioning", "Laning", "Teamfight", "Versatilidad"], champions: ["Jinx", "Kai'Sa", "Thresh", "Nautilus"] },
  { coachId: "xblademojo", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles.mid, roles.adc], specialties: ["Comportamiento", "Mentalidad", "Climbing", "Estructura"], champions: ["Varios", "Meta Picks", "Comfort Picks", "Flex Picks"] },
  { coachId: "milionaire-coach", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles.mid, roles.jungle], specialties: ["Macro", "Mecánicas", "Draft", "Planes de Entrenamiento"], champions: ["Varios", "All Champions", "Meta Picks", "OTP Coaching"] },
  { coachId: "fearless-coach", gameId: "lol", rank: "Master", rankTier: "master", roles: [roles.mid, roles.jungle], specialties: ["Climbing", "Carry", "Low Elo Escape", "Estrategia"], champions: ["Varios", "Carry Champions", "Meta Picks", "Snowball Champs"] },
  { coachId: "rift-school", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles.mid, roles.top], specialties: ["Macro", "Mentalidad", "Estructura", "Wave Management"], champions: ["Varios", "All Roles", "Meta Picks", "Fundamentals"] },
];

// Generate coaching options for each coach
function makeOptions(coachId: string, prices: [number, number, number]) {
  return [
    { coachId, gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Sesión 1 a 1 en tiempo real. Te observo jugar y te doy feedback instantáneo.", durationMinutes: 60, priceCents: prices[0], active: true },
    { coachId, gameId: "lol", type: "vod_review", name: "VOD Review", description: "Analizo una replay tuya en detalle con soluciones claras y accionables.", durationMinutes: 45, priceCents: prices[1], active: true },
    { coachId, gameId: "lol", type: "duo_coaching", name: "Sesión Intensiva", description: "Sesión extendida con plan personalizado, ejercicios y seguimiento.", durationMinutes: 90, priceCents: prices[2], active: true },
  ];
}

const coachingOptions = [
  ...makeOptions("amr-coach", [4500, 3000, 7000]),
  ...makeOptions("coach-karakal", [4000, 2800, 6500]),
  ...makeOptions("dan-jungle", [5000, 3500, 8000]),
  ...makeOptions("vrow-mid", [3500, 2500, 5500]),
  ...makeOptions("sawyer-jg", [3000, 2000, 5000]),
  ...makeOptions("shadow-adc", [3000, 2000, 5000]),
  ...makeOptions("xblademojo", [4000, 2800, 6500]),
  ...makeOptions("milionaire-coach", [4500, 3000, 7000]),
  ...makeOptions("fearless-coach", [2500, 1800, 4000]),
  ...makeOptions("rift-school", [3500, 2500, 5500]),
];

// Availability (4-5 days each, varied timezones)
const tzMap: Record<string, string> = {
  "amr-coach": "Africa/Cairo", "coach-karakal": "Europe/Istanbul", "dan-jungle": "Europe/London",
  "vrow-mid": "Europe/Paris", "sawyer-jg": "America/New_York", "shadow-adc": "America/New_York",
  "xblademojo": "Europe/Berlin", "milionaire-coach": "America/New_York", "fearless-coach": "Asia/Riyadh",
  "rift-school": "Europe/Warsaw",
};

function makeAvail(coachId: string, days: number[], start: string, end: string) {
  return days.map(d => ({ coachId, dayOfWeek: d, startTime: start, endTime: end, timezone: tzMap[coachId] }));
}

const availability = [
  ...makeAvail("amr-coach", [1, 2, 3, 4, 5], "14:00", "22:00"),
  ...makeAvail("coach-karakal", [1, 2, 4, 5, 6], "15:00", "23:00"),
  ...makeAvail("dan-jungle", [1, 3, 4, 5], "16:00", "22:00"),
  ...makeAvail("vrow-mid", [1, 2, 3, 5], "17:00", "23:00"),
  ...makeAvail("sawyer-jg", [0, 2, 4, 6], "12:00", "20:00"),
  ...makeAvail("shadow-adc", [1, 3, 5, 6], "14:00", "22:00"),
  ...makeAvail("xblademojo", [1, 2, 3, 4, 5], "15:00", "22:00"),
  ...makeAvail("milionaire-coach", [1, 2, 4, 5], "13:00", "21:00"),
  ...makeAvail("fearless-coach", [0, 1, 3, 5, 6], "16:00", "23:00"),
  ...makeAvail("rift-school", [1, 2, 3, 4], "16:00", "22:00"),
];

async function seed() {
  console.log("🌱 Seeding real coaches...\n");

  for (const c of coaches) {
    const { id, ...data } = c;
    await db.collection("coaches").doc(id).set(data);
    console.log(`  ✅ Coach: ${c.displayName}`);
  }

  for (const cg of coachGames) {
    await db.collection("coachGames").add(cg);
  }
  console.log(`  ✅ ${coachGames.length} coachGames`);

  for (const co of coachingOptions) {
    await db.collection("coachingOptions").add(co);
  }
  console.log(`  ✅ ${coachingOptions.length} coachingOptions`);

  for (const a of availability) {
    await db.collection("availability").add(a);
  }
  console.log(`  ✅ ${availability.length} availability slots`);

  console.log("\n✅ Done! All coaches are listed: false (hidden from public)");
  console.log("URLs:");
  for (const c of coaches) {
    console.log(`  https://videogamecoaching-a4794.web.app/games/league-of-legends/coach/${c.slug}`);
  }
}

seed().catch(console.error);
