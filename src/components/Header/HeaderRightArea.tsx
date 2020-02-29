import { Avatar, Button, Icon } from '@aurora_app/ui-library';
import { getNameInitials } from '@aurora_app/ui-library/lib/utils';
import { faBell, faEllipsisV, faLifeRing, faSearch } from '@fortawesome/pro-regular-svg-icons';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Row } from 'antd';
import { get } from 'lodash';
import React, { FC } from 'react';
import { useMedia } from 'react-use';

import { Profile } from '../../models/user';
import { MobileProfileMenu, OptionMenu, ProfileMenu } from './Menu';

import styles from './Header.module.scss';

interface Props {
  location: any;
  profile?: Profile;
  avatarColor?: string;
  applicationStatus?: string;
  onLogout?: () => void;
  onChangePassword?: () => void;
  onRemoveApplication?: () => void;
}

export const HeaderRightArea: FC<Props> = (props) => {
  const { location, onLogout, profile, avatarColor, onChangePassword, onRemoveApplication, applicationStatus } = props;
  const isMobile = useMedia('(max-width: 768px)');
  const visible = location.pathname.includes('application');

  if (isMobile) {
    return (
      <Dropdown
        trigger={['click']}
        overlay={
          <MobileProfileMenu
            profile={profile}
            onLogout={onLogout}
            avatarColor={avatarColor}
            showApplicationItem={visible}
            onChangePassword={onChangePassword}
            applicationStatus={applicationStatus}
            onRemoveApplication={onRemoveApplication}
          />
        }
      >
        <Icon className={styles.moreIcon} icon={faEllipsisV} />
      </Dropdown>
    );
  }

  return (
    <Row type="flex" align="middle">
      {visible && (
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          overlay={<OptionMenu onRemove={onRemoveApplication} applicationStatus={applicationStatus} />}
        >
          <Button size="small" type="primary" className={styles.optionButton}>
            <span style={{ marginRight: 8 }}>Options</span>
            <FontAwesomeIcon icon={faAngleDown} />
          </Button>
        </Dropdown>
      )}
      <Icon icon={faSearch} style={{ margin: '0 4px' }} />
      <Icon icon={faLifeRing} style={{ margin: '0 4px' }} />
      <Icon icon={faBell} style={{ margin: '0 4px' }} />
      <Dropdown trigger={['click']} overlay={<ProfileMenu onLogout={onLogout} onChangePassword={onChangePassword} />}>
        <span className={styles.avatar}>
          <Avatar size={32} shape="square" src={get(profile, 'avatarUrl')} style={{ backgroundColor: avatarColor }}>
            {getNameInitials(get(profile, 'username'))}
          </Avatar>
        </span>
      </Dropdown>
    </Row>
  );
};

export default HeaderRightArea;
