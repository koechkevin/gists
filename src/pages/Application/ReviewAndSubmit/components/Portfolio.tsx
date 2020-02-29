import { Icon } from '@aurora_app/ui-library';
import {
  faBehance,
  faDribbble,
  faFacebookF,
  faGithub,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faFolderOpen, faGlobeAmericas } from '@fortawesome/pro-regular-svg-icons';
import { Col, Row } from 'antd';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { JobApplication, MatchParams } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './Portfolio.module.scss';

interface Props {
  match: MatchParams;
  application: JobApplication;
}

const PortFolio: React.FC<Props> = (props) => {
  const {
    application: { resume: { portfolio } },
    match,
  } = props;
  const title: string = 'Portfolio';
  const gutter: number = 16;

  return (
    <ContentWrapper title={title} icon={faFolderOpen} match={match} stepName={StepName.portfolio}>
      <Row className={styles.portfolio}>
        {portfolio?.linkedin && (
          <Row type="flex" gutter={gutter} className={styles.item}>
            <Col className={styles.icon}>
              <Icon icon={faLinkedin} className={styles.brand} />
            </Col>
            <Col className={styles.text}>{portfolio.linkedin}</Col>
          </Row>
        )}
        {portfolio?.twitter && (
          <Row type="flex" gutter={gutter} className={styles.item}>
            <Col className={styles.icon}>
              <Icon icon={faTwitter} className={styles.brand} />
            </Col>
            <Col className={styles.text}>{portfolio.twitter}</Col>
          </Row>
        )}
        {portfolio?.github && (
          <Row type="flex" gutter={gutter} className={styles.item}>
            <Col className={styles.icon}>
              <Icon icon={faGithub} className={styles.brand} />
            </Col>
            <Col className={styles.text}>{portfolio.github}</Col>
          </Row>
        )}
        {portfolio?.facebook && (
          <Row type="flex" gutter={gutter} className={styles.item}>
            <Col className={styles.icon}>
              <Icon icon={faFacebookF} className={styles.brand} />
            </Col>
            <Col className={styles.text}>{portfolio.facebook}</Col>
          </Row>
        )}
        {portfolio?.behance && (
          <Row type="flex" gutter={gutter} className={styles.item}>
            <Col className={styles.icon}>
              <Icon icon={faBehance} className={styles.brand} />
            </Col>
            <Col className={styles.text}>{portfolio.behance}</Col>
          </Row>
        )}
        {portfolio?.dribbble && (
          <Row type="flex" gutter={gutter} className={styles.item}>
            <Col className={styles.icon}>
              <Icon icon={faDribbble} className={styles.brand} />
            </Col>
            <Col className={styles.text}>{portfolio.dribbble}</Col>
          </Row>
        )}
        {portfolio?.url && (
          <Row type="flex" gutter={gutter} className={styles.item}>
            <Col className={styles.icon}>
              <Icon icon={faGlobeAmericas} className={styles.brand} />
            </Col>
            <Col className={styles.text}>{portfolio.url}</Col>
          </Row>
        )}
      </Row>
    </ContentWrapper>
  );
};

export default PortFolio;
