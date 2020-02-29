import { Row } from 'antd';
import { capitalize } from 'lodash';
import React from 'react';

import { CONJUNCTIONS } from '../../../utils/constants';
import { JobApplication, MatchParams, Question } from '../models/interfaces';
import {
  Accomplishments,
  ContactInformation,
  CoverLetter,
  EducationHistory,
  EOESurvey,
  InfoCard,
  Languages,
  MilitaryHistory,
  Overview,
  Portfolio,
  Questions,
  References,
  SecurityClearance,
  WorkExperience,
} from './components';

import styles from './ReviewAndSubmit.module.scss';

interface Questions {
  textQuestions: Question[];
  booleanQuestions: Question[];
}

interface Props {
  match: MatchParams;
  questions: Questions;
  application: JobApplication;
  submitApplication: () => void;
}

const ReviewForm: React.FC<Props> = (props) => {
  const { application, questions, submitApplication } = props;
  const renderCommaSeparatedText = (text?: string): string => (text ? `${text}, ` : '');

  const capitalizeInfo = (response?: string): string => {
    let finalString: string = response ? response : '';
    if (response?.includes('-')) {
      finalString = response.replace(/-/g, ' ');

      finalString = finalString
        .split(' ')
        .map((value: string) => (CONJUNCTIONS.includes(value) ? value : capitalize(value)))
        .join(' ');
    } else {
      finalString = capitalize(response);
    }

    return finalString;
  };

  return (
    <Row justify="space-between" className={styles.reviewAndSubmit}>
      <InfoCard application={application} onSubmit={submitApplication} />
      <Overview application={application} match={props.match} />
      <WorkExperience application={application} match={props.match} />
      <EducationHistory application={application} match={props.match} />
      <Accomplishments application={application} match={props.match} />
      <Languages application={application} capitalizeInfo={capitalizeInfo} match={props.match} />
      <Portfolio application={application} match={props.match} />
      <MilitaryHistory
        application={application}
        renderCommaSeparatedText={renderCommaSeparatedText}
        match={props.match}
      />
      <SecurityClearance
        application={application}
        renderCommaSeparatedText={renderCommaSeparatedText}
        match={props.match}
      />
      <References renderCommaSeparatedText={renderCommaSeparatedText} match={props.match} />
      <ContactInformation
        application={application}
        renderCommaSeparatedText={renderCommaSeparatedText}
        match={props.match}
      />
      <Questions questions={questions} match={props.match} />
      <CoverLetter application={application} match={props.match} />
      <EOESurvey application={application} capitalizeInfo={capitalizeInfo} match={props.match} />
    </Row>
  );
};

export default ReviewForm;
