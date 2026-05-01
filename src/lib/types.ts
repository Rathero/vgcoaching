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
  createdAt: string;
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
  type: "live_coaching" | "vod_review" | "duo_coaching" | "champion_specific";
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  active: boolean;
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
  coachId: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  rankBefore: string;
  rankAfter: string;
  sessionsCount: number;
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

export type RankTier = "challenger" | "grandmaster" | "master" | "diamond";
