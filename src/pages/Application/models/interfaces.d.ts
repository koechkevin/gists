import { FinishedStep } from '../../../utils/interfaces';
import { Company as EmploymentCompany } from '../WorkHistory/interfaces';

export interface ApplicationState {
  savedNow: boolean;
  questions: Question[];
  responses: Answer[];
  references: any[];
  application: object;
  applicationSteps: Step[];
  applications: JobApplication[];
  applicationForm: ApplicationForm | null;
  militaryHistory: any[];
  securityClearance: SecurityClearance[];
  coverLetter: object | null;
  isReferenceFormValid: boolean;
  addReferenceFormClicked: boolean;
  disableNext: boolean;
  resume: any;
  languages: any[];
  applicationStatus: string;
  isSaving: boolean;
  queryParams: ApplicationParams;
  showEmptyStepCard: boolean;
  validationErrors: any[];
  statusHistories: StatusHistories[];
}

export interface ApplicationParams {
  expand?: string;
}

export interface ApplicationEducation {
  degreeName: string; // the program name
  schoolName: string; // name of the university
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  stillStudying: boolean;
  experience?: string;
  addressCity?: string;
  addressCountry?: string;
  major?: string;
  location?: string;
}

export interface Skill {
  name: string;
  skillId: string;
  masterSkillId?: string;
}

export interface EducationHistory extends ApplicationEducation {
  index: number;
}

export interface Accomplishment {
  name: string;
}

export interface Publication {
  title: string;
  issue: string;
  journalOrSerialName: string;
}

export interface Speaking {
  type: string;
  event: string;
  description: string;
}

export interface EOESurvey {
  genderIdentification?: string;
  veteranStatus?: string;
  disabledStatus?: string;
  raceDesignation?: string;
}

export interface MilitaryHistory {
  country: string;
  branch: string;
  unitDivision: string;
  startYear: number;
  startMonth: string | number;
  endYear: number;
  endMonth: string | number;
}

export interface Phone {
  code?: string;
  number?: string;
}

export interface Reference {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: Phone;
  number?: string | number;
  isDeleted?: boolean;
}

export type QuestionType = 'text' | 'boolean';
export type Status = 'active' | 'inactive';

export interface Question {
  questionId: string;
  formId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  type: 'text' | 'boolean';
  required: boolean;
  status: Status;
  isDeleted: boolean;
  answer?: Answer;
}

export interface Answer {
  applicationId: string;
  questionId: string;
  value: [boolean];
  responseId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: Status;
  isDeleted?: boolean;
}

export interface ContactInfo {
  streetAddress?: string;
  country?: string;
  cityName?: string;
  region?: string;
  postalCode?: string;
  emailAddress?: string;
  phone?: Phone;
  mobilePhone?: Phone;
}

export interface Job {
  jobId: string;
  companyId: string;
  locationId: string;
  departmentId: string;
  typeId: string;
  currencyId: string;
  levelId: string;
  ownerId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  jobAsManagement: boolean;
  vacantsNumber: number;
  isRemote: boolean;
  companyInfoAtTop: boolean;
  departmentInfoAtTop: boolean;
  urgencyLevel: string;
  jobType: string;
  experienceLevel: string;
  jobPrivacyType: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  compensationMinBand: string;
  compensationMaxBand: string;
  description: string;
  degreeName: string;
  companyInfo: string;
  departmentInfo: string;
  status: string;
  isDeleted: boolean;
  isExpired: boolean;
}

export interface JobApplication {
  applicationId: string;
  formId: string;
  companyId: string;
  candidateId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  coverLetterText?: string;
  coverLetterFileId?: string;
  resume: {
    overview?: {
      objective?: string;
      overview?: string;
    };
    contactInformation?: ContactInfo;
    workHistory?: EmploymentCompany[];
    educationHistory?: EducationHistory[];
    militaryHistory?: MilitaryHistory[];
    references?: Reference[];
    languages?: Language[];
    securityClearance?: SecurityClearance[];
    portfolio?: Portfolio;
    accomplishments?: {
      licenceCertification?: Accomplishment[];
      associationOrganization?: Accomplishment[];
      achievementHonor?: Accomplishment[];
      publication?: Publication[];
      speaking?: Speaking[];
    };
    eoeSurvey?: EOESurvey;
    resumeFileId?: string;
  };
  status: string;
  job?: Job;
  steps: FinishedStep[] | null;
  overview?: {
    objective?: string;
    overview?: string;
  };
}

export interface Language {
  language: string;
  proficiency: string;
  number?: number;
  isDeleted?: boolean;
}

export interface SecurityClearance {
  name?: string;
  issuedYear?: string;
  issuedMonth?: string;
}

export interface Portfolio {
  linkedin: string;
  behance: string;
  dribbble: string;
  github: string;
  twitter: string;
  facebook: string;
  url: string;
}

export interface ThumbNail {
  signedUrl: string;
}

export interface Company {
  name: string;
  companyId: string;
  signedLogo: {
    thumbnails: ThumbNail[];
  };
}

export interface Step {
  name: string;
  active: boolean;
  done: boolean;
  path?: string;
  number?: number;
  disabled?: boolean;
  required?: boolean;
  stepName: string;
}

export interface FinishedStep {
  name: string;
}

export interface Params {
  id: string;
  companyId: string;
  step?: string;
}

export interface MatchParams {
  params: Params;
}

export type RequiredStatus = 'optional' | 'required';

export interface ApplicationForm {
  formId: string;
  jobId: string;
  companyId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  resume: {
    stepType: RequiredStatus;
    stepFieldsTypes: {
      uploadResume: RequiredStatus;
    };
  };
  overview: {
    stepType: FieldType;
    stepFieldsTypes: {
      objective: RequiredStatus;
      overview: RequiredStatus;
    };
  };
  workHistory: {
    stepType: RequiredStatus;
    stepFieldsTypes: {
      companyName: RequiredStatus;
      positions: RequiredStatus;
    };
  };
  educationHistory: {
    stepType: RequiredStatus;
    stepFieldsTypes?: any;
  };
  skills: {
    stepType: RequiredStatus;
    stepFieldsTypes?: any;
  };
  accomplishments: {
    stepType: RequiredStatus;
    stepFieldsTypes: {
      licenceCertification: RequiredStatus;
      associationOrganization: RequiredStatus;
      achievementHonor: RequiredStatus;
      publication: RequiredStatus;
      speaking: RequiredStatus;
    };
  };
  languages: {
    stepType: RequiredStatus;
    stepFieldsTypes: {
      language: RequiredStatus;
      proficiency: RequiredStatus;
    };
  };
  portfolio: {
    stepType: RequiredStatus;
    stepFieldsTypes: {
      linkedin: RequiredStatus;
      github: RequiredStatus;
      twitter: RequiredStatus;
      facebook: RequiredStatus;
      behance: RequiredStatus;
      dribbble: RequiredStatus;
      url: RequiredStatus;
    };
  };
  questions: {
    stepType: RequiredStatus;
    stepFieldsTypes?: any;
  };
  references: {
    stepType: RequiredStatus;
    stepFieldsTypes?: any;
  };
  securityClearance: {
    stepType: RequiredStatus;
    stepFieldsTypes: {
      name: RequiredStatus;
      issuedYear?: any;
      issuedMonth?: any;
      issued: RequiredStatus;
    };
  };
  militaryHistory: {
    stepType: RequiredStatus;
    stepFieldsTypes?: any;
  };
  contactInformation: {
    stepType: RequiredStatus;
    stepFieldsTypes: {
      streetAddress: RequiredStatus;
      country: RequiredStatus;
      cityName: RequiredStatus;
      region: RequiredStatus;
      postalCode: RequiredStatus;
      emailAddress: RequiredStatus;
      phoneNumber: RequiredStatus;
      mobileNumber: RequiredStatus;
    };
  };
  coverLetter: {
    stepType: RequiredStatus;
    stepFieldsTypes?: any;
  };
  eoeSurvey: {
    stepType: RequiredStatus;
    stepFieldsTypes?: any;
  };
  status: string;
  isDeleted: boolean;
}

export interface StatusHistory {
  historyId: string;
  applicationId: string;
  createdBy: string;
  createdAt: string;
  oldStatus: string;
  newStatus: string;
  isDeleted: boolean;
  jobTitle: string;
}

export type StatusHistories = StatusHistory[];
