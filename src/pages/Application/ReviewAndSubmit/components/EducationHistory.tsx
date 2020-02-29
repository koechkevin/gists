import { faGraduationCap } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { getMonthName, getTimeRange, monthsAndYearsDifference } from '../../../../utils/utils';
import { ApplicationEducation as Education, JobApplication, MatchParams } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './EducationHistory.module.scss';

interface Props {
  match: MatchParams;
  application: JobApplication;
}

const EducationHistory: React.FC<Props> = (props) => {
  const { application: { resume: { educationHistory } }, match } = props;
  const title: string = 'Education';

  return (
    <ContentWrapper title={title} icon={faGraduationCap} match={match} stepName={StepName.education}>
      <Row className={styles.educationHistory}>
        {educationHistory &&
          educationHistory.map((education: Education, index: number) => (
            <Row className={styles.education} key={index}>
              <Row className={styles.school}>{education.schoolName}</Row>
              <Row className={styles.degree}>{education.degreeName}</Row>
              <Row className={styles.date}>
                {getMonthName(education.startMonth)} {education.startYear}{' '}
                {(education.endMonth && education.endYear) || education.stillStudying ? '-' : ''}{' '}
                {education.stillStudying ? 'Now' : getMonthName(education.endMonth)} {education.endYear}{' '}
                {education.stillStudying
                  ? education.startMonth && education.startYear
                    ? getTimeRange(monthsAndYearsDifference(education.startMonth, education.startYear))
                    : ''
                  : education.startMonth &&
                    education.startYear &&
                    education.endMonth &&
                    education.endYear &&
                    getTimeRange(
                      monthsAndYearsDifference(
                        education.startMonth,
                        education.startYear,
                        education.endMonth,
                        education.endYear,
                      ),
                    )}
              </Row>
              <hr />
            </Row>
          ))}
      </Row>
    </ContentWrapper>
  );
};

export default EducationHistory;
