import { faShield } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { getMonthName } from '../../../../utils/utils';
import { JobApplication, MatchParams, MilitaryHistory } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './MilitaryHistory.module.scss';

interface Props {
  application: JobApplication;
  match: MatchParams;
  renderCommaSeparatedText: (text?: string) => string;
}

const History: React.FC<Props> = (props) => {
  const { application: { resume: { militaryHistory } }, renderCommaSeparatedText, match } = props;
  const title: string = 'Military History';

  return (
    <ContentWrapper title={title} icon={faShield} match={match} stepName={StepName.militaryHistory}>
      <Row className={styles.militaryHistory}>
        {militaryHistory &&
          militaryHistory.map((military: MilitaryHistory, index: number) => (
            <Row className={styles.item} key={index}>
              {renderCommaSeparatedText(military.country)}
              {renderCommaSeparatedText(military.unitDivision)}
              {renderCommaSeparatedText(military.branch)}
              {getMonthName(military.startMonth)} {military.startYear} {military.endMonth && '-'}{' '}
              {getMonthName(military.endMonth)} {military.endYear}
            </Row>
          ))}
      </Row>
    </ContentWrapper>
  );
};

export default History;
