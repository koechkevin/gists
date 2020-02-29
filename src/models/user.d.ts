// Global declare
declare global {
  interface Window {
    ability: any;
  }
}

// Global auth interface
export interface Auth {
  isChecking: boolean;
  isAuthenticated: boolean;
  permissions: string[];
}

export interface LoginStatus {
  success: boolean;
  message: string;
}

export interface AppKey {
  token: string;
  user?: User;
  userToken: string;
  profile?: UserProfile;
  selectedProfile: string;
}

export interface DecodedToken {
  aud: string; // audience
  iss: string; // issuer
  exp: number; // expiration time
  nbf: string;
  iat: string;
  jti: string;
  type: 'user' | 'profile';
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface BasicAuth extends AuthCredentials {
  passwordCheckOnly?: boolean;
}

export interface BasicUserDetails {
  firstname: string;
  lastname: string;
}

export interface NewUser extends AuthCredentials, BasicUserDetails {}

// User interface
export interface User {
  userId?: string;
  email: string;
  status: number;
  username: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: number;
}

// User profile interface
export interface UserProfile {
  userId?: string;
  status?: string;
  avatarUrl?: string;
  profileId?: string;
  productId?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: number;
  profile?: Profile;
  avatarColor?: string;
  role?: string;
}

// Profile interface
export interface Profile {
  email: string;
  phone: string;
  mobile: string;
  status?: string;
  jobTitle: string;
  username: string;
  avatarUrl: string;
  firstname?: string;
  lastname?: string;
  createdAt: string;
  displayName: string;
  name?: string;
}

export interface ActivityLog {
  id: string;
  createdAt: string;
  avatarUrl: string;
  activity: string;
}
