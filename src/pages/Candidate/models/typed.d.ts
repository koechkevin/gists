export interface TypedSteps {
  id?: number;
  name?: string;
}

export interface QuestionTyped {
  id: number;
  question: string;
  required: boolean;
  type: string;
}

export interface Job {
  jobId: string;
  jobTitle: string;
  role: string;
  description: string;
  compensation: string;
  steps: T[TypedSteps];
  step: TypedSteps;
  otherSteps: T[string];
  questions: T[QuestionTyped];
  company?: Company;
}

export interface EmailTyped {
  type?: string;
  email?: string;
}

export interface PhoneTyped {
  type?: string;
  phone?: string;
}

export interface ContactTyped {
  email?: T[EmailTyped];
  phone?: T[PhoneTyped];
  location?: string;
}

export interface ExperienceTyped {
  coverLetter?: string;
}

export interface WorkTyped {
  company?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  country?: string;
  state?: string;
  city?: string;
  experience?: T[string];
}

export interface EducationTyped {
  school?: string;
  program?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  country?: string;
  state?: string;
  city?: string;
  experience?: T[string];
}

export interface PortFolioTyped {
  linkedin: string;
  behance: string;
  github: string;
  twitter: string;
  facebook: string;
}

interface AvailabilityTyped {
  key: string;
  current: boolean;
}

export interface User {
  id: number;
  firstname: string;
  middleName?: string;
  lastname: string;
  profile?: string;
  salary?: number;
  availability: [AvailabilityTyped];
  contact: ContactTyped;
  experience: ExperienceTyped;
  workHistory: T[WorkTyped];
  education: T[EducationTyped];
  portfolio: PortFolioTyped;
}

export interface Company {
  companyId?: string;
  name?: string;
  industry: string;
  location: string;
  logo: string;
  signedLogo: any;
  avatarColor: string;
  jobs: [TypedJobList];
}

export type Jobs = Company[];
