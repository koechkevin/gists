import { Text, Title } from '@aurora_app/ui-library';
import { Row } from 'antd';
import { Link } from 'dva/router';
import React, { FC } from 'react';

import { Routes } from '../../../routes/Routes';

import styles from './EmailForm.module.scss';

const AfterEmailSent: FC<any> = () => {
  return (
    <Row className={styles.align}>
      <Title className={styles.title} level={3}>
        Password reset request received!
      </Title>
      <Text className={styles.text}>
        If there is a user with that email you will receive an email to finish password reset process.
      </Text>

      <Row style={{ marginTop: 40, textAlign: 'center' }}>
        <Link to={Routes.Login}>
          <Text className={`${styles.text} ${styles.login}`}>Back to login</Text>
        </Link>
      </Row>
    </Row>
  );
};

export default AfterEmailSent;
