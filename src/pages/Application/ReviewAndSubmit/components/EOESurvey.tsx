import { faIdCardAlt } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { JobApplication, MatchParams } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './EOESurvey.module.scss';

interface Props {
  application: JobApplication;
  match: MatchParams;
  capitalizeInfo: (response?: string) => string;
}

const EOESurvey: React.FC<Props> = (props) => {
  const { application: { resume: { eoeSurvey } }, capitalizeInfo, match } = props;
  const title: string = 'EOE Survey';

  return (
    <ContentWrapper title={title} icon={faIdCardAlt} match={match} stepName={StepName.eoeSurvey}>
      <Row className={styles.eoeSurvey}>
        <Row className={styles.item}>
          <Row className={styles.minorTitle}>Gender</Row>
          <Row>{eoeSurvey ? capitalizeInfo(eoeSurvey.genderIdentification) : ''}</Row>
        </Row>
        <Row className={styles.item}>
          <Row className={styles.minorTitle}>Veteran Status</Row>
          <Row>{eoeSurvey ? capitalizeInfo(eoeSurvey.veteranStatus) : ''}</Row>
        </Row>
        <Row className={styles.item}>
          <Row className={styles.minorTitle}>Disability</Row>
          <Row>{eoeSurvey ? capitalizeInfo(eoeSurvey.disabledStatus) : ''}</Row>
        </Row>
        <Row className={styles.item}>
          <Row className={styles.minorTitle}>Ethnicity</Row>
          <Row>{eoeSurvey ? capitalizeInfo(eoeSurvey.raceDesignation) : ''}</Row>
        </Row>
      </Row>
    </ContentWrapper>
  );
};

export default EOESurvey;
