import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { Col, Row } from 'antd';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { JobApplication, MatchParams } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './Overview.module.scss';

interface Props {
  match: MatchParams;
  application: JobApplication;
}

const Overview: React.FC<Props> = (props) => {
  const title: string = 'Overview';
  const {
    application: { resume: { overview } },
    match,
  } = props;

  return (
    <ContentWrapper icon={faInfoCircle} title={title} match={match} stepName={StepName.overview}>
      <Row className={styles.overview}>
        <Col>
          <Row>
            <Col className={styles.heading}>Objective</Col>
            <Col className={styles.text}>{overview?.objective}</Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col className={styles.heading}>Overview</Col>
            <Col className={styles.text}>{overview?.overview}</Col>
          </Row>
        </Col>
      </Row>
    </ContentWrapper>
  );
};

export default Overview;
