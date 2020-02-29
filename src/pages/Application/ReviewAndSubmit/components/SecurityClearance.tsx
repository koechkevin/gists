import { faShieldAlt } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import { get } from 'lodash';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { getMonth } from '../../../../utils/utils';
import { JobApplication, MatchParams, SecurityClearance } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './SecurityClearance.module.scss';

interface Props {
  application: JobApplication;
  match: MatchParams;
  renderCommaSeparatedText: (text?: string) => string;
}

const Clearance: React.FC<Props> = (props) => {
  const { application: { resume: { securityClearance } }, renderCommaSeparatedText, match } = props;
  const title: string = 'Security Clearance';

  return (
    <ContentWrapper title={title} icon={faShieldAlt} match={match} stepName={StepName.securityClearance}>
      <Row className={styles.securityClearance}>
        {securityClearance &&
          securityClearance.map((clearance: SecurityClearance, index: number) => {
            const month: string = get(clearance, 'issuedMonth', '');
            const textMonth: string = month ? getMonth(month) : '';

            return (
              <Row className={styles.item} key={index}>
                {textMonth || clearance.issuedYear ? renderCommaSeparatedText(clearance.name) : clearance.name}
                {textMonth} {get(clearance, 'issuedYear', '')}
              </Row>
            );
          })}
      </Row>
    </ContentWrapper>
  );
};

export default Clearance;
