import { Icon, Label, Paragraph, Progress, Text } from '@aurora_app/ui-library';
import { faLongArrowAltLeft } from '@fortawesome/pro-solid-svg-icons';
import { Row } from 'antd';
import { Link } from 'dva/router';
import React, { FC } from 'react';

import styles from './FormContent.module.scss';

interface Props {
  title: string;
  progressStatus: number;
  goBack: () => void;
}

export const ApplyAuthHeader: FC<Props> = (props) => {
  return (
    <Row className={styles.headerContent}>
      <Row className={styles.headerInfo}>
        <div className={styles.leftHeader}>
          <Icon icon={faLongArrowAltLeft} onClick={props.goBack} className={styles.headerIcon} />
          <Paragraph className={styles.title} ellipsis>
            {props.title}
          </Paragraph>
          <Label>Draft</Label>
        </div>
        <Text className={styles.headerText}>Have an Account ?</Text>
        <Link to="/login" className={styles.headerLink}>
          <Text>Login</Text>
        </Link>
      </Row>
      <Progress square showInfo={false} style={{ width: '100vw' }} percent={props.progressStatus} />
    </Row>
  );
};

export default ApplyAuthHeader;
