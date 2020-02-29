import { Row } from 'antd';
import { Link } from 'dva/router';
import React from 'react';
import styles from './Exception.module.scss';

import HelpAndSupport from './components/HelpAndSupport';

const Error500: React.FC<any> = () => {
  return (
    <Row className={styles.container}>
      <Row type="flex" align="middle" justify="center" className={styles.content}>
        <h1>500</h1>
        <p>Oops. Server Error!</p>
        <Link to="/">Take me back to the dashboard</Link>
      </Row>
      <HelpAndSupport />
    </Row>
  );
};

export default Error500;
