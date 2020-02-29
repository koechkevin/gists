import { faStickyNote } from '@fortawesome/pro-regular-svg-icons';
import { Col, Row } from 'antd';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { Accomplishment, JobApplication, MatchParams, Publication, Speaking } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './Accomplishments.module.scss';

interface Props {
  application: JobApplication;
  match: MatchParams;
}

const Accomplishments: React.FC<Props> = (props) => {
  const {
    application: { resume: { accomplishments } },
    match,
  } = props;
  const title: string = 'Accomplishments';

  return (
    <ContentWrapper title={title} icon={faStickyNote} match={match} stepName={StepName.accomplishments}>
      <Row className={styles.accomplishments}>
        <Row className={styles.accomplishment}>
          <Row className={styles.heading}>Licenses & Certification</Row>
          {accomplishments?.licenceCertification &&
            accomplishments.licenceCertification.map((licence: Accomplishment, index: number) => (
              <Row className={styles.item} key={index}>
                {licence.name}
              </Row>
            ))}
          {accomplishments?.licenceCertification && <hr className={styles.space} />}
        </Row>
        <Row className={styles.accomplishment}>
          <Row className={styles.heading}>Associations & Organizations</Row>
          {accomplishments?.associationOrganization &&
            accomplishments.associationOrganization.map((association: Accomplishment, index: number) => (
              <Row className={styles.item} key={index}>
                {association.name}
              </Row>
            ))}
          {accomplishments?.associationOrganization && <hr className={styles.space} />}
        </Row>
        <Row className={styles.accomplishment}>
          <Row className={styles.heading}>Achievements & Honors</Row>
          {accomplishments?.achievementHonor &&
            accomplishments.achievementHonor.map((achievement: Accomplishment, index: number) => (
              <Row className={styles.item} key={index}>
                {achievement.name}
              </Row>
            ))}
          {accomplishments?.achievementHonor && <hr className={styles.space} />}
        </Row>
        <Row className={styles.accomplishment}>
          <Row className={styles.heading}>Publications</Row>
          {accomplishments?.publication &&
            accomplishments.publication.map((publication: Publication, index: number) => (
              <Row key={index}>
                <Col className={styles.lightTitle}> {publication.title}</Col>
                <Col className={styles.serial}>
                  {publication.journalOrSerialName}
                  {publication.issue ? ` - ${publication.issue}` : ''}
                </Col>
              </Row>
            ))}
          {accomplishments?.publication && <hr />}
        </Row>
        <Row className={styles.accomplishment}>
          <Row className={styles.heading}>Speaking Engagements</Row>
          {accomplishments?.speaking &&
            accomplishments.speaking.map((speech: Speaking, index: number) => (
              <span key={index}>
                <Row className={styles.event}>{speech.event}</Row>
                <Row className={styles.type}>{speech.type}</Row>
                <Row className={styles.description}>{speech.description}</Row>
              </span>
            ))}
          {accomplishments?.speaking && <hr />}
        </Row>
      </Row>
    </ContentWrapper>
  );
};

export default Accomplishments;
