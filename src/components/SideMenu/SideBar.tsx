import { SideBar as AuroraSideBar, SideBarHeader } from '@aurora_app/ui-library';
import { ProductType } from '@aurora_app/ui-library/lib/utils';
import { Row } from 'antd';
import React, { FC } from 'react';

import { Company } from '../../models/company';
import { JobApplicationMenu } from '../../pages/Application/components';
import { DirectMessageMenu, DraftMenu } from '../../pages/Messages';

import styles from './SideBar.module.scss';

interface Props {
  match: any;
  width?: number;
  company?: Company;
  isMobile?: boolean;
  collapsed: boolean;
  location: Location;
  onOpen?: () => void;
  onCollapse: (collapsed: boolean) => void;
}

const SideBar: FC<Props> = (props) => {
  const { width, match, onOpen, location, company, isMobile, collapsed, onCollapse } = props;

  const handleCollapse = () => {
    if (isMobile) {
      onCollapse(collapsed);
    } else {
      onCollapse(!collapsed);
    }
  };

  return (
    <AuroraSideBar collapsed={collapsed} width={width} className={styles.sideBar}>
      <SideBarHeader
        onOpen={onOpen}
        isMobile={isMobile}
        name={company?.name}
        onCollapse={handleCollapse}
        avatarColor={company?.avatarColor}
        productId={ProductType.Candidate}
        logo={company?.signedLogo?.thumbnails[0].signedUrl}
      />
      <Row className={styles.content}>
        <JobApplicationMenu match={match} location={location} />
        <DraftMenu match={match} />
        <DirectMessageMenu match={match} location={location} />
      </Row>
    </AuroraSideBar>
  );
};

export default SideBar;
