import {
  faBell,
  faCopy,
  faFileAlt,
  faList,
  faMale,
  faThumbtack,
  faTimesCircle,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse, Icon } from 'antd';
import React, { FC } from 'react';

import { PanelHeader } from '../../../components';
import styles from './AboutChannel.module.scss';

const { Panel } = Collapse;

interface Props {
  title: string;
}

const AboutChannel: FC<Props> = (props) => {
  const { title } = props;

  return (
    <>
      <div className={styles.title}>
        <span style={{ flex: 1 }}>About {title}</span>
        <span className={styles.closeBtn}>
          <FontAwesomeIcon icon={faTimesCircle} size="lg" />
        </span>
      </div>
      <Collapse
        bordered={false}
        expandIconPosition="right"
        className={styles.collapse}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        <Panel key="0" header={<PanelHeader icon={faMale} title="Members" />}>
          Members
        </Panel>
        <Panel key="1" header={<PanelHeader icon={faList} title="Activity Logs" />}>
          Activity Logs
        </Panel>
        <Panel key="2" header={<PanelHeader icon={faFileAlt} title="Channel Details" />}>
          Shared Files
        </Panel>
        <Panel key="3" header={<PanelHeader icon={faThumbtack} title="Pinned Items" />}>
          Pinned Items
        </Panel>
        <Panel key="4" header={<PanelHeader icon={faCopy} title="Shared Files" />}>
          Shared Files
        </Panel>
        <Panel key="5" header={<PanelHeader icon={faBell} title="Notifications" />}>
          Notifications
        </Panel>
      </Collapse>
    </>
  );
};

export default AboutChannel;
