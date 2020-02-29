import { Avatar, Icon, IconMenuItem, Menu } from '@aurora_app/ui-library';
import { getNameInitials } from '@aurora_app/ui-library/lib/utils';
import { faBell, faFileAlt, faLifeRing, faSearch, faTrashAlt } from '@fortawesome/pro-regular-svg-icons';
import { Col, Menu as AntdMenu, Row, Typography } from 'antd';
import { get } from 'lodash';
import React, { FC } from 'react';

import { Profile } from '../../models/user';
import { APPLICATION_STATUS } from '../../utils/constants';

import styles from './Menu.module.scss';

const { Item, Divider } = AntdMenu;
const { Title, Text } = Typography;

interface ProfileMenuProps {
  onLogout?: () => void;
  onChangePassword?: () => void;
}

export const ProfileMenu: FC<ProfileMenuProps> = (props) => {
  const { onLogout, onChangePassword, ...restProps } = props;

  return (
    <Menu width={240} {...restProps}>
      <Item key="0">My Profile</Item>
      <Item key="1" onClick={onChangePassword}>
        Change Password
      </Item>
      <Item key="2" onClick={onLogout}>
        Logout
      </Item>
    </Menu>
  );
};

interface MobileProfileMenuProps extends ProfileMenuProps {
  profile?: Profile;
  avatarColor?: string;
  showApplicationItem?: boolean;
  applicationStatus?: string;
  onSaveApplication?: () => void;
  onRemoveApplication?: () => void;
}

export const MobileProfileMenu: FC<MobileProfileMenuProps> = (props) => {
  const {
    profile,
    onLogout,
    avatarColor,
    onChangePassword,
    onRemoveApplication,
    showApplicationItem,
    applicationStatus,
    ...restProps
  } = props;

  return (
    <Menu width={240} {...restProps}>
      <Item key="0" style={{ height: 'unset', marginTop: 8 }}>
        <Row type="flex" align="middle" className={styles.profileWrapper}>
          <Avatar size={40} shape="square" src={get(profile, 'avatarUrl')} style={{ backgroundColor: avatarColor }}>
            {getNameInitials(get(profile, 'firstname'))}
          </Avatar>
          <Col style={{ marginLeft: 16, overflow: 'hidden' }}>
            <Title level={4} ellipsis className={styles.title}>
              {`${get(profile, 'firstname')} ${get(profile, 'lastname')}`}
            </Title>
            <Text ellipsis className={styles.email}>
              {get(profile, 'email')}
            </Text>
          </Col>
        </Row>
      </Item>
      <Item key="1">
        <IconMenuItem icon={<Icon icon={faBell} />}>Notifications</IconMenuItem>
      </Item>
      <Item key="2">
        <IconMenuItem icon={<Icon icon={faLifeRing} />}>Help</IconMenuItem>
      </Item>
      <Item key="3">
        <IconMenuItem icon={<Icon icon={faSearch} />}>Search</IconMenuItem>
      </Item>
      <Divider />
      {showApplicationItem && (
        <Item key="4">
          <IconMenuItem icon={<Icon icon={faFileAlt} />}>Save as a resume</IconMenuItem>
        </Item>
      )}
      {showApplicationItem && applicationStatus === APPLICATION_STATUS.DRAFT && (
        <Item key="5" onClick={onRemoveApplication}>
          <IconMenuItem icon={<Icon icon={faTrashAlt} />}>Delete Application</IconMenuItem>
        </Item>
      )}
      {showApplicationItem && <Divider />}
      <Item key="6" onClick={onChangePassword}>
        Change Password
      </Item>
      <Item key="7" onClick={onLogout}>
        Logout
      </Item>
    </Menu>
  );
};

interface OptionMenuProps {
  onSave?: () => void;
  onRemove?: () => void;
  applicationStatus?: string;
}

export const OptionMenu: FC<OptionMenuProps> = (props) => {
  const { onSave, onRemove, applicationStatus, ...restProps } = props;

  return (
    <Menu width={240} {...restProps}>
      <Item key="0" onClick={onSave}>
        <IconMenuItem icon={<Icon icon={faFileAlt} />}>Save as a resume</IconMenuItem>
      </Item>
      {applicationStatus === APPLICATION_STATUS.DRAFT && (
        <Item key="1" onClick={onRemove}>
          <IconMenuItem icon={<Icon icon={faTrashAlt} />}>Remove Application</IconMenuItem>
        </Item>
      )}
    </Menu>
  );
};
