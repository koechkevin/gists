import { Button, Row } from 'antd';
import { Link } from 'dva/router';
import React from 'react';

import styles from './Exception.module.scss';

const NotFound: React.FC<any> = () => {
  return (
    <Row className={styles.container} type="flex" align="middle" justify="center">
      <div style={{ maxWidth: 400 }}>
        <Row style={{ fontSize: 20 }}>We can’t find the page you are looking for.</Row>
        <Row style={{ marginTop: 12, textAlign: 'center' }}>
          <Link to="/">
            <Button type="primary" shape="round" style={{ fontSize: 13 }}>
              Back to Home
            </Button>
          </Link>
          <Button type="ghost" shape="round" style={{ marginLeft: 16, fontSize: 13 }}>
            Previous Page
          </Button>
        </Row>
      </div>
    </Row>
  );
};

export default NotFound;
