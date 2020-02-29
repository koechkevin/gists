import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Auth } from '../models/user';
import { AppPages } from '../pages';
import { StepName } from '../utils/constants';
import { Routes } from './Routes';

const {
  Channel,
  NotFound,
  Candidate,
  Application,
  StepPage,
  References,
  Questions,
  MilitaryHistory,
  Languages,
  ContactDetails,
  EducationHistory,
  CoverLetter,
  Portfolio,
  SecurityClearance,
  WorkHistory,
  Accomplishments,
  EoeSurvey,
  Resume,
  ReviewAndSubmit,
  Overview,
} = AppPages;

export interface RouteConfig {
  name: string;
  path: string;
  query?: string;
  exact?: boolean;
  auth?: Auth;
  routes?: RouteConfig[];
  icon?: IconDefinition | string;
  component?:
    | (React.ComponentClass<any, any> & LoadableExport.LoadableComponent)
    | (React.FunctionComponent<any> & LoadableExport.LoadableComponent);
  hideInMenu?: boolean;
}

const StepRoutes: RouteConfig[] = [
  {
    name: 'Resume',
    path: `${Routes.Application}/${StepName.resume}`,
    component: Resume,
  },
  {
    name: 'Overview',
    path: `${Routes.Application}/${StepName.overview}`,
    component: Overview,
  },
  {
    name: 'Application Work History',
    path: `${Routes.Application}/${StepName.workHistory}`,
    component: WorkHistory,
  },
  {
    name: 'Application Education History',
    path: `${Routes.Application}/${StepName.education}`,
    component: EducationHistory,
  },
  {
    name: 'Accomplishments',
    path: `${Routes.Application}/${StepName.accomplishments}`,
    component: Accomplishments,
  },
  {
    name: 'Application Languages',
    path: `${Routes.Application}/${StepName.languages}`,
    component: Languages,
  },
  {
    name: 'Application Portfolio',
    path: `${Routes.Application}/${StepName.portfolio}`,
    component: Portfolio,
  },
  {
    name: 'Application Military History',
    path: `${Routes.Application}/${StepName.militaryHistory}`,
    component: MilitaryHistory,
  },
  {
    name: 'Application Security Clearance',
    path: `${Routes.Application}/${StepName.securityClearance}`,
    component: SecurityClearance,
  },
  {
    name: 'Application References',
    path: `${Routes.Application}/${StepName.references}`,
    component: References,
  },
  {
    name: 'Contact Information',
    path: `${Routes.Application}/${StepName.contactInformation}`,
    component: ContactDetails,
  },
  {
    name: 'Application Questions',
    path: `${Routes.Application}/${StepName.questions}`,
    component: Questions,
  },
  {
    name: 'Application Cover Letter',
    path: `${Routes.Application}/${StepName.coverLetter}`,
    component: CoverLetter,
  },
  {
    name: 'EOE Survey',
    path: `${Routes.Application}/${StepName.eoeSurvey}`,
    component: EoeSurvey,
  },
  {
    name: 'Review And Submit',
    path: `${Routes.Application}/${StepName.reviewAndSubmit}`,
    component: ReviewAndSubmit,
  },
];

const routesConfig: RouteConfig[] = [
  {
    name: 'Candidate',
    path: `${Routes.Candidate}/:companyId?`,
    component: Candidate,
    routes: [
      {
        name: 'Application',
        path: Routes.Application,
        component: Application,
        routes: [
          {
            name: 'Application References',
            path: `${Routes.Application}/:step?`,
            component: StepPage,
            routes: StepRoutes,
          },
        ],
      },
      {
        name: 'Jobs Applied Channel',
        path: Routes.Channel,
        component: Channel,
      },
    ],
  },
  {
    name: '404 Not Found',
    hideInMenu: true,
    path: '/app/exception/404',
    component: NotFound,
  },
];

export { routesConfig, StepRoutes };
