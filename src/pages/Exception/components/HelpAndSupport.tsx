import { Card, Col, Row } from 'antd';
import { Link } from 'dva/router';
import React from 'react';
import styles from '../Exception.module.scss';

export default function HelpAndSupport() {
  return (
    <Row justify="center" className={styles.card}>
      <Card.Grid>
        <Col span={8}><svg className={styles.icon}><use xlinkHref="#play-screen" /></svg></Col>
        <Col span={16}>
          <Link to="/">How To Guide</Link>
          <p>Learn how to use Aurora features for your recruitment process.</p>
        </Col>
      </Card.Grid>
      <Card.Grid>
        <Col span={8}><svg className={styles.icon}><use xlinkHref="#help-center" /></svg></Col>
        <Col span={16}>
          <Link to="/">Aurora Help Center</Link>
          <p>Get answers to some of our frequently asked questions.</p>
        </Col>
      </Card.Grid>
      <Card.Grid>
        <Col span={8}><svg className={styles.icon}><use xlinkHref="#support" /></svg></Col>
        <Col span={16}>
          <Link to="/">Contact Support</Link>
          <p>Our support center will guide you trough your troubleshooting in no time.</p>
        </Col>
      </Card.Grid>
    </Row>
  );
}
