import { faBell, faCopy, faThumbtack, faTimesCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Col, Collapse, Icon, Row } from 'antd';
import React, { FC } from 'react';

import { PanelHeader } from '../../../components';
import styles from './AboutConversation.module.scss';

const { Panel } = Collapse;

interface Props {
  title: string;
}

const AboutConversation: FC<Props> = (props) => {
  const { title } = props;

  return (
    <>
      <div className={styles.title}>
        <span style={{ flex: 1 }}>About {title}</span>
        <span className={styles.closeBtn}>
          <FontAwesomeIcon icon={faTimesCircle} size="lg" />
        </span>
      </div>
      <Row className={styles.recruiter} type="flex">
        <Col className={styles.avatar}>
          <Avatar icon="user" size={48} />
        </Col>
        <Col>
          <h5>Aida ChatBot</h5>
          <Row className={styles.status}>
            <span>Jeff</span>
            <span>Working Remotely</span>
          </Row>
          <span className={styles.position}>Hiring Manager</span>
        </Col>
      </Row>
      <Row className={styles.timestamp}>
        <span>New York</span>
        <span>11:50AM local time</span>
      </Row>
      <Collapse
        bordered={false}
        expandIconPosition="right"
        className={styles.collapse}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        <Panel key="0" header={<PanelHeader icon={faThumbtack} title="Pinned Items" />}>
          Pinned Items
        </Panel>
        <Panel key="1" header={<PanelHeader icon={faCopy} title="Shared Files" />}>
          Shared Files
        </Panel>
        <Panel key="2" header={<PanelHeader icon={faBell} title="Notifications" />}>
          Notifications
        </Panel>
      </Collapse>
    </>
  );
};

export default AboutConversation;
