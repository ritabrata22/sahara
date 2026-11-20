export type Language = 'en' | 'hi' | 'gu';

export type TabId = 'home' | 'earnings' | 'safety' | 'support' | 'profile';

export type EarningsSubTab = 'jobs' | 'ledger' | 'skills';

export type SupportMode = 'partner' | 'employers' | 'pilot';

export type PassportViewMode = 'passport' | 'privacy';

export type PassportFieldKey =
  | 'incomeSummary'
  | 'workHistory'
  | 'skillRecords'
  | 'references'
  | 'identityStatus';

export interface JobOpportunity {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  payLabel: string;
  postedDate: string;
  verified: boolean;
  verifiedBy: string;
  employerName: string;
  imageUrl?: string;
  description: string;
  requirements: string[];
  applied?: boolean;
  appliedAt?: string;
  sharedFields?: PassportFieldKey[];
}

export interface IncomeEntry {
  id: string;
  date: string;
  dayLabel: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  source: 'voice' | 'manual';
  transcript?: string;
}

export interface SkillCourse {
  id: string;
  title: string;
  provider: string;
  duration: string;
  modules: string[];
  completedModules: number;
  certified: boolean;
  imageUrl?: string;
}

export interface WorkRecordItem {
  id: string;
  role: string;
  employer: string;
  period: string;
  verifiedBy: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  relation: string;
  location: string;
  note: string;
}

export interface ConsentGrant {
  id: string;
  recipient: string;
  purpose: string;
  fields: PassportFieldKey[];
  grantedAt: string;
  active: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  selectedForTrip: boolean;
}

export interface HelpPoint {
  id: string;
  name: string;
  type: 'police' | 'care' | 'transit';
  address: string;
  distance: string;
  hours: string;
  phone: string;
  x: number;
  y: number;
}

export interface SupportResource {
  id: string;
  name: string;
  category: 'care' | 'legal' | 'health' | 'government';
  address: string;
  hours: string;
  phone: string;
  summary: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  targetTab?: TabId;
}

export interface PilotEnquiry {
  id: string;
  name: string;
  organization: string;
  role: 'NGO / SHG' | 'Local Employer' | 'Research / Civic' | 'Worker Community';
  message: string;
  submittedAt: string;
}

export interface SaharaState {
  language: Language;
  userName: string;
  userTitle: string;
  userLocation: string;
  identityVerified: boolean;
  partnerConfirmed: boolean;
  monthlyBaseIncome: number;
  jobs: JobOpportunity[];
  ledger: IncomeEntry[];
  courses: SkillCourse[];
  workHistory: WorkRecordItem[];
  references: ReferenceItem[];
  consentGrants: ConsentGrant[];
  trustedContacts: TrustedContact[];
  lastCheckInTime: string;
  lastCheckInCoords: string | null;
  tripSharingActive: boolean;
  tripDestination: string;
  notifications: AppNotification[];
  pilotEnquiries: PilotEnquiry[];
}
