import { Text } from '@aurora_app/ui-library';
import { Col, Row } from 'antd';
import React, { FC } from 'react';
import { useMedia } from 'react-use';

import styles from './AuthPageLayout.module.scss';

const logo = `${process.env.PUBLIC_URL}/images/icons/logo-2.svg`;
const namelessLogo = `${process.env.PUBLIC_URL}/images/icons/logo-without-name.svg`;

const AuthPageLayout: FC<any> = (props) => {
  const { children } = props;
  const isMobile: boolean = useMedia('(max-width:575px)');
  return (
    <Row className={styles.layout}>
      <Row className={styles.header}>
        <Row type="flex" justify="center" className={styles.logo}>
          <img src={isMobile ? namelessLogo : logo} height={isMobile ? 24 : 50} alt="Aurora Logo" />
        </Row>
      </Row>
      <Row type="flex" justify="center">
        <Col className={styles.content}>{children}</Col>
      </Row>
      <Row className={styles.footer}>
        <Row type="flex" justify="center">
          <Text>
            Powered by <img src={logo} alt="Aurora Logo" width={77} height={17} />
          </Text>
        </Row>
      </Row>
    </Row>
  );
};

export default AuthPageLayout;
