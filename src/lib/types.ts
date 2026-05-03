// Types for the entire application

export interface Game {
  id: string;
  slug: string;
  name: string;
  icon: string;
  active: boolean;
  sortOrder: number;
}

export interface Coach {
  id: string;
  slug: string;
  displayName: string;
  avatar: string;
  bio: string;
  longBio: string;
  country: string;
  countryFlag: string;
  languages: string[];
  verified: boolean;
  listed: boolean; // false = hidden from public listing, accessible via direct URL
  ratingAvg: number;
  totalSessions: number;
  totalStudents: number;
  eloUpRate: number; // % of students that ranked up
  commissionRate?: number; // per-coach commission override (e.g. 0.03 = 3%)
  // Riot integration
  riotPuuid?: string;
  riotGameName?: string;
  riotTagLine?: string;
  riotRank?: string;
  riotTier?: string;
  riotWinRate?: number;
  riotTopChampions?: RiotChampionStat[];
  riotPreferredRole?: string;
  // Discord integration
  discordId?: string;
  discordUsername?: string;
  discordAvatar?: string;
  createdAt: string;
}

export interface RiotChampionStat {
  name: string;
  games: number;
  winRate: number;
  kda: number;
}

export interface CoachGame {
  coachId: string;
  gameId: string;
  rank: string;
  rankTier: "challenger" | "grandmaster" | "master" | "diamond";
  roles: Role[];
  specialties: string[];
  champions: string[];
}

export interface Role {
  id: string;
  name: string;
  icon: string;
}

export interface CoachingOption {
  id: string;
  coachId: string;
  gameId: string;
  type: "live_coaching" | "vod_review" | "duo_coaching" | "champion_specific" | "group_coaching";
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  active: boolean;
  maxPlayers?: number; // for group_coaching (default 5)
}

export interface Availability {
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  timezone: string;
}

export interface TimeSlot {
  date: string; // ISO date
  time: string; // "14:00"
  available: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  coachId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  rankBefore?: string;
  rankAfter?: string;
  sessionsCount?: number;
  createdAt: string;
}

export interface BookingRequest {
  coachId: string;
  coachingOptionId: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
  studentName: string;
  studentEmail: string;
}

export interface Booking {
  id: string;
  coachId: string;
  coachingOptionId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  amountCents: number;
  commissionCents?: number; // commission charged on this booking
  stripeSessionId?: string;
  // Session fields
  sessionStatus?: "scheduled" | "live" | "completed";
  sessionStartedAt?: string;
  sessionEndedAt?: string;
  recordingUrl?: string;
  livekitRoom?: string;
  egressId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: "client" | "coach";
  coachId?: string;
  coachApplicationStatus?: "none" | "pending" | "approved" | "rejected";
  // Riot integration
  riotPuuid?: string;
  riotGameName?: string;
  riotTagLine?: string;
  riotRank?: string;
  riotTier?: string;
  riotWinRate?: number;
  riotTopChampions?: RiotChampionStat[];
  riotPreferredRole?: string;
  // Discord integration
  discordId?: string;
  discordUsername?: string;
  discordAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
}

export interface SessionMaterial {
  id: string;
  bookingId: string;
  uploadedBy: string;
  uploaderName: string;
  type: "video" | "image" | "text";
  url?: string;
  content?: string;
  fileName?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  createdAt: string;
}

// ─── Masterclass ─────────────────────────────────────────
export interface Masterclass {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  coachId: string;
  coachName: string;
  coachAvatar: string;
  gameId: string;
  topic: string;
  tags: string[];
  scheduledDate: string; // ISO date
  scheduledTime: string; // "18:00"
  durationMinutes: number;
  priceCents: number; // 2000 = 20€
  maxAttendees: number;
  currentAttendees: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  imageUrl?: string;
  livekitRoom?: string;
  createdAt: string;
}

export interface MasterclassRegistration {
  id: string;
  masterclassId: string;
  userId: string;
  userName: string;
  userEmail: string;
  stripeSessionId?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

// ─── Coach Application ──────────────────────────────────
export interface CoachApplication {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  gameId: string;
  inGameName: string;
  rank: string;
  rankTier: "challenger" | "grandmaster" | "master" | "diamond";
  roles: string[];
  specialties: string[];
  champions: string[];
  bio: string;
  longBio: string;
  country: string;
  languages: string[];
  coachingTypes: string[]; // which coaching types they want to offer
  // Pricing
  liveCoachingPrice?: number;
  vodReviewPrice?: number;
  duoCoachingPrice?: number;
  championSpecificPrice?: number;
  groupCoachingPrice?: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export type RankTier = "challenger" | "grandmaster" | "master" | "diamond";
