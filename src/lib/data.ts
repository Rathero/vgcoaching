import { Game, Coach, CoachGame, CoachingOption, Review, Availability } from "./types";

export const games: Game[] = [
  { id: "lol", slug: "league-of-legends", name: "League of Legends", icon: "⚔️", active: true, sortOrder: 1 },
  { id: "val", slug: "valorant", name: "Valorant", icon: "🔫", active: false, sortOrder: 2 },
  { id: "tft", slug: "teamfight-tactics", name: "TFT", icon: "♟️", active: false, sortOrder: 3 },
];

export const roles = [
  { id: "top", name: "Top", icon: "🗡️" },
  { id: "jungle", name: "Jungle", icon: "🌲" },
  { id: "mid", name: "Mid", icon: "⚔️" },
  { id: "adc", name: "ADC", icon: "🏹" },
  { id: "support", name: "Support", icon: "🛡️" },
];

export const coaches: Coach[] = [
  {
    id: "c1", slug: "darkmaster", displayName: "DarkMaster", avatar: "🧙‍♂️",
    bio: "Ex-jugador profesional de LEC con 5 años de experiencia en coaching. Especialista en mid lane y macro game.",
    longBio: "Empecé a jugar League of Legends en la Season 2. Llegué a Challenger en la Season 5 y desde entonces he mantenido mi nivel en el top 200 de EUW. Jugué profesionalmente durante 2 temporadas en equipos de la LEC Academy antes de dedicarme al coaching a tiempo completo.\n\nMi filosofía de coaching se basa en entender el PORQUÉ detrás de cada decisión. No te voy a decir \"haz esto\" sin explicarte la razón. Creo que un jugador que entiende el juego a nivel profundo mejora mucho más rápido que uno que simplemente sigue instrucciones.\n\nHe entrenado a más de 300 alumnos, y el 87% han subido al menos una división en el primer mes. Mi especialidad es el mid lane y el macro game, pero también trabajo mucho la mentalidad competitiva.",
    country: "ES", countryFlag: "🇪🇸", languages: ["Español", "Inglés"], verified: true, listed: true,
    ratingAvg: 4.9, totalSessions: 342, totalStudents: 156, eloUpRate: 87, createdAt: "2024-01-15"
  },
  {
    id: "c2", slug: "valkyriesup", displayName: "ValkyrieSup", avatar: "🛡️",
    bio: "Main Support Grandmaster. Especialista en visión, roaming y engage timing. +200 sesiones de coaching.",
    longBio: "Soy main support desde la Season 4. He alcanzado Grandmaster en LAS y LAN jugando principalmente champions de engage como Thresh, Nautilus y Leona.\n\nComo coach, me centro en los aspectos que la mayoría de supports ignoran: el control de visión estratégico, cuándo roamear y cuándo quedarte en lane, y cómo generar presión sin morir. También trabajo mucho el tema de la comunicación con tu ADC y cómo influir en el mapa desde el rol de support.\n\nCreo que el support es el rol más infravalorado del juego y que un buen support puede carry partidas igual que un mid o jungle. Si quieres aprender a hacerlo, estoy aquí para enseñarte.",
    country: "AR", countryFlag: "🇦🇷", languages: ["Español", "Portugués"], verified: true, listed: true,
    ratingAvg: 4.8, totalSessions: 218, totalStudents: 98, eloUpRate: 82, createdAt: "2024-03-20"
  },
  {
    id: "c3", slug: "jungleking77", displayName: "JungleKing77", avatar: "🐺",
    bio: "Challenger Jungle. Especialista en pathing, ganking y control de objetivos. Ex-competidor regional.",
    longBio: "Llevo 8 años jugando jungle a nivel competitivo. He sido Challenger en las últimas 6 temporadas y he competido en torneos regionales en México y Latinoamérica.\n\nEl jungle es el rol más complejo del juego porque necesitas entender TODOS los lanes para tomar buenas decisiones. Mi coaching se enfoca en enseñarte a leer el mapa, optimizar tu pathing según el estado del juego, y elegir los momentos perfectos para gankear.\n\nNo creo en el \"one trick\" jungling. Te enseño a adaptarte a cualquier situación, a trackear al jungler enemigo, y a tomar decisiones de objetivos que ganen partidas.",
    country: "MX", countryFlag: "🇲🇽", languages: ["Español", "Inglés"], verified: true, listed: true,
    ratingAvg: 5.0, totalSessions: 156, totalStudents: 72, eloUpRate: 91, createdAt: "2024-06-10"
  },
  {
    id: "c4", slug: "topside-terror", displayName: "TopsideTerror", avatar: "⚔️",
    bio: "Master Top Laner. Especialista en wave management, split push y matchups difíciles.",
    longBio: "Soy un main top que ha alcanzado Master en EUW. Mi especialidad es el wave management avanzado y saber cuándo split pushear vs agruparse con el equipo.\n\nSé que el top lane puede sentirse como una isla, pero con las decisiones correctas puedes tener un impacto brutal en el juego. Te enseño a ganar tu lane consistentemente, a controlar las waves para generar ventajas, y a convertir tu ventaja de lane en victoria de equipo.\n\nTambién trabajo mucho los matchups específicos. Si hay un campeón que siempre te gana, te enseño exactamente cómo jugar contra él.",
    country: "CL", countryFlag: "🇨🇱", languages: ["Español"], verified: true, listed: true,
    ratingAvg: 4.7, totalSessions: 89, totalStudents: 45, eloUpRate: 78, createdAt: "2024-09-05"
  },
  {
    id: "c5", slug: "adc-machine", displayName: "ADC Machine", avatar: "🎯",
    bio: "Grandmaster ADC. Especialista en positioning, kiting y teamfight execution.",
    longBio: "Main ADC Grandmaster en EUW. Llevo 6 años perfeccionando el arte del kiting y el positioning en teamfights.\n\nEl ADC es el rol más mecánicamente exigente del juego. Te enseño a mejorar tu farming, tu trading en lane, y sobre todo tu positioning en teamfights para maximizar tu DPS sin morir.\n\nTambién trabajo mucho el aspecto mental del rol: cómo no tiltearte cuando tu support va mal, cómo jugar desde atrás, y cómo carry partidas incluso cuando tu equipo está perdiendo.",
    country: "CO", countryFlag: "🇨🇴", languages: ["Español", "Inglés"], verified: false, listed: true,
    ratingAvg: 4.6, totalSessions: 67, totalStudents: 34, eloUpRate: 76, createdAt: "2025-01-12"
  },
  {
    id: "c6", slug: "midlane-prodigy", displayName: "MidlaneProdigy", avatar: "✨",
    bio: "Challenger Mid. Ex-jugador profesional LLA. Especialista en assassins y roaming.",
    longBio: "Fui jugador profesional de mid lane en la LLA durante 3 temporadas. Ahora me dedico al coaching a tiempo completo.\n\nMi especialidad son los assassins (Zed, Fizz, Katarina, Akali) y el roaming agresivo. Te enseño a dominar los matchups del mid lane, a encontrar ventanas para roamear sin perder CS, y a snowballear tus ventajas hasta cerrar la partida.\n\nSi quieres aprender a carry desde mid, soy tu coach.",
    country: "PE", countryFlag: "🇵🇪", languages: ["Español"], verified: true, listed: true,
    ratingAvg: 4.9, totalSessions: 203, totalStudents: 89, eloUpRate: 85, createdAt: "2024-04-18"
  },
];

export const coachGames: CoachGame[] = [
  { coachId: "c1", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles[2], roles[3]], specialties: ["Macro", "Wave Management", "Trading", "Roaming"], champions: ["Azir", "Orianna", "Viktor", "Syndra"] },
  { coachId: "c2", gameId: "lol", rank: "Grandmaster", rankTier: "grandmaster", roles: [roles[4]], specialties: ["Visión", "Roaming", "Engage Timing", "Warding"], champions: ["Thresh", "Nautilus", "Leona", "Rakan"] },
  { coachId: "c3", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles[1]], specialties: ["Pathing", "Ganking", "Objetivos", "Counter-jungling"], champions: ["Lee Sin", "Elise", "Nidalee", "Viego"] },
  { coachId: "c4", gameId: "lol", rank: "Master", rankTier: "master", roles: [roles[0]], specialties: ["Wave Management", "Split Push", "Matchups", "Trading"], champions: ["Darius", "Camille", "Jax", "Fiora"] },
  { coachId: "c5", gameId: "lol", rank: "Grandmaster", rankTier: "grandmaster", roles: [roles[3]], specialties: ["Positioning", "Kiting", "Teamfight", "Farming"], champions: ["Jinx", "Kai'Sa", "Aphelios", "Ezreal"] },
  { coachId: "c6", gameId: "lol", rank: "Challenger", rankTier: "challenger", roles: [roles[2]], specialties: ["Assassins", "Roaming", "Snowballing", "Matchups"], champions: ["Zed", "Fizz", "Katarina", "Akali"] },
];

export const coachingOptions: CoachingOption[] = [
  // DarkMaster
  { id: "co1", coachId: "c1", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Sesión en vivo donde juego contigo y te guío en tiempo real. Ideal para mejorar tu toma de decisiones.", durationMinutes: 60, priceCents: 3500, active: true },
  { id: "co2", coachId: "c1", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Analizo una replay tuya y te explico cada error y cómo mejorarlo. Recibes el vídeo anotado.", durationMinutes: 45, priceCents: 2500, active: true },
  { id: "co3", coachId: "c1", gameId: "lol", type: "duo_coaching", name: "Duo Coaching", description: "Jugamos juntos en ranked/normal y te voy explicando todo en tiempo real por Discord.", durationMinutes: 90, priceCents: 5000, active: true },
  // ValkyrieSup
  { id: "co4", coachId: "c2", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Sesión en vivo enfocada en tu gameplay como support.", durationMinutes: 60, priceCents: 2500, active: true },
  { id: "co5", coachId: "c2", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis detallado de tus replays con foco en visión y roaming.", durationMinutes: 45, priceCents: 2000, active: true },
  // JungleKing77
  { id: "co6", coachId: "c3", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Te guío en tiempo real mientras juegas jungle.", durationMinutes: 60, priceCents: 4000, active: true },
  { id: "co7", coachId: "c3", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis de tu pathing y decisiones de objetivos.", durationMinutes: 45, priceCents: 3000, active: true },
  { id: "co8", coachId: "c3", gameId: "lol", type: "champion_specific", name: "Champion Masterclass", description: "Sesión enfocada en un campeón específico de jungle.", durationMinutes: 60, priceCents: 4500, active: true },
  // TopsideTerror
  { id: "co9", coachId: "c4", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Mejora tu top lane en tiempo real.", durationMinutes: 60, priceCents: 2000, active: true },
  { id: "co10", coachId: "c4", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis de wave management y trading.", durationMinutes: 45, priceCents: 1500, active: true },
  // ADC Machine
  { id: "co11", coachId: "c5", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Mejora tu positioning y kiting.", durationMinutes: 60, priceCents: 2500, active: true },
  { id: "co12", coachId: "c5", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis de teamfights y positioning.", durationMinutes: 45, priceCents: 2000, active: true },
  // MidlaneProdigy
  { id: "co13", coachId: "c6", gameId: "lol", type: "live_coaching", name: "Coaching en Vivo", description: "Sesión en vivo enfocada en mid lane y roaming.", durationMinutes: 60, priceCents: 3500, active: true },
  { id: "co14", coachId: "c6", gameId: "lol", type: "vod_review", name: "VOD Review", description: "Análisis detallado de tus replays de mid.", durationMinutes: 45, priceCents: 2500, active: true },
  { id: "co15", coachId: "c6", gameId: "lol", type: "champion_specific", name: "Assassin Masterclass", description: "Domina un assassin específico con un pro.", durationMinutes: 60, priceCents: 4000, active: true },
];

export const reviews: Review[] = [
  { id: "r1", coachId: "c1", studentName: "Carlos M.", studentAvatar: "👨‍💻", rating: 5, comment: "De Oro IV a Platino I en 3 semanas. DarkMaster me hizo ver errores de positioning que ni sabía que cometía.", rankBefore: "Oro IV", rankAfter: "Platino I", sessionsCount: 3, createdAt: "2025-02-15" },
  { id: "r2", coachId: "c1", studentName: "María G.", studentAvatar: "👩‍🎓", rating: 5, comment: "Increíble coach. Explica todo con mucha paciencia y se nota que domina el juego a otro nivel.", rankBefore: "Plata I", rankAfter: "Oro II", sessionsCount: 5, createdAt: "2025-03-01" },
  { id: "r3", coachId: "c1", studentName: "Diego L.", studentAvatar: "🧑‍💻", rating: 4, comment: "Muy buen coach. Me ayudó mucho con el wave management. Solo le falta un poco más de flexibilidad de horarios.", rankBefore: "Platino III", rankAfter: "Esmeralda IV", sessionsCount: 4, createdAt: "2025-01-20" },
  { id: "r4", coachId: "c2", studentName: "Ana R.", studentAvatar: "👩‍🎮", rating: 5, comment: "ValkyrieSup me cambió completamente la forma de jugar support. Ahora entiendo cuándo roamear y cuándo quedarme.", rankBefore: "Plata III", rankAfter: "Oro I", sessionsCount: 6, createdAt: "2025-02-28" },
  { id: "r5", coachId: "c2", studentName: "Pablo F.", studentAvatar: "👨‍🎮", rating: 5, comment: "Excelente visión del juego. Me enseñó ward spots que no conocía y cómo controlar la visión del mapa.", rankBefore: "Oro II", rankAfter: "Platino III", sessionsCount: 4, createdAt: "2025-03-15" },
  { id: "r6", coachId: "c3", studentName: "Lucía R.", studentAvatar: "👩‍🎮", rating: 5, comment: "Llevaba 2 años estancada en Plata. En 5 sesiones de jungle pathing subí a Oro III. Lo mejor es que ahora entiendo POR QUÉ hago lo que hago.", rankBefore: "Plata II", rankAfter: "Oro III", sessionsCount: 5, createdAt: "2025-01-10" },
  { id: "r7", coachId: "c3", studentName: "Andrés P.", studentAvatar: "🧑‍💻", rating: 5, comment: "El mejor coach de jungle que he tenido. Me enseñó a trackear al jungler enemigo como un pro.", rankBefore: "Oro I", rankAfter: "Platino II", sessionsCount: 3, createdAt: "2025-02-05" },
  { id: "r8", coachId: "c6", studentName: "Roberto S.", studentAvatar: "👨‍💻", rating: 5, comment: "MidlaneProdigy es un crack. Me enseñó a roamear sin perder CS y a snowballear partidas.", rankBefore: "Platino IV", rankAfter: "Esmeralda II", sessionsCount: 8, createdAt: "2025-03-20" },
];

export const availabilities: Record<string, Availability[]> = {
  c1: [
    { dayOfWeek: 1, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
    { dayOfWeek: 2, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
    { dayOfWeek: 3, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
    { dayOfWeek: 4, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
    { dayOfWeek: 5, startTime: "16:00", endTime: "22:00", timezone: "Europe/Madrid" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "20:00", timezone: "Europe/Madrid" },
  ],
  c2: [
    { dayOfWeek: 1, startTime: "14:00", endTime: "20:00", timezone: "America/Buenos_Aires" },
    { dayOfWeek: 3, startTime: "14:00", endTime: "20:00", timezone: "America/Buenos_Aires" },
    { dayOfWeek: 5, startTime: "14:00", endTime: "20:00", timezone: "America/Buenos_Aires" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "18:00", timezone: "America/Buenos_Aires" },
  ],
  c3: [
    { dayOfWeek: 0, startTime: "12:00", endTime: "20:00", timezone: "America/Mexico_City" },
    { dayOfWeek: 2, startTime: "18:00", endTime: "23:00", timezone: "America/Mexico_City" },
    { dayOfWeek: 4, startTime: "18:00", endTime: "23:00", timezone: "America/Mexico_City" },
    { dayOfWeek: 6, startTime: "12:00", endTime: "20:00", timezone: "America/Mexico_City" },
  ],
  c4: [
    { dayOfWeek: 1, startTime: "15:00", endTime: "21:00", timezone: "America/Santiago" },
    { dayOfWeek: 2, startTime: "15:00", endTime: "21:00", timezone: "America/Santiago" },
    { dayOfWeek: 4, startTime: "15:00", endTime: "21:00", timezone: "America/Santiago" },
    { dayOfWeek: 5, startTime: "15:00", endTime: "21:00", timezone: "America/Santiago" },
  ],
  c5: [
    { dayOfWeek: 1, startTime: "17:00", endTime: "22:00", timezone: "America/Bogota" },
    { dayOfWeek: 3, startTime: "17:00", endTime: "22:00", timezone: "America/Bogota" },
    { dayOfWeek: 5, startTime: "17:00", endTime: "22:00", timezone: "America/Bogota" },
  ],
  c6: [
    { dayOfWeek: 1, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
    { dayOfWeek: 2, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
    { dayOfWeek: 3, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
    { dayOfWeek: 4, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
    { dayOfWeek: 5, startTime: "16:00", endTime: "23:00", timezone: "America/Lima" },
    { dayOfWeek: 6, startTime: "10:00", endTime: "20:00", timezone: "America/Lima" },
    { dayOfWeek: 0, startTime: "10:00", endTime: "18:00", timezone: "America/Lima" },
  ],
};

// Helper functions
export function getGame(slug: string): Game | undefined {
  return games.find(g => g.slug === slug);
}

export function getCoach(slug: string): Coach | undefined {
  return coaches.find(c => c.slug === slug);
}

export function getCoachById(id: string): Coach | undefined {
  return coaches.find(c => c.id === id);
}

export function getCoachGame(coachId: string, gameId: string): CoachGame | undefined {
  return coachGames.find(cg => cg.coachId === coachId && cg.gameId === gameId);
}

export function getCoachOptions(coachId: string): CoachingOption[] {
  return coachingOptions.filter(co => co.coachId === coachId && co.active);
}

export function getCoachReviews(coachId: string): Review[] {
  return reviews.filter(r => r.coachId === coachId);
}

export function getCoachAvailability(coachId: string): Availability[] {
  return availabilities[coachId] || [];
}

export function getCoachesByGame(gameId: string): { coach: Coach; gameData: CoachGame }[] {
  return coachGames
    .filter(cg => cg.gameId === gameId)
    .map(cg => ({ coach: coaches.find(c => c.id === cg.coachId)!, gameData: cg }))
    .filter(item => item.coach);
}

export function getMinPrice(coachId: string): number {
  const options = getCoachOptions(coachId);
  if (options.length === 0) return 0;
  return Math.min(...options.map(o => o.priceCents));
}

export function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(0)}€`;
}

export const rankColors: Record<string, string> = {
  challenger: "#f4c874",
  grandmaster: "#e84057",
  master: "#9d48c4",
  diamond: "#576cce",
};
