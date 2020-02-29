import {
  Accomplishments,
  Application,
  ContactDetails,
  CoverLetter,
  EducationHistory,
  EoeSurvey,
  Languages,
  MilitaryHistory,
  Overview,
  Portfolio,
  Questions,
  References,
  Resume,
  ReviewAndSubmit,
  SecurityClearance,
  StepPage,
  WorkHistory,
} from './Application';
import { ApplyAuth } from './ApplyAuth';
import { FillNewPassword, ForgotPassword, Login } from './Auth';
import { Candidate } from './Candidate';
import { Error403, Error404, Error500, NotFound } from './Exception';
import { Channel } from './Messages';

/*************** App Pages Config ***************/

export const AppPages = {
  Login,
  Channel,
  NotFound,
  Candidate,
  Accomplishments,
  Application,
  ContactDetails,
  CoverLetter,
  EducationHistory,
  EoeSurvey,
  Languages,
  MilitaryHistory,
  Portfolio,
  Questions,
  References,
  Resume,
  ReviewAndSubmit,
  SecurityClearance,
  WorkHistory,
  Overview,
  StepPage,
  FillNewPassword,
  ForgotPassword,
};

/*************** Public Pages Config ***************/

export const PublicPages = { ApplyAuth, Error403, Error404, Error500 };
