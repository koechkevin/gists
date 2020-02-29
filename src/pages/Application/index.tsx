import { Loading } from '@aurora_app/ui-library';
import React from 'react';
import Loadable from 'react-loadable';

import { registerModel } from '../../utils';
import { default as ApplicationModel } from './models/application';

const Application = Loadable.Map({
  loader: {
    Application: () => import('./Application'),
    fileModel: () => import('../../models/fileUpload'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Application = loaded.Application.default;
    const fileModel = loaded.fileModel.default;

    registerModel(props.app, fileModel);

    return <Application {...props} app={props.app} />;
  },
});

const StepPage = Loadable.Map({
  loader: {
    StepPage: () => import('./StepPage'),
    fileModel: () => import('../../models/fileUpload'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const StepPage = loaded.StepPage.default;
    return <StepPage {...props} app={props.app} />;
  },
});

const References = Loadable.Map({
  loader: {
    References: () => import('./References/References'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const References = loaded.References.default;

    return <References {...props} app={props.app} />;
  },
});

const MilitaryHistory = Loadable.Map({
  loader: {
    MilitaryHistory: () => import('./MilitaryHistory/MilitaryHistory'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const MilitaryHistory = loaded.MilitaryHistory.default;

    return <MilitaryHistory {...props} app={props.app} />;
  },
});

const Questions = Loadable.Map({
  loader: {
    Questions: () => import('./Questions/Questions'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Questions = loaded.Questions.default;

    return <Questions {...props} app={props.app} />;
  },
});

const Languages = Loadable.Map({
  loader: {
    Languages: () => import('./Languages/Languages'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Languages = loaded.Languages.default;

    return <Languages {...props} app={props.app} />;
  },
});
const ContactDetails = Loadable.Map({
  loader: {
    ContactDetails: () => import('./ContactDetails/ContactDetails'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const ContactDetails = loaded.ContactDetails.default;

    return <ContactDetails {...props} app={props.app} />;
  },
});

const EducationHistory = Loadable.Map({
  loader: {
    EducationHistory: () => import('./EducationHistory/EducationHistory'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const EducationHistory = loaded.EducationHistory.default;

    return <EducationHistory {...props} app={props.app} />;
  },
});

const SecurityClearance = Loadable.Map({
  loader: {
    SecurityClearance: () => import('./SecurityClearance/SecurityClearance'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const SecurityClearance = loaded.SecurityClearance.default;
    return <SecurityClearance {...props} app={props.app} />;
  },
});

const Portfolio = Loadable.Map({
  loader: {
    Portfolio: () => import('./Portfolio/Portfolio'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Portfolio = loaded.Portfolio.default;

    return <Portfolio {...props} app={props.app} />;
  },
});

const CoverLetter = Loadable.Map({
  loader: {
    CoverLetter: () => import('./CoverLetter/CoverLetter'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const CoverLetter = loaded.CoverLetter.default;

    return <CoverLetter {...props} app={props.app} />;
  },
});

const WorkHistory = Loadable.Map({
  loader: {
    WorkHistory: () => import('./WorkHistory/WorkHistory'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const WorkHistory = loaded.WorkHistory.default;

    return <WorkHistory {...props} />;
  },
});

const Accomplishments = Loadable.Map({
  loader: {
    Accomplishments: () => import('./Accomplishments/Accomplishments'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Accomplishments = loaded.Accomplishments.default;

    return <Accomplishments {...props} />;
  },
});

const EoeSurvey = Loadable.Map({
  loader: {
    EoeSurvey: () => import('./EoeSurvey/EoeSurvey'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const EoeSurvey = loaded.EoeSurvey.default;

    return <EoeSurvey {...props} app={props.app} />;
  },
});

const Resume = Loadable.Map({
  loader: {
    Resume: () => import('./Resume/Resume'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Resume = loaded.Resume.default;

    return <Resume {...props} app={props.app} />;
  },
});

const ReviewAndSubmit = Loadable.Map({
  loader: {
    ReviewAndSubmit: () => import('./ReviewAndSubmit/ReviewAndSubmit'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const ReviewAndSubmit = loaded.ReviewAndSubmit.default;

    return <ReviewAndSubmit {...props} app={props.app} />;
  },
});

const Overview = Loadable.Map({
  loader: {
    Overview: () => import('./Overview/Overview'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Overview = loaded.Overview.default;

    return <Overview {...props} app={props.app} />;
  },
});

export {
  Application,
  StepPage,
  Accomplishments,
  ApplicationModel,
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
  SecurityClearance,
  WorkHistory,
  ReviewAndSubmit,
  Overview,
};
