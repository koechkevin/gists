import { faSuitcase } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { getMonthName, getTimeRange, monthsAndYearsDifference } from '../../../../utils/utils';
import { JobApplication, MatchParams } from '../../models/interfaces';
import { Company, Position } from '../../WorkHistory/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './WorkExperience.module.scss';

interface Props {
  application: JobApplication;
  match: MatchParams;
}

const WorkExperience: React.FC<Props> = (props) => {
  const { application: { resume: { workHistory } }, match } = props;
  const title: string = 'Work History';

  return (
    <ContentWrapper icon={faSuitcase} title={title} match={match} stepName={StepName.workHistory}>
      <Row className={styles.workExperience}>
        {workHistory &&
          workHistory.map((company: Company, index: number) => (
            <Row className={styles.experience} key={index}>
              <Row className={styles.companyName}>{company.companyName}</Row>
              {company.positions.map((position: Position, index: number) => (
                <Row key={index}>
                  <span className={styles.position}>
                    <Row className={styles.jobTitle}>{position.title}</Row>
                    <Row className={styles.duration}>
                      {getMonthName(position.startMonth)} {position.startYear}{' '}
                      {position.endYear && position.endMonth ? '- ' : ''}
                      {position.stillWorking
                        ? '- Now'
                        : `${getMonthName(position.endMonth)} ${position.endYear ? position.endYear : ''}`}{' '}
                      {position.stillWorking
                        ? position.startMonth && position.startYear
                          ? getTimeRange(monthsAndYearsDifference(position.startMonth, position.startYear))
                          : ''
                        : position.startMonth && position.startYear && position.endMonth && position.endYear
                        ? getTimeRange(
                            monthsAndYearsDifference(
                              position.startMonth,
                              position.startYear,
                              position.endMonth,
                              position.endYear,
                            ),
                          )
                        : ''}
                    </Row>
                    {position.experience && <Row className={styles.description}>{position.experience}</Row>}
                  </span>
                </Row>
              ))}
              {workHistory?.length && <hr />}
            </Row>
          ))}
      </Row>
    </ContentWrapper>
  );
};

export default WorkExperience;
