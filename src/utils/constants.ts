import { OptionProps } from 'antd/lib/select';
import range from 'lodash/range';

import { EducationHistory, Step } from '../pages/Application/models/interfaces';

// Global product id
export const ProductId = 'candidate-portal';

export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPageCount: number;
}

export const localStorageKey = {
  APP_KEY_STORE: 'AURORA-CANDIDATE-APP-KEY',
  PROFILE_MODEL: 'AURORA-CANDIDATE-APP-PROFILE-MODEL',
};

export const cookieKeys = {
  USER_TOKEN_KEY: 'AURORA-CANDIDATE-APP-USER-KEY',
  PROFILE_TOKEN_KEY: 'AURORA-CANDIDATE-APP-PROFILE-KEY',
  SELECTED_PROFILE_ID: 'AURORA-CANDIDATE-APP-PROFILE-ID',
};

// API request error code message
export const codeMessage = {
  200: 'Request succeeded',
  201: 'Resource created.',
  204: 'No Content - Request succeeded, but no response body',
  400: 'Bad Request - Could not parse request',
  401: 'Unauthorized - No authentication credentials provided or authentication failed',
  403: 'Forbidden - Authenticated user does not have access',
  404: 'Not Found - Resource not found',
  415: 'Unsupported Media Type - POST/PUT/PATCH request occurred without a "application/json" content type',
  422: 'Data validation failed',
  500: 'An internal server error occurred',
  502: 'Gateway error',
  504: 'Gateway timeout',
};

export enum StepName {
  resume = 'resume',
  overview = 'overview',
  workHistory = 'workHistory',
  coverLetter = 'coverLetter',
  portfolio = 'portfolio',
  securityClearance = 'securityClearance',
  accomplishments = 'accomplishments',
  eoeSurvey = 'eoeSurvey',
  skills = 'skills',
  languages = 'languages',
  questions = 'questions',
  references = 'references',
  militaryHistory = 'militaryHistory',
  contactInformation = 'contactInformation',
  educationHistory = 'educationHistory',
  education = 'education',
  reviewAndSubmit = 'reviewAndSubmit',
}

export enum EoeSurveyConstants {
  male = 'male',
  female = 'female',
  noAnswer = 'choose-not-answer',
  vietnam = 'vietnam',
  disabledVet = 'disabled-veteran',
  newSeparatedVet = 'newly-separated-vet',
  otherVet = 'other-eligible-vet',
  disabled = 'disabled',
  hispanicLatino = 'hispanic-or-latino',
  white = 'white',
  african = 'black-or-african-american',
  hawaiian = 'native-hawaiian-or-pacific-islander',
  asian = 'asian',
  americanIndianAlaska = 'american-indian-or-alaska-native',
  twoOrMore = 'two-or-more-races',
}

export const ApplicationSteps: Step[] = [
  {
    name: 'Resume',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.resume,
  },
  {
    name: 'Overview',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.overview,
  },
  {
    name: 'Work History',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.workHistory,
  },
  {
    name: 'Education',
    active: false,
    done: false,
    required: false,
    disabled: true,
    // FIXME: Special case, field is `education_history` in application form, but step name is `education`
    stepName: StepName.education,
  },
  // { // TODO: don't need to implement now
  //   name: 'Skills',
  //   active: false,
  //   done: false,
  //   required: false,
  //   disabled: true,
  //   stepName: StepName.skills,
  // },
  {
    name: 'Accomplishments',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.accomplishments,
  },
  {
    name: 'Languages',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.languages,
  },
  {
    name: 'Portfolio',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.portfolio,
  },
  {
    name: 'Military History',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.militaryHistory,
  },
  {
    name: 'Security Clearance',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.securityClearance,
  },
  {
    name: 'References',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.references,
  },
  {
    name: 'Contact Information',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.contactInformation,
  },
  {
    name: 'Questions',
    active: true,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.questions,
  },
  {
    name: 'Cover Letter',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.coverLetter,
  },
  {
    name: 'EOE Survey',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.eoeSurvey,
  },
  {
    name: 'Review and Apply',
    active: false,
    done: false,
    required: false,
    disabled: true,
    stepName: StepName.reviewAndSubmit,
  },
];

export enum ClosedQuestionChoices {
  YES = 'Yes',
  NO = 'No',
}

export const Months = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export const MonthNames: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export enum EducationFields {
  degreeName = 'degreeName',
  schoolName = 'schoolName',
  startMonth = 'startMonth',
  endMonth = 'endMonth',
  startYear = 'startYear',
  endYear = 'endYear',
  startDate = 'startDate',
  endDate = 'endDate',
  stillStudying = 'stillStudying',
}

export const EmptyEducation: EducationHistory = {
  index: 0,
  degreeName: '',
  schoolName: '',
  startYear: '',
  endYear: '',
  startMonth: '',
  endMonth: '',
  stillStudying: false,
};

export const ProficiencyOptions: OptionProps[] = [
  { value: 'Beginner' },
  { value: 'Intermediate' },
  { value: 'Conversational' },
  { value: 'Fluent' },
  { value: 'Native or Bi-Lingual' },
];

export enum WorkHistoryFields {
  TITLE = 'title',
  POSITION = 'position',
  LOCATION = 'addressCountry',
  EXPERIENCE = 'experience',
  STILL_WORKING = 'stillWorking',
  START_MONTH = 'startMonth',
  START_YEAR = 'startYear',
  END_MONTH = 'endMonth',
  END_YEAR = 'endYear',
}

export enum AccomplishmentCategories {
  LICENCE_CERTIFICATION = 'licenceCertification',
  ASSOCIATION_ORGANIZATION = 'associationOrganization',
  ACHIEVEMENT_HONOR = 'achievementHonor',
  PUBLICATION = 'publication',
  SPEAKING = 'speaking',
}

export enum ChannelTypes {
  DirectMessage = 'direct-message',
  SelfMessage = 'self-message',
  ChatBotMessage = 'chatbot-direct-message',
}

export const CurrentYear: number = new Date().getFullYear();

export const SelectYearOptions: OptionProps[] = range(1800, CurrentYear + 1)
  .reverse()
  .map((year) => ({ value: year }));

export const SelectMonthOptions: OptionProps[] = MonthNames.map((month: string) => ({
  value: month,
}));

export enum APPLICATION_STATUS {
  INVITED_TO_JOB = 'invited-to-job',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  WITHDRAWN = 'withdrawn',
  OFFER_RECEIVED = 'offer-received',
  JOB_CLOSED = 'job-closed',
  HIRED = 'hired',
  ARCHIVED = 'archived',
  DEACTIVATED = 'deactivated',
}

export const CONJUNCTIONS = ['and', 'but', 'or', 'nor'];

export enum MessagePermissionType {
  PRIVATE = 'PRIVATE',
}

export enum CHANNEL_TYPES {
  JOB_APPLY = 'job-apply',
}

export enum RolesConstants {
  AuroraAdmin = 'aurora-admin',
  Candidate = 'candidate',
  CompanyAdmin = 'company-admin',
  CompanyRecruiter = 'company-recruiter',
  CompanyMember = 'company-member',
  CompanyGuest = 'company-guest',
  ChatBot = 'chatbot',
  CompanyOwner = 'company-owner',
  CompanyBilling = 'company-billing',
}

export enum ChatColors {
  OnlineGreen = '#39c049',
  OfflineGray = '#d2d2d2',
  ChatBotBlue = '#0050c8',
}

export enum ErrorType {
  MAX_LENGTH = 'max',
  REQUIRED = 'required',
  REGEX = 'regex',
  DATE = 'date',
  EQUAL = 'compareEqual',
  NOT_EQUAL = 'compareNotEqual',
  GREATER_THAN = 'compareGreaterThan',
  GREATER_THAN_OR_EQUAL_TO = 'greaterThanOrEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL_TO = 'lessThanOrEqualTo',
  INVALID = 'invalid',
  BOOLEAN = 'boolean',
}

export enum FormSectionTypes {
  OPTIONAL = 'optional',
  REQUIRED = 'required',
}

export enum WorkspaceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ContactInformationFields {
  streetAddress = 'streetAddress',
  country = 'country',
  cityName = 'cityName',
  region = 'region',
  postalCode = 'postalCode',
  emailAddress = 'emailAddress',
  phone = 'phone',
  mobilePhone = 'mobilePhone',
}

export enum SignUpSteps {
  Email = '1',
  Name = '2',
  Password = '3',
  VerifyEmail = '4',
  Completed = '4',
}

export enum SignUpProgress {
  Email = 0,
  Name = 25,
  Password = 50,
  VerifyEmail = 75,
  Completed = 100,
  goToPrevious = -25,
}
