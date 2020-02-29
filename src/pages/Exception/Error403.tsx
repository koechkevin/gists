import { Row } from 'antd';
import { Link } from 'dva/router';
import React from 'react';

import HelpAndSupport from './components/HelpAndSupport';
import styles from './Exception.module.scss';

const Error403: React.FC<any> = () => {
  return (
    <Row className={styles.container}>
      <Row type="flex" align="middle" justify="center" className={styles.content}>
        <h1>403</h1>
        <p>Unauthorized access</p>
        <Link to="/">Take me back to the dashboard</Link>
      </Row>
      <HelpAndSupport />
    </Row>
  );
};

export default Error403;
