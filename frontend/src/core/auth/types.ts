// ========================================
// E-petitpas AI School - Auth Types
// ========================================

export type UserRole = 'STUDENT' | 'ADMIN';

export type AccountStatus = 'ACTIF' | 'INACTIF' | 'BLOQUE' | 'EN_ATTENTE_VALIDATION';

export type AdminValidationStatus = 
  | 'PENDING'           // En attente de confirmation email
  | 'EMAIL_CONFIRMED'   // Email confirmé, en attente validation admin  
  | 'ADMIN_APPROVED'    // Approuvé par admin
  | 'REJECTED';         // Rejeté par admin

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  statutCompte: AccountStatus;
  profileImage?: string;
  emailVerifiedAt?: string;
  preferences?: {
    academic_level?: string;
    subjects?: string[];
    learning_preferences?: Record<string, boolean>;
    language?: string;
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
  adminValidation?: AdminValidation;
  createdAt: string;
  updatedAt: string;
}

export interface AdminValidation {
  id: string;
  userId: string;
  requestType: string;
  status: AdminValidationStatus;
  emailConfirmedAt?: string;
  emailToken?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  justification?: string;
  requestedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  initialized: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  preferences?: User['preferences'];
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  code?: string;
}