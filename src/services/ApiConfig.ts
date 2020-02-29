// API url config

const API_VERSION = 'v1';

export const ApiUrl = {
  DRAFTS: `${API_VERSION}/drafts`,
  CHANNEL: `${API_VERSION}/rooms`,
  COMPANY: `${API_VERSION}/company`,
  CAREER_JOBS: `${API_VERSION}/career`,
  MESSAGE: `${API_VERSION}/messages`,
  RESUME: `${API_VERSION}/resumes/resumes`,
  RESUME_PARSE: `${API_VERSION}/resumes/parse`,

  THREAD: `${API_VERSION}/threads`,

  AUTH_LOGIN: `${API_VERSION}/auth/login`,
  AUTH_SIGNUP: `${API_VERSION}/users/register-candidate`,
  AUTH_SELECT_PROFILE: `${API_VERSION}/auth/select-profile`,
  CHECK_USERNAME: `${API_VERSION}/users/exist`,
  AUTH_VERIFY_EMAIL: `${API_VERSION}/users/register-candidate/verify-email`,
  AUTH_RESEND_VERIFY_CODE: `${API_VERSION}/users/register-candidate/resend-verification-message`,

  AUTH_FORGOT_PASSWORD: `${API_VERSION}/users/users/forgot-password`,
  AUTH_FILL_PASSWORD: `${API_VERSION}/users/users/fill-new-password`,

  USER: `${API_VERSION}/users`,
  USER_PROFILE: `${API_VERSION}/users/profiles`,
  USER_MY_PROFILE: `${API_VERSION}/users/my-profiles`,
  USER_ACTIVITY_LOG: `${API_VERSION}/users/activity-log`,
  MY_PROFILE: `${API_VERSION}/users/candidate-profiles`,

  JOBS_ALL: `${API_VERSION}/jobs/jobs`,
  JOBS_CURRENCY: `${API_VERSION}/jobs/currencies`,
  JOBS_LENGTH_TYPE: `${API_VERSION}/jobs/job-length-types`,
  JOBS_EDUCATION_LEVELS: `${API_VERSION}/jobs/education-levels`,
  COMPANIES_ALL: `${API_VERSION}/companies/companies`,

  APPLICATIONS: `${API_VERSION}/jobs/applications`,
  APPLICATION_FORMS: `${API_VERSION}/jobs/application-forms`,
  APPLICATION_QUESTIONS: `${API_VERSION}/jobs/application-questions`,
  APPLICATION_QUESTION_RESPONSES: `${API_VERSION}/jobs/application-question-responses`,
  APPLICATION__STATUS_HISTORY: `${API_VERSION}/jobs/application-status-history`,

  FILE_UPLOAD: `${API_VERSION}/files`,

  GET_LANGUAGES: `${API_VERSION}/languages/languages`,

  GET_WORKSPACES: `${API_VERSION}/companies/workspaces`,
};
