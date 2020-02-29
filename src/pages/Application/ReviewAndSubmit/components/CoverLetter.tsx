import { faFileAlt } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import React from 'react';
import FormatText from 'react-format-text';

import { StepName } from '../../../../utils/constants';
import { JobApplication, MatchParams } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './CoverLetter.module.scss';

interface Props {
  match: MatchParams;
  application: JobApplication;
}

const CoverLetter: React.FC<Props> = (props) => {
  const { application, match } = props;
  const title: string = 'Cover Letter';

  return (
    <ContentWrapper icon={faFileAlt} title={title} match={match} stepName={StepName.coverLetter}>
      <Row className={styles.coverLetter}>
        <FormatText>{application.coverLetterText ? application.coverLetterText : ''}</FormatText>
      </Row>
    </ContentWrapper>
  );
};

export default CoverLetter;
