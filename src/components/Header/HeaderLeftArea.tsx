import { ChatHeader, Icon, Label } from '@aurora_app/ui-library';
import { faCheck, faStream } from '@fortawesome/pro-regular-svg-icons';
import { Col, Row } from 'antd';
import { capitalize } from 'lodash';
import React, { FC } from 'react';
import { useMedia } from 'react-use';

import { APPLICATION_STATUS } from '../../utils/constants';
import { ChatHeaderDetails } from './interface';

import styles from './Header.module.scss';

interface Props {
  title: string;
  collapsed: boolean;
  chatInfo: ChatHeaderDetails;
  applicationStatus?: string;
  onCollapse: () => void;
}

export const HeaderLeftArea: FC<Props> = (props) => {
  const { title, collapsed, chatInfo, onCollapse, applicationStatus } = props;
  const submitted = applicationStatus === APPLICATION_STATUS.SUBMITTED;
  const isManyUsers = chatInfo.isManyUsers;
  const isMobile = useMedia('(max-width: 575px)');
  const visible = isMobile || collapsed;

  return (
    <Row type="flex" align="middle" style={{ flex: '1 auto', marginRight: 16 }}>
      <Col className={styles.titleContainer}>
        {visible && <Icon icon={faStream} onClick={onCollapse} />}
        <span className={styles.title} style={{ paddingLeft: visible ? 15 : 0 }}>
          {title}
        </span>
        <ChatHeader
          statusIcon={!isManyUsers && chatInfo.statusIcon}
          iconColor={!isManyUsers && chatInfo.iconColor}
          jobPosition={!isManyUsers && chatInfo.jobPosition}
        />
      </Col>
      {applicationStatus &&
        (submitted ? (
          <Label
            className={styles.statusTag}
            leading={<Icon icon={faCheck} />}
            color={'#2b9037'}
            background={'#e6f7e8'}
          >
            Applied
          </Label>
        ) : (
          <Col>
            <Label className={styles.statusTag} background={'#f3f3f3'} color={'#565656'}>
              {capitalize(applicationStatus)}
            </Label>
          </Col>
        ))}
    </Row>
  );
};

export default HeaderLeftArea;
